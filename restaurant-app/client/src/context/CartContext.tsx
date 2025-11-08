import React, { createContext, useContext, useState } from 'react';

type CartItem = { id: string; title: string; price: number; qty: number };

interface CartContextType {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  updateQty: (id: string, qty: number) => void;
  subtotal: number;
  activeOrder: { id: string; startTime: number } | null;
  setActiveOrder: (order: { id: string; startTime: number } | null) => void;
  hasActiveOrder: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch { return []; }
  });

  const [activeOrder, setActiveOrder] = useState<{ id: string; startTime: number } | null>(() => {
    try {
      const saved = localStorage.getItem('activeOrder');
      if (!saved) return null;
      const order = JSON.parse(saved);
      // If order is older than 3 minutes, discard it
      if (Date.now() - order.startTime > 180000) {
        localStorage.removeItem('activeOrder');
        return null;
      }
      return order;
    } catch {
      return null;
    }
  });

  function persist(next: CartItem[]) { 
    setItems(next); 
    localStorage.setItem('cart', JSON.stringify(next)); 
  }

  const add = (item: CartItem) => {
    const found = items.find(i => i.id === item.id);
    if (found) persist(items.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i));
    else persist([...items, item]);
  };

  const remove = (id: string) => {
    persist(items.filter(i => i.id !== id));
  };

  const clear = () => persist([]);

  const updateQty = (id: string, qty: number) => {
    if (qty < 0) return;
    if (qty === 0) {
      remove(id);
      return;
    }
    persist(items.map(i => i.id === id ? { ...i, qty } : i));
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const handleSetActiveOrder = (order: { id: string; startTime: number } | null) => {
    setActiveOrder(order);
    if (order) {
      localStorage.setItem('activeOrder', JSON.stringify(order));
    } else {
      localStorage.removeItem('activeOrder');
    }
  };

  // Cleanup expired order
  React.useEffect(() => {
    if (activeOrder && Date.now() - activeOrder.startTime > 180000) {
      handleSetActiveOrder(null);
    }
  }, [activeOrder]);

  const hasActiveOrder = activeOrder !== null;

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        add, 
        remove, 
        clear, 
        updateQty,
        subtotal,
        activeOrder,
        setActiveOrder: handleSetActiveOrder,
        hasActiveOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
