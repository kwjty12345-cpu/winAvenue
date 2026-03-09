// lib/billplz.ts
import crypto from 'crypto';

const BILLPLZ_API_KEY = process.env.BILLPLZ_API_KEY!;
const BILLPLZ_COLLECTION_ID = process.env.BILLPLZ_COLLECTION_ID!;
const BILLPLZ_X_SIGNATURE = process.env.BILLPLZ_X_SIGNATURE!; 

export const createBill = async (email: string, name: string, amountCents: number, orderId: string) => {
  const authHeader = `Basic ${Buffer.from(`${BILLPLZ_API_KEY}:`).toString('base64')}`;
  
  const response = await fetch('https://www.billplz.com/api/v3/bills', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify({
      collection_id: BILLPLZ_COLLECTION_ID,
      email,
      name,
      amount: amountCents,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/billplz`,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?status=success`,
      reference_1_label: "Order ID",
      reference_1: orderId,
      description: `Luxe Bag Store - Order ${orderId}`
    })
  });

  if (!response.ok) throw new Error("Billplz Payment Initialization Failed");
  return response.json(); 
};

export const verifyBillplzSignature = (payload: any): boolean => {
  const data = `amount${payload.amount}|collection_id${payload.collection_id}|due_at${payload.due_at}|email${payload.email}|id${payload.id}|mobile${payload.mobile}|name${payload.name}|paid_amount${payload.paid_amount}|paid_at${payload.paid_at}|paid${payload.paid}|receipt_url${payload.receipt_url}|state${payload.state}|url${payload.url}`;
  
  const expectedSignature = crypto.createHmac('sha256', BILLPLZ_X_SIGNATURE).update(data).digest('hex');
  return expectedSignature === payload.x_signature;
};