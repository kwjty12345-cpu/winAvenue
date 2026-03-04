// components/home/hero.tsx
export const Hero = () => {
  return (
    // 使用 85vh 高度，底部留出一点空间暗示用户下方还有内容
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-brand-primary">
      
      {/* 1. 背景图层引擎 */}
      <div className="absolute inset-0 z-0">
        {/* 深色玻璃遮罩，提升文字对比度 */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        {/* 注意：请在项目的 public 文件夹下放一张高质量的包包图片，命名为 hero-bg.jpg。
            如果你暂时没有图，这里先用一个网络高清占位图保证代码运行不出错。 */}
        <img
          src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=3149&auto=format&fit=crop"
          alt="The Kira Collection"
          className="object-cover w-full h-full object-center"
        />
      </div>

      {/* 2. 文本与交互层 (Z-index 提升至遮罩层之上) */}
      <div className="relative z-20 flex flex-col items-center gap-6 text-center px-4">
        
        <p className="text-white/80 text-xs md:text-sm tracking-[0.3em] uppercase font-medium drop-shadow-md">
          Spring / Summer 2026
        </p>
        
        {/* 使用我们在 globals.css 中定义的流式排版变量和衬线字体 */}
        <h1 className="text-[var(--text-fluid-h1)] text-white font-serif tracking-widest uppercase drop-shadow-lg">
          The Kira Collection
        </h1>
        
        {/* 幽灵按钮 (Ghost Button) - 极简主义的标配交互 */}
        <button className="mt-8 px-10 py-4 border border-white text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-brand-primary transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
          Discover Now
        </button>
        
      </div>
    </section>
  );
};