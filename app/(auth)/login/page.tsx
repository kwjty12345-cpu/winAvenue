// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  
  // 实例化 Supabase 客户端
  const supabase = createClient();

  // ⚡️ 核心策略：Google OAuth 一键登录
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage(""); // 清除可能存在的历史错误信息

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // 登录成功后重定向到回调路由
        redirectTo: `${location.origin}/auth/callback`, 
      },
    });

    if (error) {
      setMessage("Failed to initialize Google login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full">
      {/* 左侧：品牌视觉传达 */}
      <div className="relative hidden w-1/2 lg:block bg-neutral-100">
        <Image
          src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2000&auto=format&fit=crop"
          alt="Luxe Paradise Collection"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 z-10 bg-black/40"></div>
        <div className="absolute bottom-20 left-16 z-20 text-white">
          <h1 className="mb-4 font-serif text-4xl tracking-widest uppercase">
            Enter The Paradise
          </h1>
          <p className="max-w-md text-sm font-light leading-relaxed tracking-wider opacity-80">
            Curated elegance for the modern individual. Sign in to access your exclusive collection and track your orders.
          </p>
        </div>
      </div>

      {/* 右侧：极简交互控制台 */}
      <div className="flex w-full flex-col items-center justify-center bg-[#FCFCFA] px-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-12">
          
          <div className="space-y-4 text-center">
            <h2 className="font-serif text-3xl tracking-[0.2em] uppercase text-black">
              Welcome
            </h2>
            <p className="text-xs tracking-widest text-neutral-500 uppercase">
              Sign in to your account
            </p>
          </div>

          <div className="space-y-6">
            {/* 唯一入口：Google OAuth 按钮 */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex w-full items-center justify-center space-x-3 border border-neutral-300 bg-white py-4 text-sm font-medium tracking-wider text-black transition-all hover:bg-neutral-50 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="text-xs tracking-widest animate-pulse">CONNECTING...</span>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>CONTINUE WITH GOOGLE</span>
                </>
              )}
            </button>

            {/* 状态信息反馈 (保留，用于展示网络断开或配置错误) */}
            {message && (
              <p className="text-center text-xs tracking-wider text-red-500">
                {message}
              </p>
            )}
          </div>

          <div className="text-center">
             <button onClick={() => router.push('/')} className="text-[10px] tracking-widest text-neutral-400 uppercase hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">
               ← Return to Store
             </button>
          </div>

        </div>
      </div>
    </main>
  );
}