// app/account/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, LogOut } from "lucide-react";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 如果没有 Session，重定向回登录页 (二次防线)
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* 头部：欢迎语 */}
        <div className="flex flex-col gap-2 mb-16">
          <h1 className="text-3xl font-serif tracking-widest uppercase text-[#121212]">
            My Account
          </h1>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#7A6A58]">
            Welcome back, {user.email?.split('@')[0]}
          </p>
        </div>

        {/* 宫格功能区 (Bento Grid 进阶版) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 个人资料 */}
          <div className="bg-white p-8 border border-neutral-100 flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="space-y-4">
              <User size={20} strokeWidth={1} className="text-[#7A6A58]" />
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase">Personal Details</h2>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Manage your profile information and security settings.
              </p>
            </div>
            <div className="pt-6">
              <p className="text-[11px] text-[#121212] font-medium">{user.email}</p>
            </div>
          </div>

          {/* 订单历史 */}
          <div className="bg-white p-8 border border-neutral-100 flex flex-col justify-between">
            <div className="space-y-4">
              <Package size={20} strokeWidth={1} className="text-[#7A6A58]" />
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase">Order History</h2>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Track your current shipments and view past purchases.
              </p>
            </div>
            <Link href="/account/orders" className="text-[10px] tracking-[0.2em] uppercase font-bold border-b border-black w-fit mt-6">
              View All Orders
            </Link>
          </div>

          {/* 收藏夹 */}
          <div className="bg-white p-8 border border-neutral-100 flex flex-col justify-between">
            <div className="space-y-4">
              <Heart size={20} strokeWidth={1} className="text-[#7A6A58]" />
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase">My Collection</h2>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Your curated selection of timeless luxury pieces.
              </p>
            </div>
            <Link href="/account/wishlist" className="text-[10px] tracking-[0.2em] uppercase font-bold border-b border-black w-fit mt-6">
              Explore Wishlist
            </Link>
          </div>

          {/* 退出登录 */}
          <form action="/auth/signout" method="post" className="bg-neutral-900 p-8 flex flex-col justify-between text-white">
            <div className="space-y-4">
              <LogOut size={20} strokeWidth={1} className="text-[#7A6A58]" />
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase">Session</h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Safely sign out from your current session.
              </p>
            </div>
            <button className="text-[10px] tracking-[0.2em] uppercase font-bold border-b border-white w-fit mt-6 hover:text-[#7A6A58] hover:border-[#7A6A58] transition-colors">
              Sign Out
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}