"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

// 定义商品和购物车的类型
type CartItem = {
  id: number | string;      // 商品的 ID
  cartItemId?: number;      // 数据库里 cart_items 表的主键 ID
  name: string;
  price: string | number;
  img: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: number | string) => void;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);

  // 1. 页面加载时，监听用户是否登录，如果登录了就去云端拉取购物车
  useEffect(() => {
    const fetchUserAndCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) fetchCartFromDB(currentUser.id);
    };

    fetchUserAndCart();

    // 实时监听登录/登出状态
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        fetchCartFromDB(currentUser.id);
      } else {
        setCartItems([]); // 登出时清空本地购物车显示
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. 核心功能：从云端数据库获取购物车清单
  const fetchCartFromDB = async (userId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product_id,
        Products (id, name, price, img)
      `)
      .eq('user_id', userId);

    if (!error && data) {
      // 把云端数据转换成本地能看懂的格式
      const formattedCart = data.map((item: any) => ({
        cartItemId: item.id,
        id: item.product_id,
        name: item.Products.name,
        price: item.Products.price,
        img: item.Products.img,
        quantity: item.quantity
      }));
      setCartItems(formattedCart);
    }
  };

  // 3. 核心功能：加入购物车 (智能判断是否已登录)
  const addToCart = async (product: any) => {
    if (user) {
      // 【云端模式】
      const existingItem = cartItems.find(item => item.id === product.id);

      if (existingItem) {
        // 如果云端已经有这个包包了，只更新数量
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.cartItemId);
        
        if (!error) {
          setCartItems(prev => prev.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ));
        }
      } else {
        // 如果是新加的包包，存入数据库
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          })
          .select()
          .single();

        if (!error && data) {
          setCartItems(prev => [...prev, { 
            cartItemId: data.id, 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            img: product.img, 
            quantity: 1 
          }]);
        }
      }
    } else {
      // 【本地游客模式】
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  // 4. 核心功能：从购物车移除
  const removeFromCart = async (productId: number | string) => {
    if (user) {
      const itemToRemove = cartItems.find(item => item.id === productId);
      if (itemToRemove && itemToRemove.cartItemId) {
        // 告诉云端删除这条记录
         await supabase.from('cart_items').delete().eq('id', itemToRemove.cartItemId);
      }
    }
    // 更新本地显示
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};