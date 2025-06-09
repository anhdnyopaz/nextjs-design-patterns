'use client';

import React, { useState, useEffect } from 'react';

// Định nghĩa breakpoints (điểm ngắt)
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

// Hook để lấy kích thước màn hình hiện tại
function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    breakpoint: Breakpoint;
  }>({
    width: 0,
    height: 0,
    breakpoint: 'xs',
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint: Breakpoint = 'xs';
      for (const [key, value] of Object.entries(breakpoints)) {
        if (width >= value) {
          breakpoint = key as Breakpoint;
        }
      }

      setScreenSize({ width, height, breakpoint });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}

// Hook cho media queries (truy vấn phương tiện)
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [query]);

  return matches;
}

// Demo Component Responsive Grid
function ResponsiveGridDemo() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Mục ${i + 1}`,
    description: `Đây là mục số ${i + 1}`,
  }));

  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Responsive Grid (Lưới đáp ứng)</h3>
      <p className="text-gray-600 mb-4">
        Lưới này thích ứng với các kích thước màn hình khác nhau: 1 cột trên mobile, 2 trên tablet, 3 trên desktop.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg"
          >
            <h4 className="font-semibold text-teal-800">{item.title}</h4>
            <p className="text-sm text-teal-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Demo Responsive Text
function ResponsiveTextDemo() {
  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Responsive Typography (Typography đáp ứng)</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tiêu đề</h4>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Tiêu đề này thay đổi kích thước theo màn hình
          </h2>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Văn bản nội dung</h4>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            Đoạn văn bản này cũng thích ứng với các kích thước màn hình khác nhau để tối ưu khả năng đọc.
          </p>
        </div>
      </div>
    </div>
  );
}

// Demo Responsive Show/Hide
function ResponsiveVisibilityDemo() {
  const { breakpoint } = useScreenSize();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Check if we're on client-side to avoid SSR issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Responsive Visibility (Hiển thị đáp ứng)</h3>
      <p className="text-gray-600 mb-4">
        Nội dung khác nhau được hiển thị dựa trên kích thước màn hình. Thay đổi kích thước trình duyệt để xem hiệu ứng.
      </p>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800">
            <strong>Breakpoint hiện tại:</strong> {breakpoint} ({isClient ? window.innerWidth : '---'}px)
          </p>
        </div>

        {isMobile && (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">📱 Nội dung mobile - Chỉ hiển thị trên màn hình nhỏ</p>
          </div>
        )}

        {isTablet && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">📟 Nội dung tablet - Chỉ hiển thị trên màn hình vừa</p>
          </div>
        )}

        {isDesktop && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded">
            <p className="text-purple-800">🖥️ Nội dung desktop - Chỉ hiển thị trên màn hình lớn</p>
          </div>
        )}

        <div className="hidden sm:block p-4 bg-gray-50 border border-gray-200 rounded">
          <p className="text-gray-800">Ẩn trên mobile, hiển thị từ tablet trở lên</p>
        </div>

        <div className="block sm:hidden p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">Chỉ hiển thị trên mobile</p>
        </div>
      </div>
    </div>
  );
}

// Main Demo Component
export default function ResponsiveDemo() {
  const { width, height, breakpoint } = useScreenSize();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl">
          <span className="text-2xl">📱</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Responsive Design Demo (Demo thiết kế đáp ứng)</h2>
          <p className="text-gray-600">Minh họa tương tác các mẫu responsive</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Screen Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-indigo-500">
          <h4 className="font-semibold text-indigo-800 mb-2">📊 Thông tin màn hình hiện tại:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-indigo-600">Chiều rộng:</span>
              <span className="font-mono ml-2">{width}px</span>
            </div>
            <div>
              <span className="text-indigo-600">Chiều cao:</span>
              <span className="font-mono ml-2">{height}px</span>
            </div>
            <div>
              <span className="text-indigo-600">Breakpoint:</span>
              <span className="font-mono ml-2">{breakpoint}</span>
            </div>
          </div>
        </div>

        <ResponsiveGridDemo />
        <ResponsiveTextDemo />
        <ResponsiveVisibilityDemo />

        {/* Breakpoint Info */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-4">📏 Tham khảo Breakpoint:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
            {Object.entries(breakpoints).map(([name, value]) => (
              <div
                key={name}
                className={`p-3 rounded border ${
                  breakpoint === name
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <div className="font-semibold">{name}</div>
                <div className="text-xs">{value}px+</div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border-l-4 border-green-500">
          <h4 className="font-semibold text-green-800 mb-2">🎯 Responsive Best Practices (Thực hành tốt nhất):</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Sử dụng mobile-first approach (phương pháp ưu tiên di động)</li>
            <li>• Test (thử nghiệm) trên thiết bị thật, không chỉ dev tools của trình duyệt</li>
            <li>• Cân nhắc touch interactions (tương tác cảm ứng) trên mobile</li>
            <li>• Tối ưu hóa hình ảnh cho các screen densities (mật độ màn hình) khác nhau</li>
            <li>• Sử dụng semantic breakpoints (điểm ngắt có ý nghĩa) dựa trên nội dung</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 