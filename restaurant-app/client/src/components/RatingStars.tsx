import React from 'react';

export default function RatingStars({ value = 4.5 }: any) {
  return <div className="text-sm text-yellow-500">{'★'.repeat(Math.round(value))} <span className="text-gray-400">({value.toFixed(1)})</span></div>;
}
