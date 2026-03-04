// components/layout/search-modal.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { X, Search as SearchIcon, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { liveSearchAction } from "@/app/actions/search";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  // ✅ 状态机升级：增加 inventory 选项卡
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setQuery("");
      setResults([]);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // 核心引擎：防抖实时搜索 (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        startTransition(async () => {
          const data = await liveSearchAction(query);
          setResults(data);
        });
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col"
        >
          {/* 顶部关闭按钮区 */}
          <div className="container mx-auto px-6 md:px-12 h-24 flex items-center justify-end">
            <button 
              onClick={onClose}
              className="text-xs tracking-[0.2em] font-medium text-zinc-500 hover:text-black transition-colors flex items-center gap-2"
            >
              CLOSE <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* ✅ 修改：精修版搜索输入区 - 更小、更凝聚 */}
          <div className="container mx-auto px-6 md:px-12 mt-10 md:mt-16 flex justify-center">
            {/* 核心修改：缩减最大宽度，居中对齐 */}
            <div className="relative border-b-2 border-zinc-200 focus-within:border-black transition-colors duration-500 pb-3 flex items-center gap-4 w-full max-w-[500px]">
              <SearchIcon className="text-zinc-300 w-6 h-6 shrink-0" strokeWidth={1.5} />
              <input 
                autoFocus type="text"
                placeholder="Search bags, brands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                // ✅ 核心修改：极大地缩小字体，保持雅致
                className="w-full bg-transparent text-xl md:text-2xl lg:text-3xl font-serif text-zinc-900 placeholder:text-zinc-300 focus:outline-none tracking-wide"
              />
            </div>
          </div>

          {/* 搜索结果渲染区 - 同步居中 */}
          <div className="container mx-auto px-6 md:px-12 mt-16 flex-1 overflow-y-auto pb-20 flex justify-center">
            <div className="w-full max-w-6xl"> {/* 限制结果区域的最大宽度 */}
              {isPending && (
                <div className="text-center text-xs text-zinc-400 tracking-[0.2em] uppercase animate-pulse">
                  Searching...
                </div>
              )}

              {!isPending && query.length > 1 && results.length === 0 && (
                <div className="text-center text-sm text-zinc-500 font-serif italic tracking-wide">
                  No results found for "{query}". Try another term.
                </div>
              )}

              {/* 结果网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {!isPending && results.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="group flex items-center gap-6 p-4 -mx-4 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="relative w-20 h-24 md:w-24 md:h-32 bg-zinc-100 shrink-0 overflow-hidden">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl.split(',')[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px]">No Img</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] tracking-[0.2em] font-bold text-zinc-400 uppercase">
                        {product.brand?.name || "LUXE"}
                      </p>
                      <p className="text-sm md:text-base font-serif text-zinc-900 group-hover:text-zinc-500 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs font-medium tracking-widest text-zinc-900 mt-2">
                        RM {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}