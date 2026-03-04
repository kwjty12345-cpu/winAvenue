"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

interface ShopFiltersProps {
  categories: FilterOption[];
  brands: FilterOption[];
}

export function ShopFilters({ categories, brands }: ShopFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 架构师防线：抽屉打开时锁定背景滚动
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // 获取当前 URL 里的过滤状态 (支持多选，逗号分隔)
  const currentCategories = searchParams.get("category")?.split(",") || [];
  const currentBrands = searchParams.get("brand")?.split(",") || [];

  // 核心引擎：无感更新 URL 状态
  const toggleFilter = (type: "category" | "brand", slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentList = params.get(type)?.split(",") || [];
    
    let newList;
    if (currentList.includes(slug)) {
      newList = currentList.filter(item => item !== slug); // 取消勾选
    } else {
      newList = [...currentList, slug]; // 勾选
    }

    if (newList.length > 0) {
      params.set(type, newList.join(","));
    } else {
      params.delete(type); // 数组空了就从 URL 里删掉这个参数，保持整洁
    }

    // scroll: false 极其重要，防止页面突然跳回顶部
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("brand");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  // 渲染单个勾选框 UI
  const FilterCheckbox = ({ 
    label, isSelected, onClick 
  }: { 
    label: string, isSelected: boolean, onClick: () => void 
  }) => (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 w-full group py-1"
    >
      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
        isSelected ? "bg-zinc-900 border-zinc-900" : "border-zinc-300 group-hover:border-zinc-500"
      }`}>
        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
      <span className={`text-[11px] tracking-widest uppercase ${isSelected ? "font-bold text-zinc-900" : "text-zinc-600"}`}>
        {label}
      </span>
    </button>
  );

  return (
    <>
      {/* 唤起抽屉的按钮 */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-[11px] tracking-[0.2em] font-medium text-brand-primary hover:text-brand-secondary transition-colors uppercase"
      >
        <SlidersHorizontal size={14} strokeWidth={1.5} />
        Filter {(currentCategories.length + currentBrands.length) > 0 && `(${currentCategories.length + currentBrands.length})`}
      </button>

      {/* 从左侧滑出的过滤器抽屉 */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex">
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />

            {/* 抽屉本体 */}
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[360px] h-full bg-[#FAF9F6] shadow-2xl flex flex-col border-r border-neutral-200"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200/60">
                <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-900">
                  Filter By
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-zinc-900 transition-colors">
                  <X strokeWidth={1.5} size={18} />
                </button>
              </div>

              {/* 过滤选项区 (可滚动) */}
              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                
                {/* 品牌过滤 */}
                {brands.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-[10px] tracking-[0.2em] font-bold text-zinc-400 uppercase border-b border-zinc-200 pb-2">Brands</h3>
                    <div className="space-y-4">
                      {brands.map(brand => (
                        <FilterCheckbox 
                          key={brand.id} 
                          label={brand.name} 
                          isSelected={currentBrands.includes(brand.slug)}
                          onClick={() => toggleFilter("brand", brand.slug)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 分类过滤 */}
                {categories.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-[10px] tracking-[0.2em] font-bold text-zinc-400 uppercase border-b border-zinc-200 pb-2">Categories</h3>
                    <div className="space-y-4">
                      {categories.map(category => (
                        <FilterCheckbox 
                          key={category.id} 
                          label={category.name} 
                          isSelected={currentCategories.includes(category.slug)}
                          onClick={() => toggleFilter("category", category.slug)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="p-6 border-t border-neutral-200/60 bg-[#FAF9F6] flex gap-4">
                <button 
                  onClick={clearAll}
                  className="w-1/3 py-4 border border-zinc-300 text-zinc-600 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-zinc-100 transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-2/3 py-4 bg-zinc-900 text-white text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors"
                >
                  View Results
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}