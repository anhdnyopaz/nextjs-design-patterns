'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';

interface VirtualItem {
  id: number;
  title: string;
  description: string;
  value: number;
  category: string;
  height: number;
}

// Generate large dataset
const generateItems = (count: number): VirtualItem[] => {
  const categories = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is the description for item ${i + 1}. ${Math.random() > 0.5 ? 'It has some additional content that makes it longer.' : ''}`,
    value: Math.floor(Math.random() * 1000),
    category: categories[i % categories.length],
    height: Math.random() > 0.7 ? 120 : 80 // Random heights
  }));
};

// Virtual List Hook
function useVirtualList({
  items,
  containerHeight,
  overscan = 5
}: {
  items: VirtualItem[];
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const { startIndex, endIndex, totalHeight, offsetY } = useMemo(() => {
    let startIdx = 0;
    let endIdx = 0;
    let accumulatedHeight = 0;
    let offsetY = 0;
    
    // Find start index
    for (let i = 0; i < items.length; i++) {
      if (accumulatedHeight + items[i].height > scrollTop) {
        startIdx = Math.max(0, i - overscan);
        offsetY = Math.max(0, accumulatedHeight - (overscan * 80)); // Estimate offset
        break;
      }
      accumulatedHeight += items[i].height;
    }
    
    // Find end index
    accumulatedHeight = 0;
    for (let i = 0; i < items.length; i++) {
      if (accumulatedHeight > scrollTop + containerHeight) {
        endIdx = Math.min(items.length - 1, i + overscan);
        break;
      }
      accumulatedHeight += items[i].height;
    }
    
    if (endIdx === 0) endIdx = items.length - 1;
    
    // Calculate total height
    const totalHeight = items.reduce((sum, item) => sum + item.height, 0);
    
    return { startIndex: startIdx, endIndex: endIdx, totalHeight, offsetY };
  }, [items, scrollTop, containerHeight, overscan]);
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, startIndex, endIndex]);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
}

// Memoized Item Component
const VirtualItem = React.memo(({ 
  item, 
  style 
}: { 
  item: VirtualItem & { index: number }; 
  style: React.CSSProperties;
}) => {
  console.log(`Rendering VirtualItem ${item.id}`); // Debug log
  
  return (
    <div
      style={style}
      className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{item.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
        </div>
        <div className="text-right ml-4">
          <span className={`px-2 py-1 text-xs rounded-full ${
            item.category === 'Alpha' ? 'bg-blue-100 text-blue-800' :
            item.category === 'Beta' ? 'bg-green-100 text-green-800' :
            item.category === 'Gamma' ? 'bg-yellow-100 text-yellow-800' :
            item.category === 'Delta' ? 'bg-purple-100 text-purple-800' :
            'bg-red-100 text-red-800'
          }`}>
            {item.category}
          </span>
          <div className="font-bold text-lg mt-1">{item.value}</div>
        </div>
      </div>
    </div>
  );
});

VirtualItem.displayName = 'VirtualItem';

export default function VirtualScrollDemo() {
  const [itemCount, setItemCount] = useState(10000);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight] = useState(400);
  
  // Generate items
  const allItems = useMemo(() => generateItems(itemCount), [itemCount]);
  
  // Filter items
  const filteredItems = useMemo(() => {
    if (filterCategory === 'All') return allItems;
    return allItems.filter(item => item.category === filterCategory);
  }, [allItems, filterCategory]);
  
  // Virtual list logic
  const { visibleItems, totalHeight, offsetY, setScrollTop } = useVirtualList({
    items: filteredItems,
    containerHeight
  });
  
  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, [setScrollTop]);
  
  const categories = ['All', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Virtual Scrolling Demo</h2>
          <p className="text-gray-600">
            Rendering {filteredItems.length.toLocaleString()} items efficiently
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng items:
            </label>
            <select
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={1000}>1,000</option>
              <option value={10000}>10,000</option>
              <option value={100000}>100,000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category:
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Virtual Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="border border-gray-300 rounded-lg overflow-auto"
        style={{ height: containerHeight }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item) => (
              <VirtualItem
                key={item.id}
                item={item}
                style={{ height: item.height }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{filteredItems.length.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{visibleItems.length}</div>
            <div className="text-sm text-gray-600">Rendered Items</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((visibleItems.length / filteredItems.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Render Ratio</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(totalHeight / 1000)}k
            </div>
            <div className="text-sm text-gray-600">Total Height (px)</div>
          </div>
        </div>
      </div>
      
      {/* Performance Tips */}
      <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
        <h3 className="font-semibold text-blue-800 mb-2">🚀 Performance Tips:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Chỉ render các items hiển thị trong viewport</li>
          <li>• Sử dụng React.memo để tránh re-render không cần thiết</li>
          <li>• Implement variable heights cho flexible layouts</li>
          <li>• Overscan để smooth scrolling experience</li>
        </ul>
      </div>
    </div>
  );
} 