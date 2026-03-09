"use server";

import { db } from "@/lib/db";
// 🚀 新增导入 payments 表
import { addresses, orders, orderItems, payments } from "@/lib/db/schema";
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
    const amountInCents = Math.round(Number(totalAmount.toFixed(2)) * 100);

    // 🚀 开启极其强悍的数据库事务
    const result = await db.transaction(async (tx) => {
      
      // 步骤 A：智能处理收货地址 (Upsert 逻辑)
      const [newAddress] = await tx
        .insert(addresses)
        .values({
          userId: user.id,
          receiverName: validAddress.receiverName,
          phoneNumber: validAddress.phoneNumber,
          addressLine1: validAddress.addressLine1,
          addressLine2: validAddress.addressLine2,
          city: validAddress.city,
          state: validAddress.state,
          postalCode: validAddress.postalCode,
          isDefault: true,
        })
      .onConflictDoUpdate({
        // 目标必须与 Schema 中的 unique 约束完美对齐 (确保你已在 schema 中执行上一轮说的修复)
        target: [addresses.userId, addresses.addressLine1, addresses.postalCode], 
        set: { updatedAt: new Date() } // 如果已存在，仅更新时间
      })
      .returning({ id: addresses.id });

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

      // 🚀 修改：将 newOrder.id (orderId) 返回，供下一步写入 payments 表使用
      return { 
        orderId: newOrder.id, 
        orderNumber: newOrder.orderNumber, 
        userEmail: user.email || "" 
      };
    });

    // 3. 🛡️ 接入真实 Billplz 引擎
    const auth = Buffer.from(`${process.env.BILLPLZ_API_KEY!}:`).toString('base64');
    
    const isProd = process.env.NODE_ENV === "production";
    const billplzUrl = isProd 
      ? "https://www.billplz.com/api/v3/bills" 
      : "https://www.billplz-sandbox.com/api/v3/bills";

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/billplz`;
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${result.orderNumber}`;

    const response = await fetch(billplzUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection_id: process.env.BILLPLZ_COLLECTION_ID!,
        email: result.userEmail,
        name: formData.receiverName,
        amount: amountInCents,
        callback_url: callbackUrl,
        redirect_url: redirectUrl,
        description: `LUXE Order ${result.orderNumber}`,
        reference_1_label: "OrderNumber",
        reference_1: result.orderNumber,
        deliver: true,
      }),
    });

    const bill = await response.json();

    // 异常监控：记录真实生产环境的错误
    if (!bill.url || !bill.id) {
      console.error("[BILLPLZ_PROD_ERROR]", bill);
      throw new Error("Payment gateway is currently unavailable");
    }

    // 🚀 步骤 D：写入防漏单流水 (Financial Logging)
    // 只有这一步完成，你的系统才能安全对接 Callback Webhook
    await db.insert(payments).values({
      orderId: result.orderId,
      billplzBillId: bill.id, 
      amount: amountInCents,
      status: "pending",
    });

    return { 
      success: true, 
      paymentUrl: bill.url,
      orderNumber: result.orderNumber 
    };

  } catch (error: any) {
    console.error("[CHECKOUT_ACTION_ERROR]", error);
    return { 
      success: false, 
      error: error.message || "Something went wrong during checkout" 
    };
  }
}