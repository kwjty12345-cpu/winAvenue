"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

export function ProductGallery({ images, videoUrl }: { images: string[]; videoUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 组装所有的媒体文件（视频排在第一个，接着是图片）
  const media: MediaItem[] = [];
  if (videoUrl) media.push({ type: "video", url: videoUrl });
  images.forEach((url) => media.push({ type: "image", url }));

  if (media.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  // 架构师防线：打开全屏时禁止背景滚动
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

  return (
    <div className="mt-12 pt-10 border-t border-neutral-200/60">
      <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-6">
        Gallery & Details
      </h3>
      
      {/* 极简缩略图阵列 (默认可见，不占空间) */}
      <div className="flex flex-wrap gap-4">
        {media.map((item, idx) => (
          <button
            key={idx}
            onClick={() => openLightbox(idx)}
            className="group relative w-16 h-20 md:w-20 md:h-24 bg-zinc-100 overflow-hidden shadow-sm"
          >
            {item.type === "video" ? (
              <>
                <video src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <Play size={16} className="text-white fill-white" />
                </div>
              </>
            ) : (
              <Image src={item.url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
            )}
          </button>
        ))}
      </div>

      {/* 隐奢全屏灯箱 (点击后弹出的沉浸式视界) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col"
          >
            {/* 顶部控制栏 */}
            <div className="absolute top-0 inset-x-0 h-24 flex items-center justify-end px-6 md:px-12 z-50">
              <button onClick={() => setIsOpen(false)} className="text-xs tracking-[0.2em] font-medium text-zinc-500 hover:text-black transition-colors flex items-center gap-2">
                CLOSE <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* 核心展示区 */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-12">
              {media.length > 1 && (
                <button onClick={prev} className="absolute left-4 md:left-12 p-4 text-zinc-400 hover:text-black transition-colors z-50">
                  <ChevronLeft size={32} strokeWidth={1} />
                </button>
              )}
              
              <div className="relative w-full h-full max-w-5xl">
                {media[currentIndex].type === "video" ? (
                  <video src={media[currentIndex].url} autoPlay controls playsInline className="w-full h-full object-contain shadow-2xl" />
                ) : (
                  <Image src={media[currentIndex].url} alt={`Gallery Image ${currentIndex + 1}`} fill className="object-contain drop-shadow-2xl" priority />
                )}
              </div>

              {media.length > 1 && (
                <button onClick={next} className="absolute right-4 md:right-12 p-4 text-zinc-400 hover:text-black transition-colors z-50">
                  <ChevronRight size={32} strokeWidth={1} />
                </button>
              )}
            </div>
            
            {/* 底部指示器 */}
            <div className="h-20 flex items-center justify-center gap-3 pb-8">
              {media.map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${idx === currentIndex ? 'bg-black scale-125' : 'bg-zinc-300'}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}