// lib/store/use-cart-store.ts
import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  isOpen: boolean;            
  items: CartItem[];          
  openCart: () => void;       
  closeCart: () => void;      
  addItem: (item: CartItem) => void; 
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;      
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  items: [],

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  addItem: (newItem) => set((state) => {
    const existingItem = state.items.find((item) => item.id === newItem.id);
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
        isOpen: true, 
      };
    }
    return { items: [...state.items, { ...newItem, quantity: 1 }], isOpen: true };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),

  // ✅ 修正版 updateQuantity
  updateQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) {
      // 如果数量减到 0，相当于执行 removeItem
      return { items: state.items.filter((item) => item.id !== id) };
    }
    return {
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    };
  }),

  clearCart: () => set({ items: [] }),
}));