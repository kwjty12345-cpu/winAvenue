// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 工业级 Supabase 服务端实例工厂函数 (适配 Next.js 15+ 异步 API)：
 * 保证在 Server Component 中进行类型安全的 Auth 校验与数据获取。
 */
export async function createClient() {
  // 注意这里的 await，这是解决 get 报错的关键
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 使用最新的 getAll 获取所有 cookie
        getAll() {
          return cookieStore.getAll();
        },
        // 使用 setAll 批量处理设置和删除，减少开销
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // 在 React Server Component 中调用 set 会报错，静默捕获
            // 这种设计是因为 RSC 渲染时响应头已经发送，无法再写入 Cookie
          }
        },
      },
    }
  );
}