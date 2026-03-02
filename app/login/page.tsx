"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MiniCart from "../../components/MiniCart";
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  
  // 状态管理
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 处理登录与注册逻辑
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        // 注册逻辑
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('Account created successfully! You can now sign in.');
        setIsSignUp(false); // 注册成功后切换回登录界面
      } else {
        // 登录逻辑
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // 登录成功，跳转回商店页面
        router.push('/shop');
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-white flex flex-col">
      <Navbar openCart={() => setIsCartOpen(true)} />

      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-transparent p-8">
          
          <div className="text-center mb-12">
            <h1 className="text-2xl font-light tracking-widest text-brand-black uppercase mb-4">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-xs tracking-[0.1em] text-brand-black/50 uppercase">
              {isSignUp ? 'Join Luxe Paradise today' : 'Welcome back to Luxe Paradise'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-8">
            {/* 邮箱输入框：极简底边框设计 */}
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-brand-line py-3 text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors peer placeholder-transparent"
                placeholder="Email Address"
              />
              <label className="absolute left-0 -top-3.5 text-[10px] text-brand-black/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-brand-black">
                Email Address
              </label>
            </div>

            {/* 密码输入框 */}
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-brand-line py-3 text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors peer placeholder-transparent"
                placeholder="Password"
              />
              <label className="absolute left-0 -top-3.5 text-[10px] text-brand-black/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-brand-black">
                Password
              </label>
            </div>

            {/* 错误与成功提示信息 */}
            {errorMsg && <p className="text-xs text-red-800/80 bg-red-50 p-3 text-center">{errorMsg}</p>}
            {successMsg && <p className="text-xs text-[#7C8960] bg-[#7C8960]/10 p-3 text-center">{successMsg}</p>}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-black text-brand-white py-4 text-xs uppercase tracking-[0.2em] 
                         transition-all duration-500 hover:bg-[#5D5044] hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Register' : 'Sign In')}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-[10px] text-brand-black/50 hover:text-brand-black tracking-widest uppercase border-b border-transparent hover:border-brand-black transition-all pb-1"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Create one'}
            </button>
          </div>

        </div>
      </main>

      <Footer />
      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}