import React from 'react';

interface OrderProgressProps {
  timeLeft: number;
  onComplete: () => void;
}

const OrderProgress: React.FC<OrderProgressProps> = ({ timeLeft, onComplete }) => {
  const progress = ((180 - timeLeft) / 180) * 100;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg transform transition-transform animate-slide-up z-50">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-orangebrand animate-pulse"></div>
            <div className="ml-3">
              <h3 className="font-semibold">Order in Progress</h3>
              <p className="text-sm text-gray-600">Estimated delivery: {timeLeft} seconds</p>
            </div>
          </div>
          <div className="text-orangebrand font-medium">
            {Math.round(progress)}% Complete
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orangebrand to-orangelight transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OrderProgress;