"use client";

import { useCart } from "./CartContext";

export default function MiniCart({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { cart, removeFromCart, addToCart } = useCart(); // 獲取操作方法

  // 1. 計算小計
  const subtotal = cart.reduce((total, item) => {
    const priceNum = parseFloat(item.price.replace(/[^\d.]/g, ''));
    return total + (priceNum * item.quantity);
  }, 0);

  // 2. 免運費邏輯（假設滿 RM 2,000 免運）
  const freeShippingThreshold = 2000;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-[60] transition-all duration-700 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-white z-[70] transform transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] shadow-2xl flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 頂部標題 */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-brand-line">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-black">
            Your Bag ({cart.length})
          </h2>
          <button onClick={onClose} className="text-brand-black/40 hover:text-brand-black transition-colors text-2xl font-light">×</button>
        </div>

        {/* 3. 優化點：免運費進度條 */}
        {cart.length > 0 && (
          <div className="px-8 py-4 bg-brand-gray/50 border-b border-brand-line">
            <p className="text-[9px] uppercase tracking-widest text-brand-black/60 mb-2">
              {remainingForFreeShipping > 0 
                ? `Spend RM ${remainingForFreeShipping.toLocaleString()} more for free shipping` 
                : "Your order qualifies for free shipping"}
            </p>
            <div className="w-full h-[2px] bg-brand-line relative">
              <div 
                className="absolute top-0 left-0 h-full bg-brand-black transition-all duration-1000 ease-out"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 商品列表 */}
        <div className="flex-grow p-8 overflow-y-auto space-y-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-[10px] tracking-[0.2em] text-brand-black/40 uppercase">Your bag is empty</p>
              <button onClick={onClose} className="mt-6 text-[10px] border-b border-brand-black pb-1 uppercase tracking-widest hover:text-brand-black/50 transition-colors">Discover Collection</button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={item.id} 
                className="flex gap-6 animate-in fade-in slide-in-from-right-8 duration-700"
                style={{ animationDelay: `${index * 100}ms` }} // 4. 優化點：序列化淡入
              >
                <div className="w-24 h-30 bg-brand-gray overflow-hidden flex-shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[10px] font-bold tracking-widest uppercase text-brand-black">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-[9px] text-brand-black/40 hover:text-brand-black uppercase transition-colors">Remove</button>
                    </div>
                    {/* 5. 優化點：數量控制器 */}
                    <div className="flex items-center space-x-3 mt-3">
                       <button onClick={() => removeFromCart(item.id)} className="text-lg font-light text-brand-black/40">-</button>
                       <span className="text-[10px] text-brand-black tracking-widest">{item.quantity}</span>
                       <button onClick={() => addToCart(item)} className="text-lg font-light text-brand-black/40">+</button>
                    </div>
                  </div>
                  <p className="text-[11px] tracking-wider text-brand-black font-medium">RM {item.price}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 結帳區 */}
        {cart.length > 0 && (
          <div className="p-8 border-t border-brand-line bg-brand-white">
            <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-brand-black mb-6">
              <span className="font-light">Subtotal</span>
              <span className="font-bold">RM {subtotal.toLocaleString()}</span>
            </div>
            <button className="w-full bg-brand-black text-brand-white py-5 text-[10px] uppercase tracking-[0.3em] font-medium 
                               transition-all duration-500 hover:bg-[#5D5044] hover:shadow-xl active:scale-[0.98]">
              Checkout Now
            </button>
            <p className="text-center mt-6 text-[8px] text-brand-black/30 tracking-widest uppercase italic">
              Complimentary gift wrapping included with every order.
            </p>
          </div>
        )}
      </div>
    </>
  );
}