'use client';

import React, { Component, ReactNode, useState } from 'react';

// Error Boundary Class Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to monitoring service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Đã xảy ra lỗi!</h3>
              <p className="text-red-600">Error Boundary đã bắt được lỗi trong component con</p>
            </div>
          </div>
          
          <div className="bg-red-100 p-4 rounded mb-4">
            <p className="text-sm text-red-700">
              <strong>Lỗi:</strong> {this.state.error?.message}
            </p>
            {this.state.errorInfo && (
              <details className="mt-2">
                <summary className="text-sm font-medium text-red-700 cursor-pointer">
                  Chi tiết stack trace
                </summary>
                <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>

          <button
            onClick={this.reset}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component that can throw errors for demo
function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Đây là một lỗi giả lập để demo Error Boundary!');
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="font-semibold text-green-800">Component hoạt động bình thường</h3>
      </div>
      <p className="text-green-600">
        Component này đang chạy mà không có lỗi. Nhấn nút &quot;Tạo lỗi&quot; để xem Error Boundary hoạt động.
      </p>
    </div>
  );
}

// Advanced Error Boundary with retry logic
function RetryErrorBoundary({ children, maxRetries = 3 }: { children: ReactNode; maxRetries?: number }) {
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetError = () => {
    if (retryCount < maxRetries) {
      setHasError(false);
      setError(null);
      setRetryCount(prev => prev + 1);
    }
  };

  if (hasError && error) {
    return (
      <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-full">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-800">Error Boundary với Retry Logic</h3>
            <p className="text-orange-600">Đã thử {retryCount}/{maxRetries} lần</p>
          </div>
        </div>

        <div className="bg-orange-100 p-4 rounded mb-4">
          <p className="text-sm text-orange-700">
            <strong>Lỗi:</strong> {error.message}
          </p>
        </div>

        {retryCount < maxRetries ? (
          <button
            onClick={resetError}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Thử lại ({maxRetries - retryCount} lần còn lại)
          </button>
        ) : (
          <div className="text-orange-700">
            <p className="mb-2">Đã vượt quá số lần thử tối đa. Vui lòng liên hệ support.</p>
            <button
              onClick={() => {
                setRetryCount(0);
                setHasError(false);
                setError(null);
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              Reset hoàn toàn
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary
      onError={(error) => {
        setHasError(true);
        setError(error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Main Demo Component
export default function ErrorBoundaryDemo() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [shouldThrowWithRetry, setShouldThrowWithRetry] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
          <span className="text-2xl">🛡️</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Error Boundary Demo</h2>
          <p className="text-gray-600">Demo tương tác của Error Boundary pattern</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Error Boundary Demo */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">1. Basic Error Boundary</h3>
          <p className="text-gray-600 mb-4">
            Error Boundary cơ bản bắt lỗi và hiển thị UI fallback (dự phòng).
          </p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShouldThrow(false)}
              className={`px-4 py-2 rounded transition-colors ${
                !shouldThrow 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Component bình thường
            </button>
            <button
              onClick={() => setShouldThrow(true)}
              className={`px-4 py-2 rounded transition-colors ${
                shouldThrow 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tạo lỗi
            </button>
          </div>

          <ErrorBoundary>
            <BuggyComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>

        {/* Retry Error Boundary Demo */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">2. Error Boundary với Retry Logic</h3>
          <p className="text-gray-600 mb-4">
            Error Boundary nâng cao với khả năng thử lại và giới hạn số lần retry.
          </p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShouldThrowWithRetry(false)}
              className={`px-4 py-2 rounded transition-colors ${
                !shouldThrowWithRetry 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Component bình thường
            </button>
            <button
              onClick={() => setShouldThrowWithRetry(true)}
              className={`px-4 py-2 rounded transition-colors ${
                shouldThrowWithRetry 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tạo lỗi với retry
            </button>
          </div>

          <RetryErrorBoundary maxRetries={3}>
            <BuggyComponent shouldThrow={shouldThrowWithRetry} />
          </RetryErrorBoundary>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-500">
          <h4 className="font-semibold text-red-800 mb-2">🎯 Lợi ích của Error Boundary:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Ngăn chặn ứng dụng bị crash hoàn toàn do lỗi component</li>
            <li>• Cung cấp UI fallback (dự phòng) thân thiện với người dùng</li>
            <li>• Ghi log lỗi để debugging và monitoring</li>
            <li>• Cho phép recovery (khôi phục) từ lỗi một cách graceful (nhẹ nhàng)</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 