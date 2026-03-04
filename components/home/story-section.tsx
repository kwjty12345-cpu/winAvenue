// components/home/story-section.tsx
import Image from "next/image";

export const StorySection = () => {
  return (
    // 使用 md:flex-row 实现 PC 端左右切割，移动端上下堆叠
    <section className="w-full flex flex-col md:flex-row min-h-[70vh]">
      
      {/* 左翼：视觉情绪大图 */}
      <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-full bg-brand-surface">
        <Image
          // 使用一张充满质感的皮具细节或生活方式大图
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Elegance in every stitch"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* 右翼：品牌宣言区 (使用深灰褐色背景) */}
      {/* 这里我直接硬编码了一个深色 hex 以完美复现你图 4 右侧的深色块 */}
      <div className="w-full md:w-1/2 bg-[#423D38] flex items-center justify-center p-12 md:p-24 lg:p-32 text-white">
        
        {/* 控制最大宽度，使得排版紧凑有力 */}
        <div className="max-w-md flex flex-col gap-8">
          <h2 className="text-[var(--text-fluid-h2)] font-serif tracking-widest uppercase leading-snug text-white drop-shadow-sm">
            Elegance In <br /> Every Stitch
          </h2>
          
          <p className="text-xs md:text-sm tracking-widest leading-loose text-white/80">
            At Luxe Paradise, we believe a bag is more than an accessory. It is a statement of grace, crafted with uncompromising attention to detail. Experience the perfect blend of modern minimalism and timeless luxury.
          </p>
          
          <div className="pt-4">
            <button className="text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase border-b border-white hover:text-white/70 hover:border-white/70 transition-all duration-300 pb-1">
              Discover Our Story
            </button>
          </div>
        </div>

      </div>
      
    </section>
  );
};