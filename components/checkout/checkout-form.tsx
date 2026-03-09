"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/use-cart-store";
import { processCheckoutAction } from "@/app/actions/checkout";
import { checkoutSchema, CheckoutFormData } from "@/lib/validations/checkout";
import { Loader2 } from "lucide-react";
// 🚀 新增验证与微交互依赖
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 架构师工具箱：样式合并函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function CheckoutForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { items, clearCart } = useCartStore(); 
  const [globalError, setGlobalError] = useState("");

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 🚀 1. 引擎初始化：Zod 规则强力接管前端 UI
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur", // 失去焦点立即校验
  });

  // 🚀 2. 类型安全的提交处理
  const onSubmit = async (data: CheckoutFormData) => {
    setGlobalError("");

    if (items.length === 0) {
      setGlobalError("Your cart is empty.");
      return;
    }

    const cartPayload = items.map(item => ({
      id: item.id,
      name: item.name,          
      imageUrl: item.imageUrl,  
      price: item.price,
      quantity: item.quantity
    }));

    startTransition(async () => {
      // 此时的 data 已经被 Zod 完美洗净
      const result = await processCheckoutAction(data, cartPayload);
      
      if (result.success && result.paymentUrl) {
        // 🚀 核心修复：必须跳转到 Billplz 的支付网关！
        clearCart(); 
        window.location.href = result.paymentUrl; 
      } else {
        setGlobalError(result.error || "An error occurred during checkout.");
        if (result.error === "Unauthorized") router.push("/login");
      }
    });
  };

  // 辅助组件：渲染具有物理阻尼感的错误提示
  const ErrorMessage = ({ message }: { message?: string }) => (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -5, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -5, height: 0 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="text-red-500 text-xs font-medium pt-2 tracking-wide"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );

  // 提取输入框基础样式以保持极简美学 (Luxe Vibe)
  const inputBaseClass = "w-full border-b py-3 text-sm focus:outline-none transition-colors bg-transparent placeholder:text-zinc-400";

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* 🧾 表单区 */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 border-b pb-4">Shipping Details</h2>
        
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <input 
                {...register("receiverName")} 
                placeholder="Full Name *" 
                className={cn(inputBaseClass, errors.receiverName ? "border-red-500 text-red-600 focus:border-red-600" : "border-zinc-300 focus:border-black")} 
              />
              <ErrorMessage message={errors.receiverName?.message} />
            </div>
            <div>
              <input 
                {...register("phoneNumber")} 
                placeholder="Phone Number *" 
                className={cn(inputBaseClass, errors.phoneNumber ? "border-red-500 text-red-600 focus:border-red-600" : "border-zinc-300 focus:border-black")} 
              />
              <ErrorMessage message={errors.phoneNumber?.message} />
            </div>
          </div>
          
          <div>
            <input 
              {...register("addressLine1")} 
              placeholder="Address Line 1 *" 
              className={cn(inputBaseClass, errors.addressLine1 ? "border-red-500 text-red-600 focus:border-red-600" : "border-zinc-300 focus:border-black")} 
            />
            {/* 当输入类似 "kl" 这种不足 5 个字符的值时，这里会自动丝滑展开警告 */}
            <ErrorMessage message={errors.addressLine1?.message} />
          </div>

          <div>
            <input 
              {...register("addressLine2")} 
              placeholder="Address Line 2 (Optional)" 
              className={cn(inputBaseClass, errors.addressLine2 ? "border-red-500 text-red-600 focus:border-red-600" : "border-zinc-300 focus:border-black")} 
            />
            <ErrorMessage message={errors.addressLine2?.message} />
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <input 
                {...register("city")} 
                placeholder="City *" 
                className={cn(inputBaseClass, errors.city ? "border-red-500 text-red-600 focus:border-red-600" : "border-zinc-300 focus:border-black")} 
              />
              <ErrorMessage message={errors.city?.message} />
            </div>
            <div>
              <input 
                {...register("state")} 
                placeholder="State *" 
                className={cn(inputBaseClass, errors.state ? "border-red-500 text-red-600 focus:border-red-600" : "border-zinc-300 focus:border-black")} 
              />
              <ErrorMessage message={errors.state?.message} />
            </div>
            <div>
              <input 
                {...register("postalCode")} 
                placeholder="Postal Code *" 
                className={cn(inputBaseClass, errors.postalCode ? "border-red-500 text-red-600 focus:border-red-600" : "border-zinc-300 focus:border-black")} 
              />
              <ErrorMessage message={errors.postalCode?.message} />
            </div>
          </div>

          {globalError && <p className="text-red-500 text-sm mt-4 tracking-wide font-medium">{globalError}</p>}
        </form>
      </div>

      {/* 🛍️ 订单摘要区 */}
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