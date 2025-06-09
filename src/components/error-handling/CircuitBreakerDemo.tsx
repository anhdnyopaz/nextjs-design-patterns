'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

// Circuit Breaker States
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

// Circuit Breaker Configuration
interface CircuitBreakerConfig {
  failureThreshold: number; // Số lỗi tối đa trước khi mở circuit
  resetTimeout: number; // Thời gian chờ trước khi thử half-open (ms)
  successThreshold?: number; // Số success cần thiết để đóng circuit trong half-open
}

// Circuit Breaker Hook
function useCircuitBreaker<T>(
  fn: () => Promise<T>,
  config: CircuitBreakerConfig
) {
  const [state, setState] = useState<CircuitState>(CircuitState.CLOSED);
  const [failureCount, setFailureCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [lastFailureTime, setLastFailureTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { failureThreshold, resetTimeout, successThreshold = 1 } = config;

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Check if circuit should transition from OPEN to HALF_OPEN
    if (state === CircuitState.OPEN && lastFailureTime) {
      const timeSinceLastFailure = Date.now() - lastFailureTime;
      if (timeSinceLastFailure >= resetTimeout) {
        setState(CircuitState.HALF_OPEN);
        setSuccessCount(0);
      } else {
        setIsLoading(false);
        const error = new Error(`Circuit Breaker đang OPEN. Thử lại sau ${Math.ceil((resetTimeout - timeSinceLastFailure) / 1000)}s`);
        setError(error);
        throw error;
      }
    }

    // If circuit is OPEN and timeout hasn't elapsed
    if (state === CircuitState.OPEN) {
      setIsLoading(false);
      const error = new Error('Circuit Breaker đang OPEN. API call bị từ chối.');
      setError(error);
      throw error;
    }

    try {
      const result = await fn();
      setData(result);

      // Handle success based on current state
      if (state === CircuitState.HALF_OPEN) {
        const newSuccessCount = successCount + 1;
        setSuccessCount(newSuccessCount);
        
        if (newSuccessCount >= successThreshold) {
          setState(CircuitState.CLOSED);
          setFailureCount(0);
          setSuccessCount(0);
        }
      } else if (state === CircuitState.CLOSED) {
        // Reset failure count on success in CLOSED state
        if (failureCount > 0) {
          setFailureCount(0);
        }
      }

      return result;
    } catch (err) {
      const newFailureCount = failureCount + 1;
      setFailureCount(newFailureCount);
      setLastFailureTime(Date.now());
      setError(err as Error);

      // Transition to OPEN if failure threshold reached
      if (newFailureCount >= failureThreshold) {
        setState(CircuitState.OPEN);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fn, state, failureCount, successCount, lastFailureTime, failureThreshold, resetTimeout, successThreshold]);

  const reset = () => {
    setState(CircuitState.CLOSED);
    setFailureCount(0);
    setSuccessCount(0);
    setLastFailureTime(null);
    setError(null);
    setData(null);
    setIsLoading(false);
  };

  return {
    execute,
    reset,
    state,
    failureCount,
    successCount,
    isLoading,
    data,
    error,
    config
  };
}

// Mock API for demo
const createMockAPI = (failureRate: number, responseTime: number = 500) => {
  return () => new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failureRate) {
        reject(new Error(`API Server Error (${Math.round(failureRate * 100)}% failure rate)`));
      } else {
        resolve(`✅ API call thành công!`);
      }
    }, responseTime);
  });
};

