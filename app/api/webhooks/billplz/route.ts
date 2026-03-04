// app/api/webhooks/billplz/route.ts
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const formData = await req.formData();
  const data: any = Object.fromEntries(formData.entries());

  // 🛡️ 架构师安全核验：验证 X-Signature 确保这不是黑客伪造的请求
  const sourceString = `amount${data.amount}billing_address${data.billing_address}billing_name${data.billing_name}description${data.description}due_at${data.due_at}email${data.email}id${data.id}name${data.name}paid${data.paid}paid_at${data.paid_at}state${data.state}`;
  const signature = crypto
    .createHmac('sha256', process.env.BILLPLZ_X_SIGNATURE_KEY!)
    .update(sourceString)
    .digest('hex');

  if (signature !== data.x_signature) {
    return new NextResponse("Invalid Signature", { status: 400 });
  }

  // ✅ 支付成功逻辑
  if (data.paid === 'true' && data.state === 'paid') {
    const orderNumber = data.reference_1; // 我们之前存入的 reference_1

    await db.update(orders)
      .set({ status: "processing" }) // 自动改为打包中
      .where(eq(orders.orderNumber, orderNumber));
      
    console.log(`Order ${orderNumber} payment confirmed via Billplz.`);
  }

  return NextResponse.json({ received: true });
}