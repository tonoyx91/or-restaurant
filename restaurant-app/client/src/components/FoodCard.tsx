import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function FoodCard({ food }: any) {
  const { add } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAdd = () => {
    add({ id: food._id, title: food.title, price: food.price, qty: 1 });
    // Trigger scale animation on add
    const btn = document.getElementById(`add-btn-${food._id}`);
    btn?.classList.add('animate-scale');
    setTimeout(() => btn?.classList.remove('animate-scale'), 200);
  };

  return (
    <div 
      className="w-72 card mr-6 group animate-enter"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={food.image} 
          alt={food.title} 
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button 
          id={`add-btn-${food._id}`}
          onClick={handleAdd}
          className="absolute bottom-4 right-4 bg-white text-orangebrand rounded-full w-10 h-10 
            flex items-center justify-center text-xl font-semibold shadow-lg
            transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
            transition-all duration-300 hover:bg-orangebrand hover:text-white"
        >
          +
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-orange-100 text-orangebrand text-xs rounded-full">
            Best Seller
          </span>
          <div className="flex items-center text-yellow-400 text-sm">
            ★★★★★ <span className="text-gray-400 ml-1">({food.rating})</span>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-1 group-hover:text-orangebrand transition-colors">
          {food.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {food.description || 'Made with premium ingredients'}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-700">
            Tk {food.price}
          </div>
          <div className="text-sm text-gray-400">
            20-30 min
          </div>
        </div>
      </div>
    </div>
  );
}
