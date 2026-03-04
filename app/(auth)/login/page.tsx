// app/(auth)/login/page.tsx
import Image from "next/image";
import Link from "next/link";
import { login, signup } from "./actions"; 

export default async function LoginPage({
  searchParams,
}: {
  // 适配 Next.js 15+ 异步参数解构
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { message, error } = await searchParams;

  return (
    <div className="flex min-h-screen w-full bg-[#F7F6F2]">
      {/* 视觉左翼：保持不变的高定画报 */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1500&auto=format&fit=crop"
          alt="Luxe Paradise Atelier"
          fill
          priority
          className="object-cover opacity-90 scale-105 transition-transform duration-[10s] hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" /> 
        <div className="absolute inset-0 flex flex-col justify-end p-20 text-white">
          <h2 className="text-4xl font-serif tracking-[0.2em] uppercase mb-4">
            Enter The Paradise
          </h2>
          <p className="text-sm font-light tracking-widest uppercase text-white/80 max-w-md leading-relaxed">
            Curated elegance for the modern individual. Sign in to access your exclusive collection.
          </p>
        </div>
      </div>

      {/* 交互右翼：极简表单区 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-md flex flex-col gap-10">
          
          <div className="text-center lg:text-left space-y-4">
            <Link href="/" className="inline-block text-xl font-serif tracking-[0.2em] uppercase text-[#7A6A58] mb-6 hover:opacity-70 transition-opacity">
              Luxe Paradise
            </Link>
            <h1 className="text-3xl font-serif text-[#121212] tracking-widest uppercase leading-tight">
              Welcome
            </h1>
            <p className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase">
              Sign in or create an account
            </p>
          </div>

          <form className="flex flex-col gap-8 w-full">
            {/* ✨ 状态反馈模块：优雅地显示错误或成功信息 */}
            <div className="min-h-[60px] flex flex-col justify-center">
              {error && (
                <div className="bg-red-50/50 border border-red-100 p-4 animate-in fade-in slide-in-from-top-1">
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-red-600 leading-relaxed">
                    {error}
                  </p>
                </div>
              )}
              {message && (
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 animate-in fade-in slide-in-from-top-1">
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-emerald-700 leading-relaxed">
                    {message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#7A6A58]" htmlFor="email">
                  Email
                </label>
                <input
                  className="bg-transparent border-b border-neutral-300 py-3 text-sm text-[#121212] focus:outline-none focus:border-[#7A6A58] transition-colors placeholder:text-neutral-300"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 relative group">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#7A6A58]" htmlFor="password">
                  Password
                </label>
                <input
                  className="bg-transparent border-b border-neutral-300 py-3 text-sm text-[#121212] focus:outline-none focus:border-[#7A6A58] transition-colors placeholder:text-neutral-300"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  minLength={6} // 增加最少长度限制，符合 Supabase 默认安全策略
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {/* 架构师注：按钮使用 formAction 挂载异步 Action */}
              <button
                formAction={login}
                className="w-full bg-[#121212] text-white py-4 text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-neutral-800 transition-all duration-300 active:scale-[0.98] shadow-sm"
              >
                Sign In
              </button>
              
              <button
                formAction={signup}
                className="w-full bg-transparent border border-neutral-300 text-[#121212] py-4 text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-white transition-all duration-300 active:scale-[0.98]"
              >
                Create Account
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 hover:text-[#7A6A58] transition-colors">
                Forgot your password?
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}