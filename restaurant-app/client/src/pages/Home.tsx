import React, { useEffect, useState } from 'react';
import API from '../api';
import Hero from '../components/Hero';
import FoodCard from '../components/FoodCard';

export default function Home() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/foods')
      .then(r => setFoods(r.data))
      .catch(() => setFoods([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pb-12">
      <Hero />
      
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 gradient-text">
              Today's Menu
            </h2>
            <p className="text-gray-600">
              Fresh and delicious meals prepared by expert chefs
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border-2 border-orangebrand text-orangebrand
              hover:bg-orangebrand hover:text-white transition-all">
              Filter
            </button>
            <button className="px-4 py-2 rounded-lg border-2 border-orangebrand text-orangebrand
              hover:bg-orangebrand hover:text-white transition-all">
              Sort
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-orangebrand text-xl">
              Loading menu<span className="loading-dots"></span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {foods.map((f, idx) => (
                <div key={f._id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <FoodCard food={f} />
                </div>
              ))}
            </div>
            
            {foods.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No menu items available</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
