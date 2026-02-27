import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 引入你的购物车 Context
import { CartProvider } from "../components/CartContext";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 使用 CartProvider 包裹 children，这样全站都能用购物车逻辑 */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}