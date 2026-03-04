"use server";

import { db } from "@/lib/db";
import { addresses, orders, orderItems } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { checkoutSchema, cartItemSchema } from "@/lib/validations/checkout";
import { z } from "zod";

const generateOrderNumber = () => `LUXE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export async function processCheckoutAction(
  formData: z.infer<typeof checkoutSchema>, 
  cartItems: z.infer<typeof cartItemSchema>[]
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("Unauthorized");

    const validAddress = checkoutSchema.parse(formData);
    const validCart = z.array(cartItemSchema).parse(cartItems);

    if (validCart.length === 0) throw new Error("Cart is empty");

    // 1. 计算总额 (RM)
    const totalAmount = validCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 2. 转换成 Billplz 要求的 Cents (例如 RM 1080.00 -> 108000)
    const amountInCents = Math.round(totalAmount * 100);

    // 🚀 开启极其强悍的数据库事务
    const result = await db.transaction(async (tx) => {
      
      // 步骤 A：插入收货地址
      const [newAddress] = await tx.insert(addresses).values({
        userId: user.id,
        receiverName: validAddress.receiverName,
        phoneNumber: validAddress.phoneNumber,
        addressLine1: validAddress.addressLine1,
        addressLine2: validAddress.addressLine2,
        city: validAddress.city,
        state: validAddress.state,
        postalCode: validAddress.postalCode,
        isDefault: true,
      }).returning({ id: addresses.id });

      // 步骤 B：创建订单主表 (状态默认为 pending)
      const orderNum = generateOrderNumber();
      const [newOrder] = await tx.insert(orders).values({
        userId: user.id,
        orderNumber: orderNum,
        totalAmount: totalAmount.toString(), 
        status: "pending",
        addressId: newAddress.id,
      }).returning({ id: orders.id, orderNumber: orders.orderNumber });

      // 步骤 C：批量插入商品明细
      const orderItemsData = validCart.map((item) => ({
        orderId: newOrder.id,
        productSlug: item.id, 
        productName: item.name, 
        price: item.price.toString(), 
        quantity: item.quantity,
        imageUrl: item.imageUrl, 
      }));

      await tx.insert(orderItems).values(orderItemsData);

      return { orderNumber: newOrder.orderNumber, userEmail: user.email };
    });

    // 3. 🛡️ 架构师核心：发起 Billplz 支付请求
    const auth = Buffer.from(`${process.env.BILLPLZ_API_KEY}:`).toString('base64');
    
    // 注意：测试环境使用 billplz-sandbox.com，正式环境去掉 -sandbox
    const billplzUrl = process.env.NODE_ENV === "production" 
      ? "https://www.billplz.com/api/v3/bills" 
      : "https://www.billplz-sandbox.com/api/v3/bills";

    const response = await fetch(billplzUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection_id: process.env.BILLPLZ_COLLECTION_ID,
        email: result.userEmail,
        name: formData.receiverName,
        amount: amountInCents,
        // 回调地址：Billplz 会发 POST 到这里通知你钱收到了
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/billplz`,
        // 跳转地址：用户付完钱后回到的页面
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${result.orderNumber}`,
        description: `LUXE PARADISE Order ${result.orderNumber}`,
        reference_1_label: "OrderNumber",
        reference_1: result.orderNumber,
      }),
    });

    const bill = await response.json();

    if (!bill.url) {
      console.error("Billplz Error Response:", bill);
      throw new Error("Failed to generate payment link");
    }

    // 返回支付链接，前端收到后执行 window.location.href = url
    return { 
      success: true, 
      orderNumber: result.orderNumber, 
      paymentUrl: bill.url 
    };

  } catch (error: any) {
    console.error("Checkout Transaction Failed:", error);
    return { success: false, error: error.message || "Failed to process order" };
  }
}