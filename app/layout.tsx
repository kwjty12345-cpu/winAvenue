// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 引入 sonner 通知引擎
import { Toaster } from 'sonner';
// 引入全局鉴权监听器
import { AuthInit } from "@/components/AuthInit"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUXE PARADISE | Minimalist Luxury Bags",
  description: "Elegance in every stitch. Crafted for the modern minimalist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-[#f5f5f5]`}>
        
        {/* 1. 注入全局鉴权与状态监听器 */}
        <AuthInit />

        {/* 2. 核心业务内容渲染 */}
        {children}

        {/* 3. 高奢感通知系统配置 
           配置说明：
           - position: 右上角弹出，符合大多数奢侈品电商习惯
           - richColors: 启用彩色状态（成功、错误等）
           - toastOptions: 注入自定义 CSS 实现玻璃拟物化 (Glassmorphism)
        */}
        <Toaster 
          position="top-right" 
          richColors 
          expand={false}
          toastOptions={{
            style: { 
              background: 'rgba(9, 9, 11, 0.8)', // 极深灰色背景
              backdropFilter: 'blur(12px)',      // 强力毛玻璃效果
              border: '1px solid rgba(255, 255, 255, 0.1)', // 微弱的高光边框
              color: '#f5f5f5',                  // 珍珠白文字
              fontSize: '11px',                  // 紧致的排版
              letterSpacing: '0.1em',            // 增加呼吸感的字间距
              textTransform: 'uppercase',        // 强制大写以维持品牌感
              borderRadius: '0px',               // 采用硬朗的直角设计，呼应极简主义
            },
          }}
        />

      </body>
    </html>
  );
}