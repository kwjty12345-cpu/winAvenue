// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/ui/cart-sheet"; 
// 1. 引入 Quick View 弹窗组件
import { QuickViewModal } from "@/components/ui/quick-view-modal"; 

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap', 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "LUXE PARADISE | Minimalist Luxury",
  description: "Elegance in every stitch. Crafted for the modern minimalist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col relative selection:bg-brand-primary selection:text-white">
        
        <Header />

        <main className="flex-1 w-full">
          {children}
        </main>

        <Footer />
        
        {/* 在全局挂载所有状态抽屉与弹窗 */}
        <CartSheet />
        <QuickViewModal /> {/* 2. 挂载快速预览 */}
        
      </body>
    </html>
  );
}