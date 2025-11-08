import React from 'react';

export default function Hero() {
  return (
    <div className="rounded-2xl overflow-hidden mb-12 relative animate-enter">
      <div className="absolute inset-0 bg-gradient-to-r from-orangebrand to-orangelight opacity-90 z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80" 
        alt="hero" 
        className="w-full h-[500px] object-cover"
      />
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-lg text-white">
            <h1 className="text-5xl font-bold mb-6 leading-tight animate-slide-up">
              Delicious food delivered fast
            </h1>
            <p className="text-xl mb-8 text-white/90 animate-slide-up" style={{animationDelay: '0.1s'}}>
              Experience the finest cuisine from our expert chefs, 
              delivered right to your doorstep.
            </p>
            <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <button className="px-8 py-4 bg-white text-orangebrand rounded-xl font-semibold
                transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                Order Now
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold
                transform transition-all duration-200 hover:bg-white hover:text-orangebrand">
                View Menu
              </button>
            </div>
            <div className="mt-12 flex items-center gap-8 text-white/90 animate-slide-up" 
              style={{animationDelay: '0.3s'}}>
              <div>
                <div className="text-3xl font-bold">30+</div>
                <div className="text-sm">Restaurants</div>
              </div>
              <div>
                <div className="text-3xl font-bold">150+</div>
                <div className="text-sm">Menu Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold">45min</div>
                <div className="text-sm">Fast Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
