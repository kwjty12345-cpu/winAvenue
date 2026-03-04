// lib/store/use-quick-view-store.ts
import { create } from 'zustand';

// 定义商品结构 (兼容 Mock 数据)
export interface Product {
  slug: string;
  name: string;
  price: string;
  imageUrl: string;
  badge?: string;
  colors?: string[];
}

interface QuickViewState {
  isOpen: boolean;
  activeProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewState>((set) => ({
  isOpen: false,
  activeProduct: null,
  // 触发打开时，将当前商品数据注入全局状态
  openQuickView: (product) => set({ isOpen: true, activeProduct: product }),
  // 关闭时清空数据
  closeQuickView: () => set({ isOpen: false }),
}));