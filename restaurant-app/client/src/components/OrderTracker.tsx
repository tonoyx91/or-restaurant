import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

interface OrderTrackerProps {
  orderId?: string;
  estimatedTime?: number; // in minutes
}

export default function OrderTracker({ orderId, estimatedTime = 3 }: OrderTrackerProps) {
  const [timeLeft, setTimeLeft] = useState(estimatedTime * 60); // Convert to seconds
  const [progress, setProgress] = useState(0);
  const totalTime = estimatedTime * 60;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          setProgress((totalTime - newTime) / totalTime * 100);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, totalTime]);

  if (!orderId) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed right-4 bottom-24 w-80 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">Order in Progress</span>
          </div>
          <span className="text-sm">#{orderId.slice(-6)}</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <div className="text-3xl font-bold">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm opacity-90">Estimated Delivery Time</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
            <div className="text-lg font-bold">{Math.round(progress)}%</div>
          </div>
        </div>

        <div className="relative h-1.5 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-white transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}