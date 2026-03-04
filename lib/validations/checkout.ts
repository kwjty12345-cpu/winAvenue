import { z } from "zod";

export const checkoutSchema = z.object({
  receiverName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(8, "Valid phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ✅ 修改：加上 name 和 imageUrl 的校验
export const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),                // 新增：商品名称
  imageUrl: z.string().optional(), // 新增：图片URL
  price: z.number(),
  quantity: z.number().min(1),
});