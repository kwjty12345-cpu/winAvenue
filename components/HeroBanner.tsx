import Link from 'next/link';

export default function HeroBanner() {
  return (
    // 高度设置为屏幕高度减去导航栏的高度(80px)，实现完美的一屏展示
    <div className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
      
      {/* 背景图片层 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          // 这里是临时的高级感占位图，未来换成你的产品图
          backgroundImage: "url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop')" 
        }}
      ></div>

      {/* 遮罩层 (Overlay)：稍微压暗背景，确保前面的白色文字和线条清晰可见 */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* 前景内容区：文字与按钮 */}
      <div className="relative z-10 text-center flex flex-col items-center px-4">
        
        {/* 小标题 */}
        <h2 className="text-xs md:text-sm text-brand-white uppercase tracking-[0.3em] mb-4">
          Spring / Summer 2026
        </h2>
        
        {/* 主标题：使用超宽间距和极细字重打造呼吸感 */}
        <h1 className="text-4xl md:text-6xl text-brand-white font-light tracking-widest mb-10 uppercase">
          The Kira Collection
        </h1>
        
        {/* 极简交互按钮：默认透明底白边框，鼠标悬停时反色 */}
        <Link 
          href="/shop" 
          className="px-10 py-4 border border-brand-white text-brand-white uppercase tracking-widest text-sm hover:bg-brand-white hover:text-brand-black transition-all duration-500 ease-in-out"
        >
          Discover Now
        </Link>
        
      </div>
    </div>
  );
}