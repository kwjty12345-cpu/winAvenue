"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/use-cart-store";
import { processCheckoutAction } from "@/app/actions/checkout";
import { CheckoutFormData } from "@/lib/validations/checkout";
import { Loader2 } from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { items, clearCart } = useCartStore(); // 从全局状态提取购物车
  const [error, setError] = useState("");

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const addressData: CheckoutFormData = {
      receiverName: formData.get("receiverName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      addressLine1: formData.get("addressLine1") as string,
      addressLine2: formData.get("addressLine2") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
    };

    // 格式化发给后端的购物车数据
    const cartPayload = items.map(item => ({
      id: item.id,
      name: item.name,           // ✅ 新增：把商品名称传给后端
      imageUrl: item.imageUrl,   // ✅ 新增：把图片传给后端
      price: item.price,
      quantity: item.quantity
    }));

    startTransition(async () => {
      const result = await processCheckoutAction(addressData, cartPayload);
      
      if (result.success) {
        clearCart(); // 交易成功，清空本地购物车
        // 跳转到成功页 (或者你的订单详情页)
        router.push(`/account/orders?success=${result.orderNumber}`); 
      } else {
        setError(result.error || "An error occurred during checkout.");
        if (result.error === "Unauthorized") router.push("/login");
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* 表单区 */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 border-b pb-4">Shipping Details</h2>
        
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <input name="receiverName" required placeholder="Full Name *" className="w-full border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-400" />
            <input name="phoneNumber" required placeholder="Phone Number *" className="w-full border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-400" />
          </div>
          <input name="addressLine1" required placeholder="Address Line 1 *" className="w-full border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-400" />
          <input name="addressLine2" placeholder="Address Line 2 (Optional)" className="w-full border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-400" />
          
          <div className="grid grid-cols-3 gap-6">
            <input name="city" required placeholder="City *" className="w-full border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-400" />
            <input name="state" required placeholder="State *" className="w-full border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-400" />
            <input name="postalCode" required placeholder="Postal Code *" className="w-full border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-400" />
          </div>

          {error && <p className="text-red-500 text-sm mt-4 tracking-wide">{error}</p>}
        </form>
      </div>

      {/* 订单摘要区 */}
      <div className="w-full lg:w-1/3 bg-zinc-50 p-8 h-fit">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-8">Order Summary</h2>
        <div className="space-y-4 mb-8">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-zinc-600 line-clamp-1 pr-4">{item.quantity} x {item.name}</span>
              <span className="font-medium whitespace-nowrap">RM {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-zinc-200 pt-4 flex justify-between items-center mb-8">
          <span className="text-sm tracking-[0.2em] uppercase font-bold">Total</span>
          <span className="text-xl font-serif">RM {total}</span>
        </div>

        {/* 关联外部表单的提交按钮 */}
        <button 
          form="checkout-form"
          type="submit" 
          disabled={isPending || items.length === 0}
          className="w-full py-4 bg-black text-white text-xs tracking-[0.2em] uppercase font-bold hover:bg-neutral-800 transition-colors flex justify-center items-center disabled:opacity-50"
        >
          {isPending ? <Loader2 className="animate-spin" size={16} /> : "PLACE ORDER"}
        </button>
      </div>
    </div>
  );
}