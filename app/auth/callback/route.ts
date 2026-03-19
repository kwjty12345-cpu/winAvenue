// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. 从 URL 中获取 Supabase 发回来的 code
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 2. 如果有 next 参数，登录后跳转到指定页面，否则默认回首页
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    
    // 3. 交换 Code 换取 Session (PKCE 流程)
    // 这步会自动把登录状态写入浏览器 Cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 登录成功，重定向到目标页面
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 如果流程出错，重定向到登录页并带上错误提示
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}