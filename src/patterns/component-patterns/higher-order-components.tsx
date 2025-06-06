'use client';

import React, { useState, useEffect, ComponentType } from 'react';

// Types
type ComponentWithLoading<P = Record<string, unknown>> = ComponentType<P & { isLoading?: boolean }>;

// 1. WithLoading HOC
export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentWithLoading<P> {
  const WithLoadingComponent = (props: P & { isLoading?: boolean }) => {
    const { isLoading, ...restProps } = props;
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      );
    }

    return <WrappedComponent {...(restProps as P)} />;
  };

  WithLoadingComponent.displayName = `withLoading(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithLoadingComponent;
}

// 2. WithAuth HOC
interface AuthProps {
  user?: { id: string; name: string; role: string } | null;
  requiredRole?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredRole?: string
) {
  const WithAuthComponent = (props: P & AuthProps) => {
    const { user, ...restProps } = props;
    
    if (!user) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Cần đăng nhập</h2>
          <p className="text-gray-600">Bạn cần đăng nhập để truy cập tính năng này.</p>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Đăng nhập
          </button>
        </div>
      );
    }

    if (requiredRole && user.role !== requiredRole) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⛔</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600">
            Bạn không có quyền truy cập tính năng này. Cần role: {requiredRole}
          </p>
        </div>
      );
    }

    return <WrappedComponent {...(restProps as P)} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithAuthComponent;
}

// 3. WithErrorBoundary HOC
interface ErrorInfo {
  componentStack: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallbackComponent?: ComponentType<{ error: Error; resetError: () => void }>
) {
  const FallbackComponent = fallbackComponent || DefaultErrorFallback;

  class ErrorBoundary extends React.Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
      this.setState({ errorInfo });
    }

    resetError = () => {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
      if (this.state.hasError && this.state.error) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  (ErrorBoundary as unknown as { displayName: string }).displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ErrorBoundary;
}

// Default Error Fallback Component
const DefaultErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-6xl mb-4">💥</div>
    <h2 className="text-xl font-semibold text-red-800 mb-2">Có lỗi xảy ra</h2>
    <p className="text-red-600 mb-4">{error.message}</p>
    <button
      onClick={resetError}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Thử lại
    </button>
  </div>
);

// 4. WithLocalStorage HOC
interface LocalStorageOptions {
  key: string;
  defaultValue?: unknown;
}

export function withLocalStorage<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: LocalStorageOptions
) {
  const WithLocalStorageComponent = (props: P) => {
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === 'undefined') return options.defaultValue;
      
      try {
        const item = window.localStorage.getItem(options.key);
        return item ? JSON.parse(item) : options.defaultValue;
      } catch {
        return options.defaultValue;
      }
    });

    const setValue = (value: unknown) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(options.key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };

    const enhancedProps = {
      ...props,
      [options.key]: storedValue,
      [`set${options.key.charAt(0).toUpperCase() + options.key.slice(1)}`]: setValue
    } as P;

    return <WrappedComponent {...enhancedProps} />;
  };

  WithLocalStorageComponent.displayName = `withLocalStorage(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithLocalStorageComponent;
}

// 5. WithWindowSize HOC
interface WindowSizeProps {
  windowSize: { width: number; height: number };
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function withWindowSize<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  const WithWindowSizeComponent = (props: P) => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
    const isDesktop = windowSize.width >= 1024;

    const enhancedProps = {
      ...props,
      windowSize,
      isMobile,
      isTablet,
      isDesktop
    } as P & WindowSizeProps;

    return <WrappedComponent {...enhancedProps} />;
  };

  WithWindowSizeComponent.displayName = `withWindowSize(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithWindowSizeComponent;
}

// 6. WithTheme HOC
interface ThemeProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function withTheme<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  const WithThemeComponent = (props: P) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
      setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    };

    const enhancedProps = {
      ...props,
      theme,
      toggleTheme
    } as P & ThemeProps;

    return <WrappedComponent {...enhancedProps} />;
  };

  WithThemeComponent.displayName = `withTheme(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithThemeComponent;
}

// 7. Compose HOCs utility
export function compose(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...hocs: Array<(component: ComponentType<any>) => ComponentType<any>>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (WrappedComponent: ComponentType<any>) => {
    return hocs.reduceRight(
      (acc, hoc) => hoc(acc),
      WrappedComponent
    );
  };
}

// 8. WithClickOutside HOC
interface ClickOutsideProps {
  onClickOutside: () => void;
}

export function withClickOutside<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & ClickOutsideProps> {
  const WithClickOutsideComponent = (props: P & ClickOutsideProps) => {
    const { onClickOutside, ...restProps } = props;
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          onClickOutside();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClickOutside]);

    return (
      <div ref={ref}>
        <WrappedComponent {...(restProps as P)} />
      </div>
    );
  };

  WithClickOutsideComponent.displayName = `withClickOutside(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithClickOutsideComponent;
} 