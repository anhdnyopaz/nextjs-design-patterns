'use client';

import React from 'react';
import CodeExample from './CodeExample';
import ErrorBoundaryDemo from './ErrorBoundaryDemo';
import RetryPatternDemo from './RetryPatternDemo';
import CircuitBreakerDemo from './CircuitBreakerDemo';

const errorBoundaryCode = `// Error Boundary Class Component
import React, { Component, ReactNode } from 'react';

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
    // Cập nhật state để hiển thị fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log lỗi cho monitoring
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Gọi custom error handler nếu có
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Sử dụng Error Boundary
function App() {
  return (
    <ErrorBoundary fallback={<div>Oops! Something went wrong</div>}>
      <MyComponent />
    </ErrorBoundary>
  );
}`;

const retryPatternCode = `// Retry Hook với Exponential Backoff
import { useState, useCallback } from 'react';

function useRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoffMultiplier: number = 2
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let currentRetry = 0;

    const attemptFn = async (): Promise<T> => {
      try {
        const result = await fn();
        setRetryCount(currentRetry);
        return result;
      } catch (err) {
        currentRetry++;
        setRetryCount(currentRetry);

        if (currentRetry >= maxRetries) {
          throw err;
        }

        // Exponential backoff với jitter
        const currentDelay = delay * Math.pow(backoffMultiplier, currentRetry - 1);
        const jitter = Math.random() * 100; // Random jitter
        
        await new Promise(resolve => 
          setTimeout(resolve, currentDelay + jitter)
        );
        
        return attemptFn();
      }
    };

    try {
      const result = await attemptFn();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fn, maxRetries, delay, backoffMultiplier]);

  return { execute, isLoading, error, retryCount };
}

// Sử dụng Retry Hook
function MyComponent() {
  const apiCall = () => fetch('/api/data').then(res => res.json());
  const { execute, isLoading, error, retryCount } = useRetry(apiCall, 3);

  return (
    <div>
      <button onClick={execute} disabled={isLoading}>
        {isLoading ? \`Đang thử lại... (\${retryCount})\` : 'Call API'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}`;

const circuitBreakerCode = `// Circuit Breaker Implementation
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  successThreshold?: number;
}

function useCircuitBreaker<T>(
  fn: () => Promise<T>,
  config: CircuitBreakerConfig
) {
  const [state, setState] = useState<CircuitState>(CircuitState.CLOSED);
  const [failureCount, setFailureCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [lastFailureTime, setLastFailureTime] = useState<number | null>(null);

  const execute = useCallback(async () => {
    // Kiểm tra xem có thể chuyển từ OPEN sang HALF_OPEN không
    if (state === CircuitState.OPEN && lastFailureTime) {
      const timeSinceLastFailure = Date.now() - lastFailureTime;
      if (timeSinceLastFailure >= config.resetTimeout) {
        setState(CircuitState.HALF_OPEN);
        setSuccessCount(0);
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    // Từ chối request nếu circuit đang OPEN
    if (state === CircuitState.OPEN) {
      throw new Error('Circuit breaker is OPEN');
    }

    try {
      const result = await fn();

      // Xử lý success trong HALF_OPEN state
      if (state === CircuitState.HALF_OPEN) {
        const newSuccessCount = successCount + 1;
        setSuccessCount(newSuccessCount);
        
        if (newSuccessCount >= (config.successThreshold || 1)) {
          setState(CircuitState.CLOSED);
          setFailureCount(0);
          setSuccessCount(0);
        }
      }

      return result;
    } catch (err) {
      const newFailureCount = failureCount + 1;
      setFailureCount(newFailureCount);
      setLastFailureTime(Date.now());

      // Mở circuit nếu đạt threshold
      if (newFailureCount >= config.failureThreshold) {
        setState(CircuitState.OPEN);
      }

      throw err;
    }
  }, [fn, state, failureCount, successCount, lastFailureTime, config]);

  return { execute, state, failureCount, successCount };
}

// Sử dụng Circuit Breaker
function ApiComponent() {
  const apiCall = () => fetch('/api/unreliable').then(res => res.json());
  
  const { execute, state, failureCount } = useCircuitBreaker(apiCall, {
    failureThreshold: 3,
    resetTimeout: 5000,
    successThreshold: 2
  });

  return (
    <div>
      <p>Circuit State: {state}</p>
      <p>Failures: {failureCount}</p>
      <button onClick={execute}>Call API</button>
    </div>
  );
}`;

const combiningPatternsCode = `// Kết hợp Error Handling Patterns
import React from 'react';

// Error Boundary với Retry và Circuit Breaker
function RobustComponent() {
  const apiCall = () => fetch('/api/data').then(res => res.json());
  
  // Circuit Breaker
  const { execute: circuitExecute, state } = useCircuitBreaker(apiCall, {
    failureThreshold: 3,
    resetTimeout: 10000
  });
  
  // Retry với Circuit Breaker
  const { execute: retryExecute, isLoading, error } = useRetry(
    circuitExecute,
    3,
    1000,
    2
  );

  return (
    <ErrorBoundary 
      fallback={<div>Component gặp lỗi nghiêm trọng!</div>}
      onError={(error, errorInfo) => {
        // Log error cho monitoring service
        console.error('Component error:', error, errorInfo);
      }}
    >
      <div>
        <h3>Robust API Component</h3>
        <p>Circuit State: {state}</p>
        
        <button 
          onClick={retryExecute} 
          disabled={isLoading || state === 'OPEN'}
        >
          {isLoading ? 'Loading...' : 'Call API'}
        </button>
        
        {error && (
          <div className="error">
            Error: {error.message}
          </div>
        )}
        
        {state === 'OPEN' && (
          <div className="warning">
            Circuit breaker is open. API calls are blocked.
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Global Error Handler
function GlobalErrorHandler({ children }: { children: React.ReactNode }) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // sendToMonitoring(error, errorInfo);
    }
    
    // Log locally
    console.error('Global error:', error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}`;

