'use client';

import React, { useState, useEffect, useRef, ReactNode, useCallback } from 'react';

// Mouse Position Render Prop
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render?: (position: MousePosition) => ReactNode;
  children?: (position: MousePosition) => ReactNode;
}

export const MouseTracker = ({ render, children }: MouseTrackerProps) => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <>{(render || children)?.(position)}</>;
};

// Toggle Render Prop
interface ToggleState {
  isToggled: boolean;
  toggle: () => void;
  setToggle: (value: boolean) => void;
}

interface ToggleProps {
  defaultToggled?: boolean;
  render?: (state: ToggleState) => ReactNode;
  children?: (state: ToggleState) => ReactNode;
}

export const Toggle = ({ defaultToggled = false, render, children }: ToggleProps) => {
  const [isToggled, setIsToggled] = useState(defaultToggled);

  const toggle = () => setIsToggled(!isToggled);
  const setToggle = (value: boolean) => setIsToggled(value);

  const state: ToggleState = { isToggled, toggle, setToggle };

  return <>{(render || children)?.(state)}</>;
};

// Data Fetcher Render Prop
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface DataFetcherProps<T> {
  url: string;
  render?: (state: FetchState<T>) => ReactNode;
  children?: (state: FetchState<T>) => ReactNode;
}

export function DataFetcher<T>({ url, render, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [url, fetchData]);

  const state: FetchState<T> = {
    data,
    loading,
    error,
    refetch: fetchData
  };

  return <>{(render || children)?.(state)}</>;
}

// Form State Render Prop
interface FormField {
  value: string;
  error?: string;
}

interface FormState {
  fields: Record<string, FormField>;
  updateField: (name: string, value: string) => void;
  setFieldError: (name: string, error: string) => void;
  clearFieldError: (name: string) => void;
  validateField: (name: string, validator: (value: string) => string | undefined) => boolean;
  resetForm: () => void;
  isValid: boolean;
}

interface FormStateProps {
  initialValues?: Record<string, string>;
  render?: (state: FormState) => ReactNode;
  children?: (state: FormState) => ReactNode;
}

export const FormState = ({ initialValues = {}, render, children }: FormStateProps) => {
  const [fields, setFields] = useState<Record<string, FormField>>(() => {
    const initial: Record<string, FormField> = {};
    Object.entries(initialValues).forEach(([key, value]) => {
      initial[key] = { value };
    });
    return initial;
  });

  const updateField = (name: string, value: string) => {
    setFields(prev => ({
      ...prev,
      [name]: { ...prev[name], value, error: undefined }
    }));
  };

  const setFieldError = (name: string, error: string) => {
    setFields(prev => ({
      ...prev,
      [name]: { ...prev[name], error }
    }));
  };

  const clearFieldError = (name: string) => {
    setFields(prev => ({
      ...prev,
      [name]: { ...prev[name], error: undefined }
    }));
  };

  const validateField = (name: string, validator: (value: string) => string | undefined) => {
    const value = fields[name]?.value || '';
    const error = validator(value);
    
    if (error) {
      setFieldError(name, error);
      return false;
    } else {
      clearFieldError(name);
      return true;
    }
  };

  const resetForm = () => {
    const resetFields: Record<string, FormField> = {};
    Object.entries(initialValues).forEach(([key, value]) => {
      resetFields[key] = { value };
    });
    setFields(resetFields);
  };

  const isValid = Object.values(fields).every(field => !field.error);

  const state: FormState = {
    fields,
    updateField,
    setFieldError,
    clearFieldError,
    validateField,
    resetForm,
    isValid
  };

  return <>{(render || children)?.(state)}</>;
};

// Window Size Render Prop
interface WindowSize {
  width: number;
  height: number;
}

interface WindowSizeProps {
  render?: (size: WindowSize) => ReactNode;
  children?: (size: WindowSize) => ReactNode;
}

export const WindowSizeTracker = ({ render, children }: WindowSizeProps) => {
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <>{(render || children)?.(windowSize)}</>;
};

// Intersection Observer Render Prop
interface IntersectionState {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

interface IntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  render?: (state: IntersectionState) => ReactNode;
  children?: (state: IntersectionState, ref: React.RefObject<HTMLElement | null>) => ReactNode;
}

export const IntersectionObserver = ({ 
  threshold = 0.1, 
  rootMargin = '0px',
  render,
  children 
}: IntersectionObserverProps) => {
  const [intersectionState, setIntersectionState] = useState<IntersectionState>({
    isIntersecting: false,
    entry: null
  });
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIntersectionState({
          isIntersecting: entry.isIntersecting,
          entry
        });
      },
      { threshold, rootMargin }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [threshold, rootMargin]);

  if (render) {
    return <>{render(intersectionState)}</>;
  }

  return <>{children?.(intersectionState, targetRef)}</>;
};

// Local Storage Render Prop
interface LocalStorageState<T> {
  value: T | null;
  setValue: (value: T) => void;
  removeValue: () => void;
}

interface LocalStorageProps<T> {
  storageKey: string;
  defaultValue?: T;
  render?: (state: LocalStorageState<T>) => ReactNode;
  children?: (state: LocalStorageState<T>) => ReactNode;
}

export function LocalStorage<T>({ 
  storageKey, 
  defaultValue, 
  render, 
  children 
}: LocalStorageProps<T>) {
  const [value, setValue] = useState<T | null>(() => {
    if (typeof window === 'undefined') return defaultValue || null;
    
    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(storageKey, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const removeStoredValue = () => {
    try {
      setValue(null);
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  };

  const state: LocalStorageState<T> = {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue
  };

  return <>{(render || children)?.(state)}</>;
} 