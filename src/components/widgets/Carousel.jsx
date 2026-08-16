import React from 'react';

export default function Carousel({ children, loading }) {
  if (loading) {
    return (
      <div className="bg-[#111] py-4 px-6 flex gap-4 overflow-hidden border-b border-gray-800">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="w-72 h-32 flex-shrink-0 bg-[#1a1a1a] rounded-lg border border-gray-800 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#111] py-4 px-6 border-b border-gray-800">
      <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}