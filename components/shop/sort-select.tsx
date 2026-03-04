"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ✅ 核心修改：加入伪装成 Sort 的 Badge 选项
const sortOptions = [
  { label: "Recommended", value: "" },
  { label: "New In", value: "badge_new_in" },
  { label: "Limited Edition", value: "badge_limited" },
  { label: "Best Seller", value: "badge_best_seller" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export function SortSelect({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort"); 
    }
    
    router.push(`/shop?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const activeLabel = sortOptions.find(opt => opt.value === (currentSort || ""))?.label || "Recommended";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[11px] tracking-[0.2em] font-medium text-brand-primary hover:text-brand-secondary transition-colors uppercase"
      >
        Sort By: {activeLabel}
        <ChevronDown size={14} strokeWidth={1.5} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 shadow-xl z-50">
          <ul className="py-2">
            {sortOptions.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-[10px] tracking-widest uppercase hover:bg-zinc-50 transition-colors ${
                    (currentSort || "") === option.value ? "font-bold text-black" : "text-zinc-500"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}