'use client';

import React, { useState, useCallback } from 'react';

// Basic Retry Hook
function useRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoffMultiplier: number = 1
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let currentRetry = 0;

    const attemptFn = async (): Promise<T> => {
      try {
        const result = await fn();
        setData(result);
        setRetryCount(currentRetry);
        return result;
      } catch (err) {
        currentRetry++;
        setRetryCount(currentRetry);

        if (currentRetry >= maxRetries) {
          throw err;
        }

        // Calculate delay with backoff
        const currentDelay = delay * Math.pow(backoffMultiplier, currentRetry - 1);
        console.log(`Retry ${currentRetry}/${maxRetries} sau ${currentDelay}ms...`);

        await new Promise(resolve => setTimeout(resolve, currentDelay));
        return attemptFn();
      }
    };

    try {
      await attemptFn();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [fn, maxRetries, delay, backoffMultiplier]);

  const reset = () => {
    setError(null);
    setData(null);
    setRetryCount(0);
    setIsLoading(false);
  };

  return {
    execute,
    reset,
    isLoading,
    error,
    data,
    retryCount,
  };
}

// Mock API functions for demo
const createMockAPI = (failureRate: number, responseTime: number = 1000) => {
  return () => new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failureRate) {
        reject(new Error(`API call failed (${Math.round(failureRate * 100)}% failure rate)`));
      } else {
        resolve(`API call thành công sau ${responseTime}ms!`);
      }
    }, responseTime);
  });
};

// Exponential Backoff Demo
function ExponentialBackoffDemo() {
  const [failureRate, setFailureRate] = useState(0.7);
  const mockAPI = useCallback(() => createMockAPI(failureRate, 500)(), [failureRate]);
  
  const { execute, reset, isLoading, error, data, retryCount } = useRetry(
    mockAPI,
    4, // max retries
    500, // initial delay
    2 // backoff multiplier (exponential)
  );

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">1. Exponential Backoff (Lùi lại theo cấp số nhân)</h3>
      <p className="text-gray-600 mb-4">
        Delay tăng theo cấp số nhân: 500ms → 1s → 2s → 4s
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tỷ lệ thất bại API: {Math.round(failureRate * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={failureRate}
          onChange={(e) => setFailureRate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={execute}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Đang thử...' : 'Gọi API'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700">
              🔄 Đang thực hiện... (Lần thử: {retryCount + 1})
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">
              ❌ Thất bại sau {retryCount} lần thử: {error.message}
            </p>
          </div>
        )}

        {data && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700">
              ✅ {data} (Đã thử {retryCount} lần)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Linear Backoff Demo  
function LinearBackoffDemo() {
  const [failureRate, setFailureRate] = useState(0.6);
  const mockAPI = useCallback(() => createMockAPI(failureRate, 300)(), [failureRate]);
  
  const { execute, reset, isLoading, error, data, retryCount } = useRetry(
    mockAPI,
    3, // max retries
    1000, // delay
    1 // linear multiplier
  );

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">2. Linear Backoff (Lùi lại tuyến tính)</h3>
      <p className="text-gray-600 mb-4">
        Delay cố định: 1s → 1s → 1s
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tỷ lệ thất bại API: {Math.round(failureRate * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={failureRate}
          onChange={(e) => setFailureRate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={execute}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Đang thử...' : 'Gọi API'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
            <p className="text-purple-700">
              🔄 Đang thực hiện... (Lần thử: {retryCount + 1})
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">
              ❌ Thất bại sau {retryCount} lần thử: {error.message}
            </p>
          </div>
        )}

        {data && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700">
              ✅ {data} (Đã thử {retryCount} lần)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Advanced Retry with Jitter
function JitterRetryDemo() {
  const [failureRate, setFailureRate] = useState(0.8);
  
  const retryWithJitter = useCallback(async () => {
    const maxRetries = 3;
    let currentRetry = 0;
    
    const attemptFn = async (): Promise<string> => {
      try {
        const result = await createMockAPI(failureRate, 200)();
        return result;
      } catch (err) {
        currentRetry++;
        
        if (currentRetry >= maxRetries) {
          throw new Error(`Thất bại sau ${currentRetry} lần thử: ${(err as Error).message}`);
        }

        // Exponential backoff with jitter
        const baseDelay = 500 * Math.pow(2, currentRetry - 1);
        const jitter = Math.random() * 200; // Random jitter 0-200ms
        const delay = baseDelay + jitter;
        
        console.log(`Retry ${currentRetry}/${maxRetries} với jitter: ${Math.round(delay)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return attemptFn();
      }
    };

    return attemptFn();
  }, [failureRate]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleExecute = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await retryWithJitter();
      setResult(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">3. Exponential Backoff với Jitter</h3>
      <p className="text-gray-600 mb-4">
        Thêm random jitter để tránh thundering herd problem
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tỷ lệ thất bại API: {Math.round(failureRate * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={failureRate}
          onChange={(e) => setFailureRate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleExecute}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Đang thử...' : 'Gọi API với Jitter'}
        </button>
        <button
          onClick={() => {
            setResult(null);
            setError(null);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700">
              🔄 Đang thực hiện với random delay...
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">
              ❌ {error.message}
            </p>
          </div>
        )}

        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700">
              ✅ {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Demo Component
export default function RetryPatternDemo() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
          <span className="text-2xl">🔄</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Retry Pattern Demo</h2>
          <p className="text-gray-600">Demo tương tác các chiến lược retry khác nhau</p>
        </div>
      </div>

      <div className="space-y-8">
        <ExponentialBackoffDemo />
        <LinearBackoffDemo />
        <JitterRetryDemo />

        {/* Best Practices */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-l-4 border-orange-500">
          <h4 className="font-semibold text-orange-800 mb-2">🎯 Best Practices cho Retry Pattern:</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Sử dụng Exponential Backoff để tránh quá tải server</li>
            <li>• Thêm Jitter để tránh thundering herd problem</li>
            <li>• Giới hạn số lần retry để tránh infinite loops</li>
            <li>• Chỉ retry cho lỗi transient (tạm thời), không retry lỗi 4xx</li>
            <li>• Log chi tiết để debugging và monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 