// Circuit State Indicator Component
function CircuitStateIndicator({ state, config, failureCount, successCount }: {
  state: CircuitState;
  config: CircuitBreakerConfig;
  failureCount: number;
  successCount: number;
}) {
  const stateColors = {
    [CircuitState.CLOSED]: 'bg-green-100 text-green-800 border-green-200',
    [CircuitState.OPEN]: 'bg-red-100 text-red-800 border-red-200',
    [CircuitState.HALF_OPEN]: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const stateIcons = {
    [CircuitState.CLOSED]: '✅',
    [CircuitState.OPEN]: '🚫',
    [CircuitState.HALF_OPEN]: '⚠️'
  };

  const stateDescriptions = {
    [CircuitState.CLOSED]: 'Tất cả requests được phép đi qua',
    [CircuitState.OPEN]: 'Tất cả requests bị từ chối',
    [CircuitState.HALF_OPEN]: 'Đang test - một số requests được phép'
  };

  return (
    <div className={`p-4 rounded-lg border ${stateColors[state]}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{stateIcons[state]}</span>
        <div>
          <h3 className="font-semibold text-lg">Circuit: {state}</h3>
          <p className="text-sm">{stateDescriptions[state]}</p>
        </div>
      </div>
      
      <div className="mt-3 text-sm space-y-1">
        <div>Failures: {failureCount}/{config.failureThreshold}</div>
        {state === CircuitState.HALF_OPEN && (
          <div>Successes trong Half-Open: {successCount}/{config.successThreshold}</div>
        )}
        <div>Reset Timeout: {config.resetTimeout / 1000}s</div>
      </div>
    </div>
  );
}

// Auto Circuit Breaker Demo
function AutoCircuitBreakerDemo() {
  const [failureRate, setFailureRate] = useState(0.8);
  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const testCountRef = useRef(0);

  const mockAPI = useCallback(() => createMockAPI(failureRate, 300)(), [failureRate]);
  
  const circuitBreaker = useCircuitBreaker(mockAPI, {
    failureThreshold: 3,
    resetTimeout: 5000,
    successThreshold: 2
  });

  const startAutoTest = () => {
    setIsAutoTesting(true);
    testCountRef.current = 0;
    
    intervalRef.current = setInterval(async () => {
      testCountRef.current++;
      console.log(`Auto test #${testCountRef.current}`);
      
      try {
        await circuitBreaker.execute();
      } catch (err) {
        // Ignore errors in auto test
      }

      // Stop after 20 tests
      if (testCountRef.current >= 20) {
        stopAutoTest();
      }
    }, 1000);
  };

  const stopAutoTest = () => {
    setIsAutoTesting(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">2. Auto Circuit Breaker Testing</h3>
      <p className="text-gray-600 mb-4">
        Tự động test Circuit Breaker để quan sát chuyển đổi trạng thái
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
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
            disabled={isAutoTesting}
          />
        </div>

        <CircuitStateIndicator 
          state={circuitBreaker.state}
          config={circuitBreaker.config}
          failureCount={circuitBreaker.failureCount}
          successCount={circuitBreaker.successCount}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={isAutoTesting ? stopAutoTest : startAutoTest}
          className={`px-4 py-2 text-white rounded transition-colors ${
            isAutoTesting 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isAutoTesting ? 'Dừng Auto Test' : 'Bắt đầu Auto Test'}
        </button>
        
        <button
          onClick={circuitBreaker.reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          disabled={isAutoTesting}
        >
          Reset Circuit
        </button>
      </div>

      <div className="space-y-3">
        {circuitBreaker.isLoading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700">🔄 Đang thực hiện API call...</p>
          </div>
        )}

        {circuitBreaker.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">❌ {circuitBreaker.error.message}</p>
          </div>
        )}

        {circuitBreaker.data && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700">{circuitBreaker.data}</p>
          </div>
        )}

        {isAutoTesting && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700">
              🤖 Auto testing đang chạy... (Test #{testCountRef.current}/20)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Manual Circuit Breaker Demo
function ManualCircuitBreakerDemo() {
  const [failureRate, setFailureRate] = useState(0.7);
  const mockAPI = useCallback(() => createMockAPI(failureRate)(), [failureRate]);
  
  const circuitBreaker = useCircuitBreaker(mockAPI, {
    failureThreshold: 2,
    resetTimeout: 3000,
    successThreshold: 1
  });

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">1. Manual Circuit Breaker</h3>
      <p className="text-gray-600 mb-4">
        Thực hiện manual test để hiểu cách Circuit Breaker hoạt động
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
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

        <CircuitStateIndicator 
          state={circuitBreaker.state}
          config={circuitBreaker.config}
          failureCount={circuitBreaker.failureCount}
          successCount={circuitBreaker.successCount}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={circuitBreaker.execute}
          disabled={circuitBreaker.isLoading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {circuitBreaker.isLoading ? 'Đang gọi...' : 'Gọi API'}
        </button>
        
        <button
          onClick={circuitBreaker.reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset Circuit
        </button>
      </div>

      <div className="space-y-3">
        {circuitBreaker.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">❌ {circuitBreaker.error.message}</p>
          </div>
        )}

        {circuitBreaker.data && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700">{circuitBreaker.data}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Demo Component
export default function CircuitBreakerDemo() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
          <span className="text-2xl">⚡</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Circuit Breaker Demo</h2>
          <p className="text-gray-600">Demo tương tác của Circuit Breaker pattern</p>
        </div>
      </div>

      <div className="space-y-8">
        <ManualCircuitBreakerDemo />
        <AutoCircuitBreakerDemo />

        {/* Circuit States Explanation */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <h4 className="font-semibold text-yellow-800 mb-3">🔄 Circuit Breaker States:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-green-700">✅ CLOSED</h5>
              <p className="text-green-600">
                Trạng thái bình thường. Tất cả requests được phép đi qua.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-red-700">🚫 OPEN</h5>
              <p className="text-red-600">
                Circuit mở. Tất cả requests bị từ chối ngay lập tức.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-yellow-700">⚠️ HALF-OPEN</h5>
              <p className="text-yellow-600">
                Đang test. Cho phép một số requests để kiểm tra service.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-l-4 border-orange-500">
          <h4 className="font-semibold text-orange-800 mb-2">🎯 Lợi ích của Circuit Breaker:</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Ngăn chặn cascade failures trong microservices</li>
            <li>• Giảm load trên failing services để chúng có thể recover</li>
            <li>• Cung cấp fast-fail thay vì chờ timeout</li>
            <li>• Tự động recovery khi service khỏe lại</li>
            <li>• Cải thiện user experience với fallback mechanisms</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 