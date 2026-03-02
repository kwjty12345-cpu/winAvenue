// components/AuthInit.tsx
'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '../src/stores/useCartStore';

export function AuthInit() {
  const setUser = useCartStore((state) => state.setUser);

  useEffect(() => {
    // 1. 页面初次挂载时，主动抓取一次 Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // 2. 建立长连接，监听用户的登录/登出动作
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    // 清理函数：防止内存泄漏
    return () => subscription.unsubscribe();
  }, [setUser]);

  // 为什么这么写：这是一个纯逻辑组件，它在 DOM 树中是不可见的，不会破坏你的 HTML 结构。
  return null; 
}