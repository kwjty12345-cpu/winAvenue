// components/layout/footer.tsx
import Link from "next/link";

const FOOTER_LINKS = {
  customerCare: [
    { name: "CONTACT US", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "SHIPPING & RETURNS", href: "/shipping" },
    { name: "PRODUCT CARE", href: "/care" },
  ],
  discover: [
    { name: "SHOP ALL", href: "/shop" },
    { name: "COLLECTIONS", href: "/collections" },
    { name: "OUR STORY", href: "/story" },
    { name: "BOUTIQUES", href: "/boutiques" },
  ]
};

export const Footer = () => {
  return (
    // 上下留白使用 py-20 建立呼吸感，底色保持与页面统一
    <footer className="w-full bg-brand-bg pt-20 pb-10 border-t border-neutral-200/50">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* 上半部：品牌宣言与链接网格 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* 品牌核心区 (占据两列宽度) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h3 className="font-serif text-lg tracking-[0.15em] text-brand-primary">
              LUXE PARADISE
            </h3>
            <p className="text-xs tracking-wider text-neutral-500 leading-relaxed max-w-sm uppercase">
              Elegance in every stitch. <br/>
              Crafted for the modern minimalist.
            </p>
          </div>

          {/* 链接组 1 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-medium tracking-[0.2em] text-neutral-800">CUSTOMER CARE</h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_LINKS.customerCare.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[10px] tracking-wider text-neutral-500 hover:text-brand-secondary transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 链接组 2 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-medium tracking-[0.2em] text-neutral-800">DISCOVER</h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_LINKS.discover.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[10px] tracking-wider text-neutral-500 hover:text-brand-secondary transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 下半部：版权声明与社交媒体 (图4底部细节) */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-neutral-200/50 gap-4">
          <p className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase">
            © 2026 LUXE PARADISE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            {["INSTAGRAM", "PINTEREST", "JOURNAL"].map((social) => (
              <a key={social} href="#" className="text-[9px] tracking-[0.2em] text-neutral-400 hover:text-brand-primary transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};