import React from 'react';

export default function NewsCard({ newsList }) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 h-fit">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-l-2 border-emerald-500 pl-2">
        Top Cricket News
      </h3>
      <div className="space-y-4">
        {newsList.slice(0, 5).map((item, idx) => {
          const story = item?.story;
          if (!story) return null;
          return (
            <div key={idx} className="border-b border-gray-800/60 pb-3 last:border-0 group cursor-pointer">
              <h4 className="text-sm font-bold text-gray-200 group-hover:text-emerald-400 transition-colors">
                {story.hline}
              </h4>
              {story.intro && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{story.intro}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}