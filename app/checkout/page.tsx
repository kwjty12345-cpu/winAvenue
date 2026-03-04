import { CheckoutForm } from "@/components/checkout/checkout-form";

// 架构师指令：结算页面不需要被静态缓存，确保每次进入都是干净的状态
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 头部标题：LUXE 极简美学 */}
        <div className="mb-16 text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-serif tracking-widest uppercase text-zinc-900">
            Secure Checkout
          </h1>
          <div className="h-[1px] w-24 bg-zinc-300 mx-auto"></div>
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500">
            Complete your order
          </p>
        </div>
        
        {/* 渲染我们在上一轮编写的包含高并发防线的表单组件 */}
        <CheckoutForm />
        
      </div>
    </div>
  );
}