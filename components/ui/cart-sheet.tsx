// components/ui/cart-sheet.tsx
"use client"; // 包含大量状态交互和动效，必须是 RCC

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react"; 
import { useCartStore } from "@/lib/store/use-cart-store";
import { useRouter } from "next/navigation"; 

const FREE_SHIPPING_THRESHOLD = 2000; 

export const CartSheet = () => {
  const { isOpen, closeCart, items, removeItem, updateQuantity } = useCartStore();
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // ✅ 新增：定义点击结算的路由跳转逻辑
  const handleCheckoutClick = () => {
    closeCart(); // 1. 先收起侧边栏抽屉
    router.push("/checkout"); // 2. 瞬间推送到结算页面
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={closeCart}
          />

          <motion.div
            initial={{ x: "100%" }} 
            animate={{ x: 0 }}      
            exit={{ x: "100%" }}    
            transition={{ type: "spring", damping: 25, stiffness: 200 }} 
            className="relative w-full max-w-[400px] h-full bg-brand-bg shadow-2xl flex flex-col border-l border-neutral-200"
          >
            
            <div className="flex items-center justify-between p-6 border-b border-neutral-200/60">
              <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-brand-primary">
                Your Bag ({items.length})
              </h2>
              <button onClick={closeCart} className="text-neutral-400 hover:text-brand-primary transition-colors">
                <X strokeWidth={1.5} size={18} />
              </button>
            </div>

            <div className="p-6 bg-brand-surface/30 border-b border-neutral-200/60">
              <p className="text-[10px] tracking-[0.1em] uppercase text-neutral-500 mb-3">
                {amountToFreeShipping > 0 
                  ? `Spend RM ${amountToFreeShipping.toLocaleString()} more for free shipping` 
                  : "Congratulations! You get free shipping."}
              </p>
              <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              {items.length === 0 ? (
                <p className="text-xs text-neutral-400 tracking-widest uppercase text-center mt-10">Your bag is empty.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    <div className="relative w-20 aspect-[4/5] bg-brand-surface shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-medium tracking-widest uppercase text-brand-primary">{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} className="text-[9px] text-neutral-400 tracking-[0.1em] uppercase hover:text-brand-primary">
                          Remove
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-xs text-neutral-600">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-brand-primary"><Minus size={12}/></button>
                          <span className="w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-brand-primary"><Plus size={12}/></button>
                        </div>
                        <p className="text-[11px] tracking-wider font-medium text-brand-primary">
                          RM {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-neutral-200/60 bg-brand-bg flex flex-col gap-6">
              <div className="flex justify-between items-center text-xs font-medium tracking-[0.15em] uppercase text-brand-primary">
                <span>Subtotal</span>
                <span>RM {subtotal.toLocaleString()}</span>
              </div>
              
              {/* ✅ 修改：注入 onClick 事件，并增加 disabled 状态 */}
              <button 
                onClick={handleCheckoutClick}
                disabled={items.length === 0}
                className="w-full py-4 bg-[#423D38] text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-brand-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout Now
              </button>
              
              <p className="text-[9px] text-center text-neutral-400 tracking-[0.15em] uppercase mt-2">
                Complimentary gift wrapping included.
              </p>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};