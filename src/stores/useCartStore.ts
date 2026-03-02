// src/stores/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export type CartItem = {
  id: number | string;
  cartItemId?: number;
  name: string;
  price: string | number;
  img: string;
  quantity: number;
};

interface CartState {
  cartItems: CartItem[];
  user: any | null;
  isRehydrated: boolean; // 新增：水合状态标志位
  setRehydrated: () => void;
  setUser: (user: any) => void;
  fetchCartFromDB: () => Promise<void>;
  addToCart: (product: any) => Promise<void>;
  decreaseQuantity: (productId: number | string) => Promise<void>; // 新增：减少数量逻辑
  removeFromCart: (productId: number | string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      user: null,
      isRehydrated: false,

      setRehydrated: () => set({ isRehydrated: true }),

      setUser: (user) => {
        set({ user });
        if (user) get().fetchCartFromDB();
        else set({ cartItems: [] });
      },

      fetchCartFromDB: async () => {
        const { user } = get();
        if (!user) return;
        const { data, error } = await supabase
          .from('cart_items')
          .select(`id, quantity, product_id, Products (id, name, price, img)`)
          .eq('user_id', user.id);

        if (!error && data) {
          const formattedCart = data.map((item: any) => ({
            cartItemId: item.id,
            id: item.product_id,
            name: item.Products.name,
            price: item.Products.price,
            img: item.Products.img,
            quantity: item.quantity
          }));
          set({ cartItems: formattedCart });
        }
      },

      addToCart: async (product: any) => {
        const { user, cartItems } = get();
        const existingItem = cartItems.find(item => item.id === product.id);

        // 统一字段名：确保不论传入的是 img 还是 imageUrl 都能正确存储
        const productImg = product.img || product.imageUrl;

        if (existingItem) {
          set({
            cartItems: cartItems.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          });
          if (user) await supabase.from('cart_items').update({ quantity: existingItem.quantity + 1 }).eq('id', existingItem.cartItemId);
        } else {
          set({ cartItems: [...cartItems, { ...product, img: productImg, quantity: 1 }] });
          if (user) {
            const { data } = await supabase.from('cart_items').insert({ user_id: user.id, product_id: product.id, quantity: 1 }).select().single();
            if (data) set((state) => ({ cartItems: state.cartItems.map(item => item.id === product.id ? { ...item, cartItemId: data.id } : item) }));
          }
        }
      },

      // 【核心优化】完善减号逻辑
      decreaseQuantity: async (productId: number | string) => {
        const { user, cartItems } = get();
        const item = cartItems.find(i => i.id === productId);
        if (!item) return;

        if (item.quantity > 1) {
          set({ cartItems: cartItems.map(i => i.id === productId ? { ...i, quantity: i.quantity - 1 } : i) });
          if (user) await supabase.from('cart_items').update({ quantity: item.quantity - 1 }).eq('id', item.cartItemId);
        } else {
          // 数量为 1 时点击减号，执行移除动作
          get().removeFromCart(productId);
        }
      },

      removeFromCart: async (productId: number | string) => {
        const { user, cartItems } = get();
        const itemToRemove = cartItems.find(i => i.id === productId);
        set({ cartItems: cartItems.filter(i => i.id !== productId) });
        if (user && itemToRemove?.cartItemId) await supabase.from('cart_items').delete().eq('id', itemToRemove.cartItemId);
      },
    }),
    {
      name: 'winavenue-cart-storage',
      onRehydrateStorage: (state) => {
        return () => state?.setRehydrated();
      },
      partialize: (state) => ({ cartItems: state.user ? [] : state.cartItems }),
    }
  )
);