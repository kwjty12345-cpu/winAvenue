// app/(main)/layout.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/ui/cart-sheet"; 
import { QuickViewModal } from "@/components/ui/quick-view-modal"; 
import { createClient } from "@/lib/supabase/server"; // 🚨 引入服务端 Supabase

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // ⚡️ 架构师手法：在服务端绝对安全地获取用户状态
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 判断当前登录的真实邮箱是否为主理人
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kwjty12345@gmail.com";
  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <>
      {/* 将 isAdmin 状态直接注入给 Header 组件 */}
      <Header isAdmin={isAdmin} />
      
      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />
      
      <CartSheet />
      <QuickViewModal />
    </>
  );
}