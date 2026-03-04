// 文件路径: middleware.ts (必须在项目根目录！)
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// 👇 Next.js 只认这个名字：middleware
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，排除静态文件和图片等，防止中间件过度触发消耗性能
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}