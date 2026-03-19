// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 架构师注：纯粹的壳，不包含任何业务 UI
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col relative selection:bg-brand-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}