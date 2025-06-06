import { useState, useEffect, useCallback, useRef } from 'react';

// Types
export interface SWRConfig {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
  dedupingInterval?: number;
  errorRetryCount?: number;
  errorRetryInterval?: number;
}

export interface SWRResponse<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: (data?: T | Promise<T> | ((current: T | undefined) => T)) => Promise<T | undefined>;
  revalidate: () => Promise<T | undefined>;
}

// Simple cache implementation
const cache = new Map<string, any>();
const timestamps = new Map<string, number>();

// Fetcher function type
type Fetcher<T> = (...args: any[]) => Promise<T>;

// Custom SWR hook implementation
export function useSWR<T>(
  key: string | null,
  fetcher: Fetcher<T>,
  config: SWRConfig = {}
): SWRResponse<T> {
  const {
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    refreshInterval,
    dedupingInterval = 2000,
    errorRetryCount = 3,
    errorRetryInterval = 5000
  } = config;

  const [data, setData] = useState<T | undefined>(() => cache.get(key || ''));
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(() => !cache.has(key || ''));
  const [isValidating, setIsValidating] = useState<boolean>(false);
  
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = useCallback(async (showLoading = true): Promise<T | undefined> => {
    if (!key || !fetcher) return;

    // Check deduping
    const now = Date.now();
    const lastFetch = timestamps.get(key);
    if (lastFetch && now - lastFetch < dedupingInterval) {
      return cache.get(key);
    }

    if (showLoading && !cache.has(key)) setIsLoading(true);
    setIsValidating(true);
    setError(undefined);

    try {
      timestamps.set(key, now);
            const result = await fetcher(key);
       
      cache.set(key, result);
      setData(result);
      setError(undefined);
      retryCountRef.current = 0;
      
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      // Retry logic
      if (retryCountRef.current < errorRetryCount) {
        retryCountRef.current++;
        timeoutRef.current = setTimeout(() => {
          fetchData(false);
        }, errorRetryInterval);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [key, fetcher, dedupingInterval, errorRetryCount, errorRetryInterval]);

  // Mutate function
  const mutate = useCallback(async (
    data?: T | Promise<T> | ((current: T | undefined) => T)
  ): Promise<T | undefined> => {
    if (!key) return;

    let newData: T;
    
    if (typeof data === 'function') {
      newData = (data as (current: T | undefined) => T)(cache.get(key));
    } else if (data instanceof Promise) {
      newData = await data;
    } else if (data !== undefined) {
      newData = data;
    } else {
      return fetchData(false);
    }

    cache.set(key, newData);
    setData(newData);
    return newData;
  }, [key, fetchData]);

  // Revalidate function
  const revalidate = useCallback(() => fetchData(false), [fetchData]);

  // Initial fetch
  useEffect(() => {
    if (key && !cache.has(key)) {
      fetchData();
    }
  }, [key, fetchData]);

  // Refresh interval
  useEffect(() => {
    if (refreshInterval && key) {
      intervalRef.current = setInterval(() => {
        fetchData(false);
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refreshInterval, key, fetchData]);

  // Focus revalidation
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => fetchData(false);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, fetchData]);

  // Reconnect revalidation
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleOnline = () => fetchData(false);
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [revalidateOnReconnect, fetchData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    revalidate
  };
}

// Global cache utilities
export const swrCache = {
  get: (key: string) => cache.get(key),
  set: (key: string, value: any) => cache.set(key, value),
  delete: (key: string) => cache.delete(key),
  clear: () => cache.clear(),
  keys: () => Array.from(cache.keys()),
  size: () => cache.size
}; 