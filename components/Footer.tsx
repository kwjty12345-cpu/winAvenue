import Link from 'next/link';

export default function Footer() {
  return (
    // 顶部加入两条精致的双实线，彻底与上方的商品区隔开
    <footer className="bg-[#F9F8F4] pt-16 pb-8 border-t-2 border-[#DCD7C9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 三列布局，下方加上一根分隔线 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 pb-12 border-b border-[#DCD7C9] text-center md:text-left">
          
          {/* 第一列：经典黑灰色 */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <span className="text-lg font-bold tracking-widest text-[#333333] uppercase">
              LUXE PARADISE
            </span>
            <p className="text-[10px] text-[#666666] tracking-[0.15em] leading-relaxed max-w-[200px] uppercase">
              Elegance in every stitch.<br/>
              Crafted for the modern minimalist.
            </p>
          </div>

          {/* 第二列：青苔绿 (Sage Green) 色调 */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#7C8960] mb-6">
              Customer Care
            </h4>
            <ul className="space-y-4 text-[11px] text-[#7C8960]/80 tracking-widest uppercase">
              <li><Link href="/contact" className="hover:text-[#333333] transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-[#333333] transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-[#333333] transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/care" className="hover:text-[#333333] transition-colors">Product Care</Link></li>
            </ul>
          </div>

          {/* 第三列：雾霭蓝 (Muted Blue) 色调 */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#6A7B8C] mb-6">
              Discover
            </h4>
            <ul className="space-y-4 text-[11px] text-[#6A7B8C]/80 tracking-widest uppercase">
              <li><Link href="/shop" className="hover:text-[#333333] transition-colors">Shop All</Link></li>
              <li><Link href="/collections" className="hover:text-[#333333] transition-colors">Collections</Link></li>
              <li><Link href="/about" className="hover:text-[#333333] transition-colors">Our Story</Link></li>
              <li><Link href="/stores" className="hover:text-[#333333] transition-colors">Boutiques</Link></li>
            </ul>
          </div>

        </div>

        {/* 底部版权与社交媒体：极小字号，莫兰迪卡其色 */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-[9px] text-[#9A9483] tracking-[0.2em] uppercase">
          <p>&copy; {new Date().getFullYear()} LUXE PARADISE. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-[#7C8960] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#7C8960] transition-colors">Pinterest</a>
            <a href="#" className="hover:text-[#7C8960] transition-colors">Journal</a>
          </div>
        </div>

      </div>
    </footer>
  );
}