export default function ErrorHandlingLearningSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl mb-6">
            <span className="text-4xl">🚨</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Error Handling Patterns
            <span className="block text-2xl font-normal text-gray-600 mt-2">
              (Các Pattern xử lý lỗi)
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Học các pattern quan trọng để xây dựng ứng dụng React robust (mạnh mẽ) và fault-tolerant (chịu lỗi). 
            Bao gồm Error Boundary, Retry Pattern, và Circuit Breaker với demos tương tác.
          </p>
        </div>

        {/* Pattern Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">🛡️</span>
              <h3 className="text-xl font-bold text-gray-900">Error Boundary</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Bắt lỗi JavaScript trong component tree và hiển thị fallback UI thay vì crash toàn bộ ứng dụng.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">🔄</span>
              <h3 className="text-xl font-bold text-gray-900">Retry Pattern</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Tự động thử lại các operations thất bại với exponential backoff và jitter để xử lý transient failures.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-yellow-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">⚡</span>
              <h3 className="text-xl font-bold text-gray-900">Circuit Breaker</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Ngăn chặn cascade failures bằng cách ngừng gọi failing services và cho phép chúng recover.
            </p>
          </div>
        </div>

        {/* Error Boundary Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">🛡️</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Error Boundary Pattern
              </h2>
              <p className="text-gray-600">
                Bắt và xử lý lỗi JavaScript trong React component tree
              </p>
            </div>
          </div>

          <CodeExample
            title="Error Boundary Implementation"
            code={errorBoundaryCode}
            explanation="Error Boundary là React component bắt lỗi JavaScript ở bất kỳ đâu trong component tree con của nó, log những lỗi đó, và hiển thị fallback UI thay vì crash component tree."
          />

          <ErrorBoundaryDemo />
        </section>

        {/* Retry Pattern Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">🔄</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Retry Pattern
              </h2>
              <p className="text-gray-600">
                Tự động thử lại operations thất bại với các chiến lược backoff khác nhau
              </p>
            </div>
          </div>

          <CodeExample
            title="Retry Hook với Exponential Backoff"
            code={retryPatternCode}
            explanation="Retry Pattern giúp xử lý transient failures (lỗi tạm thời) bằng cách tự động thử lại operation với delay tăng dần (exponential backoff) và thêm random jitter để tránh thundering herd problem."
          />

          <RetryPatternDemo />
        </section>

        {/* Circuit Breaker Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">⚡</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Circuit Breaker Pattern
              </h2>
              <p className="text-gray-600">
                Ngăn chặn cascade failures và cho phép failing services recover
              </p>
            </div>
          </div>

          <CodeExample
            title="Circuit Breaker Implementation"
            code={circuitBreakerCode}
            explanation="Circuit Breaker pattern ngăn chặn ứng dụng liên tục thử gọi service đang fail. Nó có 3 states: CLOSED (bình thường), OPEN (chặn calls), HALF_OPEN (test recovery)."
          />

          <CircuitBreakerDemo />
        </section>

        {/* Combining Patterns Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">🔧</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Kết hợp các Patterns
              </h2>
              <p className="text-gray-600">
                Cách kết hợp Error Boundary, Retry, và Circuit Breaker để tạo solution robust
              </p>
            </div>
          </div>

          <CodeExample
            title="Combining Error Handling Patterns"
            code={combiningPatternsCode}
            explanation="Trong production, bạn thường cần kết hợp nhiều patterns để tạo ra một solution toàn diện. Error Boundary bắt runtime errors, Retry xử lý transient failures, và Circuit Breaker ngăn cascade failures."
          />
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">📋</span>
              <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Error Boundary</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Đặt Error Boundary ở multiple levels trong component tree
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Log errors cho monitoring và debugging
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Cung cấp meaningful fallback UI
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Không bắt errors trong event handlers
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Retry & Circuit Breaker</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Chỉ retry cho transient errors (5xx, network issues)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Sử dụng exponential backoff với jitter
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Giới hạn số lần retry để tránh infinite loops
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Monitor circuit breaker metrics
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* When to Use */}
        <section>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border-l-4 border-red-500">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">🎯</span>
              <h2 className="text-3xl font-bold text-gray-900">Khi nào sử dụng?</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">Error Boundary</h3>
                <p className="text-red-700">
                  Sử dụng cho tất cả React applications để ngăn crashes và cung cấp better UX. 
                  Đặc biệt quan trọng cho production apps và khi integrate third-party components.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-orange-800 mb-2">Retry Pattern</h3>
                <p className="text-orange-700">
                  Ideal cho API calls, file uploads, và operations có thể fail temporarily. 
                  Không sử dụng cho user actions như form submissions để tránh duplicate data.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">Circuit Breaker</h3>
                <p className="text-yellow-700">
                  Essential cho microservices architecture và khi gọi external APIs. 
                  Giúp ngăn cascade failures và improve system resilience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 