import Link from 'next/link';

export default function BrandStory() {
  return (
    // 外层容器：深邃的高级黑背景，文字反白
    <section className="flex flex-col md:flex-row w-full bg-brand-black text-brand-white">
      
      {/* 左侧：氛围感大图（占一半宽度） */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-[80vh] relative overflow-hidden">
        <img
          // 找了一张很有质感的皮革细节占位图，后续可换成你们的工艺图或模特图
          src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1000&auto=format&fit=crop"
          alt="Brand Craftsmanship"
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out opacity-90"
        />
      </div>

      {/* 右侧：品牌文案（占一半宽度，大面积留白，垂直居中） */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-20 md:px-20 lg:px-24">
        
        {/* 小眉题 */}
        <h3 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">
          Our Heritage
        </h3>
        
        {/* 大标题：错落有致的换行 */}
        <h2 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-8 leading-snug">
          Elegance in <br /> Every Stitch
        </h2>
        
        {/* 正文：使用极细的字重和宽松的行高 */}
        <p className="text-sm text-gray-400 leading-relaxed font-light mb-12 max-w-md tracking-wide">
          At Luxe Paradise, we believe a bag is more than an accessory. It is a statement of grace, crafted with uncompromising attention to detail. Experience the perfect blend of modern minimalism and timeless luxury.
        </p>
        
        {/* 交互按钮 */}
        <div>
          <Link
            href="/about"
            className="inline-block border-b border-brand-white pb-1 text-xs uppercase tracking-widest hover:text-gray-400 hover:border-gray-400 transition-all duration-300"
          >
            Discover Our Story
          </Link>
        </div>

      </div>
      
    </section>
  );
}