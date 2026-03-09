// app/api/webhooks/billplz/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, payments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;

    // 🚀 修正 1：动态且具备绝对防御力的签名计算 (Dynamic Signature Calculation)
    // 自动提取所有键，剔除 x_signature，按字母表顺序升序排列后拼接，完全免疫 API 字段的新增
    const keys = Object.keys(payload).filter(k => k !== 'x_signature').sort();
    const signSource = keys.map(k => `${k}${payload[k]}`).join('|');

    const signature = crypto
      .createHmac('sha256', process.env.BILLPLZ_X_SIGNATURE!)
      .update(signSource)
      .digest('hex');

    if (signature !== payload.x_signature) {
      console.error("[SECURITY_BREACH] Invalid Webhook Signature", { ip: req.headers.get('x-forwarded-for') });
      return new NextResponse("Invalid Signature", { status: 403 }); // 直接拒绝
    }

    // Billplz 数据提取
    const orderNumber = payload.reference_1_label === 'OrderNumber' ? payload.reference_1 : null;
    const billId = payload.id;
    const isPaid = payload.paid === 'true';
    const paidAmountInCents = parseInt(payload.paid_amount || "0", 10);

    if (!orderNumber || !billId) {
      console.warn("[WEBHOOK_WARN] Malformed Payload missing core references.");
      return new NextResponse("Malformed Payload", { status: 200 });
    }

    if (isPaid) {
      // 🚀 修正 2 & 3：开启原子事务，处理幂等性并同步更新双表
      await db.transaction(async (tx) => {
        // 查找主订单
        const existingOrder = await tx.query.orders.findFirst({
          where: eq(orders.orderNumber, orderNumber),
        });

        if (!existingOrder) {
          console.warn(`[WEBHOOK_WARN] Order ${orderNumber} not found in DB.`);
          return; // 退出事务
        }

        // [🛡️ Idempotency] 幂等性拦截：如果订单已经是 paid 状态，直接终止，避免重复消耗资源
        if (existingOrder.status === "paid") {
          console.log(`[WEBHOOK_SKIP] Order ${orderNumber} is already paid. Ignoring duplicate webhook.`);
          return;
        }

        // 验证金额防篡改 (RM 转 Cents)
        const expectedCents = Math.round(parseFloat(existingOrder.totalAmount) * 100);
        if (paidAmountInCents < expectedCents) {
          console.error(`[SECURITY] Amount mismatch on ${orderNumber}! Expected ${expectedCents}, got ${paidAmountInCents}`);
          return; 
        }

        // 执行 A：更新 Orders 表状态
        await tx.update(orders)
          .set({ 
              status: "paid",
              updatedAt: new Date() 
          })
          .where(eq(orders.orderNumber, orderNumber));

        // 执行 B：更新 Payments 流水表状态 (对齐财务记录)
        await tx.update(payments)
          .set({
              status: "paid",
              updatedAt: new Date()
          })
          .where(eq(payments.billplzBillId, billId));

        console.log(`[PAYMENT_SUCCESS] Ledger synchronized. Order ${orderNumber} fully paid.`);
      });
    }

    // 始终返回 200，切断 Billplz 的退避重试机制 (Exponential Backoff)
    return new NextResponse("Receipt Processed", { status: 200 });

  } catch (err) {
    console.error("[WEBHOOK_CRITICAL_ERROR]", err);
    // 即使发生致命错误，也返回 200 给网关，防止被网关的并发重试拖死服务器
    return new NextResponse("Internal Handling Error", { status: 200 }); 
  }
}