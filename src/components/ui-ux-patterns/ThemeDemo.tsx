'use client';

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
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Component Theme Provider
function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? lightTheme : darkTheme;
    setCurrentTheme(newTheme);
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook (Hook tùy chỉnh)
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme phải được sử dụng trong ThemeProvider');
  }
  return context;
}

// Sample Component sử dụng Theme
function ThemedCard() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div 
      className="p-6 rounded-lg border shadow-sm transition-all duration-300"
      style={{
        background: theme.colors.surface,
        borderColor: theme.colors.border,
        color: theme.colors.text,
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text }}
        >
          Themed Component (Component có giao diện)
        </h3>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors"
          style={{
            background: theme.colors.primary,
            color: theme.colors.background,
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <p 
        className="mb-4"
        style={{ color: theme.colors.textSecondary }}
      >
        Component này tự động thích ứng với theme hiện tại. Nhấp vào nút chuyển đổi để chuyển giữa chế độ sáng và tối.
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div 
          className="p-3 rounded text-center text-sm font-medium"
          style={{ 
            background: theme.colors.primary, 
            color: theme.colors.background 
          }}
        >
          Primary (Chính)
        </div>
        <div 
          className="p-3 rounded text-center text-sm font-medium"
          style={{ 
            background: theme.colors.success, 
            color: theme.colors.background 
          }}
        >
          Success (Thành công)
        </div>
        <div 
          className="p-3 rounded text-center text-sm font-medium"
          style={{ 
            background: theme.colors.warning, 
            color: theme.colors.background 
          }}
        >
          Warning (Cảnh báo)
        </div>
      </div>
    </div>
  );
}

// Main Demo Component
export default function ThemeDemo() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
          <span className="text-2xl">🎨</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Theme Provider Demo (Demo nhà cung cấp giao diện)</h2>
          <p className="text-gray-600">Minh họa tương tác việc chuyển đổi theme</p>
        </div>
      </div>

      <ThemeProvider>
        <div className="space-y-6">
          <ThemedCard />
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">💡 Tính năng chính:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Quản lý theme tập trung với Context API (API ngữ cảnh)</li>
              <li>• Chuyển đổi color scheme (lược đồ màu) tự động</li>
              <li>• Type-safe (an toàn kiểu) theme configuration (cấu hình giao diện)</li>
              <li>• Transitions (chuyển tiếp) mượt mà giữa các theme</li>
            </ul>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
} 