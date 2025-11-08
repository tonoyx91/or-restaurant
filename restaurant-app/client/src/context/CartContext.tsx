import React, { createContext, useContext, useState } from 'react';

type CartItem = { id: string; title: string; price: number; qty: number };

const CartContext = createContext<any>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch { return []; }
  });

  function persist(next: CartItem[]) { setItems(next); localStorage.setItem('cart', JSON.stringify(next)); }

  const add = (item: CartItem) => {
    const found = items.find(i => i.id === item.id);
    if (found) persist(items.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i));
    else persist([...items, item]);
  };
  const remove = (id: string) => persist(items.filter(i => i.id !== id));
  const clear = () => persist([]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return <CartContext.Provider value={{ items, add, remove, clear, subtotal }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
