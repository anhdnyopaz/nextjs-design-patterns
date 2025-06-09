import CodeExample from './CodeExample';
import ThemeDemo from './ThemeDemo';
import PortalDemo from './PortalDemo';
import ResponsiveDemo from './ResponsiveDemo';

export default function LearningSection() {
  const themeProviderCode = `// Theme Provider Pattern - ThemeProvider.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Định nghĩa Types cho Theme
interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
  };
}

// Các Theme mặc định
const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  name: 'dark',
  colors: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    error: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
  },
};

// Theme Context (Ngữ cảnh Theme)
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Component Theme Provider
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? lightTheme : darkTheme;
    setCurrentTheme(newTheme);
    setIsDark(!isDark);
    
    // Cập nhật CSS custom properties (thuộc tính tùy chỉnh)
    const root = document.documentElement;
    Object.entries(newTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(\`--color-\${key}\`, value);
    });
  }, [isDark]);

  const setTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    setIsDark(theme.name === 'dark');
  }, []);

  return (
    <ThemeContext.Provider 
      value={{ theme: currentTheme, isDark, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook (Hook tùy chỉnh)
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme phải được sử dụng trong ThemeProvider');
  }
  return context;
}`;

  const portalCode = `// Portal Pattern - Portal.tsx
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
  className?: string;
}

// Component Portal cơ bản
export function Portal({ children, containerId = 'portal-root', className }: PortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Tìm container hiện có hoặc tạo mới
    let portalContainer = document.getElementById(containerId);
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = containerId;
      if (className) {
        portalContainer.className = className;
      }
      document.body.appendChild(portalContainer);
    }

    setContainer(portalContainer);

    // Cleanup (dọn dẹp): xóa container nếu nó được tạo bởi component này
    return () => {
      if (portalContainer && portalContainer.children.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId, className]);

  // Không render (hiển thị) cho đến khi container sẵn sàng
  if (!container) return null;

  return createPortal(children, container);
}

// Component Modal sử dụng Portal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup khi unmount (gỡ bỏ)
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Portal containerId="modal-root">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop (nền mờ) */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={\`relative bg-white rounded-lg shadow-xl \${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto\`}>
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
}

// Component Tooltip sử dụng Portal
interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTargetRect(rect);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getTooltipStyle = () => {
    if (!targetRect) return {};

    const positions = {
      top: {
        bottom: window.innerHeight - targetRect.top + 8,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      },
      bottom: {
        top: targetRect.bottom + 8,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      },
      left: {
        top: targetRect.top + targetRect.height / 2,
        right: window.innerWidth - targetRect.left + 8,
        transform: 'translateY(-50%)',
      },
      right: {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + 8,
        transform: 'translateY(-50%)',
      },
    };

    return positions[position];
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <Portal containerId="tooltip-root">
          <div
            className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg pointer-events-none"
            style={getTooltipStyle()}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}`;

  const responsiveCode = `// Responsive Design Pattern - ResponsiveHooks.ts
import { useState, useEffect } from 'react';

// Định nghĩa breakpoints (điểm ngắt)
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook để lấy kích thước màn hình hiện tại
export function useScreenSize() {
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

    // Đặt kích thước ban đầu
    updateScreenSize();

    // Thêm event listener (trình lắng nghe sự kiện)
    window.addEventListener('resize', updateScreenSize);

    // Cleanup (dọn dẹp)
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}

// Hook cho media queries (truy vấn phương tiện)
export function useMediaQuery(query: string): boolean {
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

// Component Responsive Container (Container đáp ứng)
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: Breakpoint;
  padding?: boolean;
  className?: string;
}

export function ResponsiveContainer({ 
  children, 
  maxWidth = 'xl', 
  padding = true,
  className = '' 
}: ResponsiveContainerProps) {
  const maxWidthClass = {
    xs: 'max-w-none',
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
  };

  return (
    <div className={\`\${maxWidthClass[maxWidth]} mx-auto \${padding ? 'px-4 sm:px-6 lg:px-8' : ''} \${className}\`}>
      {children}
    </div>
  );
}

// Component Responsive Grid (Lưới đáp ứng)
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = '' 
}: ResponsiveGridProps) {
  const gridClasses = Object.entries(cols)
    .map(([breakpoint, colCount]) => {
      if (breakpoint === 'xs') {
        return \`grid-cols-\${colCount}\`;
      }
      return \`\${breakpoint}:grid-cols-\${colCount}\`;
    })
    .join(' ');

  return (
    <div className={\`grid \${gridClasses} gap-\${gap} \${className}\`}>
      {children}
    </div>
  );
}

// Component Responsive Text (Văn bản đáp ứng)
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: {
    xs?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    sm?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    md?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    lg?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  };
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export function ResponsiveText({ 
  children, 
  size = { xs: 'base', md: 'lg' },
  weight = 'normal',
  className = '' 
}: ResponsiveTextProps) {
  const sizeClasses = Object.entries(size)
    .map(([breakpoint, textSize]) => {
      if (breakpoint === 'xs') {
        return \`text-\${textSize}\`;
      }
      return \`\${breakpoint}:text-\${textSize}\`;
    })
    .join(' ');

  return (
    <span className={\`\${sizeClasses} font-\${weight} \${className}\`}>
      {children}
    </span>
  );
}

// Component Responsive Show/Hide (Hiển thị/Ẩn đáp ứng)
interface ResponsiveShowProps {
  children: React.ReactNode;
  above?: Breakpoint;
  below?: Breakpoint;
  only?: Breakpoint[];
}

export function ResponsiveShow({ children, above, below, only }: ResponsiveShowProps) {
  const { breakpoint } = useScreenSize();
  
  if (only) {
    const shouldShow = only.includes(breakpoint);
    return shouldShow ? <>{children}</> : null;
  }
  
  if (above && below) {
    const currentBp = breakpoints[breakpoint];
    const shouldShow = currentBp > breakpoints[above] && currentBp < breakpoints[below];
    return shouldShow ? <>{children}</> : null;
  }
  
  if (above) {
    const shouldShow = breakpoints[breakpoint] > breakpoints[above];
    return shouldShow ? <>{children}</> : null;
  }
  
  if (below) {
    const shouldShow = breakpoints[breakpoint] < breakpoints[below];
    return shouldShow ? <>{children}</> : null;
  }
  
  return <>{children}</>;
}`;

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          UI/UX Design Patterns (Mẫu thiết kế UI/UX)
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Khám phá các mẫu thiết kế UI/UX phổ biến trong React: Theme Provider (Nhà cung cấp giao diện) cho quản lý giao diện, 
          Portal Pattern (Mẫu cổng) cho rendering (hiển thị) ngoài DOM tree (cây DOM), và Responsive Design (Thiết kế đáp ứng) cho thiết kế đáp ứng.
        </p>
      </div>

      {/* Pattern 1: Theme Provider */}
      <section className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
            <span className="text-2xl">🎨</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Theme Provider Pattern (Mẫu nhà cung cấp giao diện)</h2>
            <p className="text-gray-600">Quản lý theme (giao diện) toàn cục với Context API (API ngữ cảnh)</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">✨ Tính năng chính:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Quản lý theme tập trung (chế độ sáng/tối)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>CSS custom properties (thuộc tính tùy chỉnh) tự động</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Type-safe (an toàn kiểu) theme configuration (cấu hình giao diện)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Persistence (lưu trữ bền vững) và system preference (tùy chọn hệ thống)</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">🎯 Ưu điểm:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Consistency (tính nhất quán) giữa các components (thành phần)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Dễ dàng chuyển đổi theme</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Design system (hệ thống thiết kế) dễ bảo trì</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Accessibility (khả năng tiếp cận) tốt hơn</span>
              </li>
            </ul>
          </div>
        </div>

        <ThemeDemo />

        <CodeExample 
          code={themeProviderCode}
          title="Triển khai Theme Provider"
          language="typescript"
        />
      </section>

      {/* Pattern 2: Portal Pattern */}
      <section className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
            <span className="text-2xl">🌀</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Portal Pattern (Mẫu cổng)</h2>
            <p className="text-gray-600">Render (hiển thị) components bên ngoài DOM hierarchy (phân cấp DOM) thông thường</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">✨ Các trường hợp sử dụng:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Modals (hộp thoại) và overlays (lớp phủ)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Tooltips (chú thích công cụ) và popovers (hộp bật lên)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Dropdown menus (menu thả xuống)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Notifications (thông báo) và toasts (thông báo nhanh)</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">🎯 Lợi ích:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">•</span>
                <span>Thoát khỏi xung đột z-index (chỉ số độ sâu)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">•</span>
                <span>Event handling (xử lý sự kiện) tốt hơn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">•</span>
                <span>CSS isolation (cô lập CSS)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">•</span>
                <span>Accessibility (khả năng tiếp cận) được cải thiện</span>
              </li>
            </ul>
          </div>
        </div>

        <PortalDemo />

        <CodeExample 
          code={portalCode}
          title="Triển khai Portal Pattern"
          language="typescript"
        />
      </section>

      {/* Pattern 3: Responsive Design */}
      <section className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl">
            <span className="text-2xl">📱</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Responsive Design Pattern (Mẫu thiết kế đáp ứng)</h2>
            <p className="text-gray-600">Adaptive UI (giao diện thích ứng) cho mọi kích thước màn hình</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">✨ Components:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Custom hooks (hook tùy chỉnh) cho screen size (kích thước màn hình)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Responsive containers (containers đáp ứng)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Adaptive grids (lưới thích ứng)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Conditional rendering (hiển thị có điều kiện)</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">🎯 Nguyên tắc:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Mobile-first approach (phương pháp ưu tiên di động)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Progressive enhancement (cải tiến tiến bộ)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Performance optimization (tối ưu hóa hiệu suất)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Accessibility first (ưu tiên khả năng tiếp cận)</span>
              </li>
            </ul>
          </div>
        </div>

        <ResponsiveDemo />

        <CodeExample 
          code={responsiveCode}
          title="Hooks & Components cho Responsive Design"
          language="typescript"
        />
      </section>

      {/* Best Practices */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Best Practices (Thực hành tốt nhất)</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-purple-700 mb-3">Theme Management (Quản lý giao diện)</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Sử dụng CSS custom properties (thuộc tính tùy chỉnh)</li>
              <li>• Triển khai system preference detection (phát hiện tùy chọn hệ thống)</li>
              <li>• Cache (lưu đệm) theme selection (lựa chọn giao diện)</li>
              <li>• Cung cấp theme switching animation (hoạt ảnh chuyển đổi giao diện)</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-blue-700 mb-3">Portal Usage (Sử dụng Portal)</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Luôn cleanup (dọn dẹp) event listeners (trình lắng nghe sự kiện)</li>
              <li>• Xử lý focus management (quản lý tiêu điểm)</li>
              <li>• Triển khai escape key handling (xử lý phím thoát)</li>
              <li>• Cân nhắc accessibility (khả năng tiếp cận)</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-green-700 mb-3">Responsive Design (Thiết kế đáp ứng)</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Sử dụng semantic breakpoints (điểm ngắt có ý nghĩa)</li>
              <li>• Tối ưu hóa cho touch interactions (tương tác cảm ứng)</li>
              <li>• Xem xét content hierarchy (phân cấp nội dung)</li>
              <li>• Test (thử nghiệm) trên thiết bị thật</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 