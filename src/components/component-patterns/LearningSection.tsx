import CodeExample from '../state-management/CodeExample';

export default function LearningSection() {
  const compoundComponentCode = `// Compound Components Pattern
import React, { createContext, useContext } from 'react';

// Context để share state giữa các components
const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
} | null>(null);

// Main Tabs component
function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// TabList component
function TabList({ children }: { children: React.ReactNode }) {
  return (
    <div className="tab-list" role="tablist">
      {children}
    </div>
  );
}

// Tab component
function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={\`tab \${isActive ? 'active' : ''}\`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

// TabPanels component
function TabPanels({ children }: { children: React.ReactNode }) {
  return <div className="tab-panels">{children}</div>;
}

// TabPanel component
function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  
  const { activeTab } = context;
  if (activeTab !== value) return null;
  
  return (
    <div role="tabpanel" className="tab-panel">
      {children}
    </div>
  );
}

// Gắn các sub-components vào main component
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// Usage Example
function App() {
  return (
    <Tabs defaultTab="profile">
      <Tabs.List>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
      </Tabs.List>
      
      <Tabs.Panels>
        <Tabs.Panel value="profile">
          <h2>User Profile</h2>
          <p>Profile information here...</p>
        </Tabs.Panel>
        <Tabs.Panel value="settings">
          <h2>Settings</h2>
          <p>Settings options here...</p>
        </Tabs.Panel>
        <Tabs.Panel value="notifications">
          <h2>Notifications</h2>
          <p>Notification preferences here...</p>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}`;

  const renderPropsCode = `// Render Props Pattern
import React, { useState, useEffect } from 'react';

// Mouse Tracker với Render Props
interface MousePosition {
  x: number;
  y: number;
}

function MouseTracker({ 
  children 
}: { 
  children: (position: MousePosition) => React.ReactNode 
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return <>{children(position)}</>;
}

// Data Fetcher với Render Props
interface FetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: FetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [url]);
  
  return <>{children({ data, loading, error, refetch: fetchData })}</>;
}

// Toggle State với Render Props
function Toggle({ 
  defaultOn = false,
  children 
}: {
  defaultOn?: boolean;
  children: (state: { on: boolean; toggle: () => void }) => React.ReactNode;
}) {
  const [on, setOn] = useState(defaultOn);
  const toggle = () => setOn(prev => !prev);
  
  return <>{children({ on, toggle })}</>;
}

// Usage Examples
function App() {
  return (
    <div>
      {/* Mouse Tracker */}
      <MouseTracker>
        {({ x, y }) => (
          <div>Mouse position: {x}, {y}</div>
        )}
      </MouseTracker>
      
      {/* Data Fetcher */}
      <DataFetcher url="/api/users">
        {({ data, loading, error, refetch }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error: {error}</div>;
          
          return (
            <div>
              <button onClick={refetch}>Refresh</button>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          );
        }}
      </DataFetcher>
      
      {/* Toggle */}
      <Toggle>
        {({ on, toggle }) => (
          <div>
            <button onClick={toggle}>
              {on ? 'Turn Off' : 'Turn On'}
            </button>
            {on && <div>This is visible when toggle is on!</div>}
          </div>
        )}
      </Toggle>
    </div>
  );
}`;

  const hocCode = `// Higher-Order Components (HOC) Pattern
import React, { ComponentType, useEffect, useState } from 'react';

// withLoading HOC
function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function WithLoadingComponent(props: P & { isLoading?: boolean }) {
    const { isLoading, ...otherProps } = props;
    
    if (isLoading) {
      return (
        <div className="loading-spinner">
          <div>Loading...</div>
        </div>
      );
    }
    
    return <WrappedComponent {...(otherProps as P)} />;
  };
}

// withAuth HOC
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      // Check authentication status
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (token) {
            // Verify token with backend
            const response = await fetch('/api/verify-token', {
              headers: { Authorization: \`Bearer \${token}\` }
            });
            setIsAuthenticated(response.ok);
          }
        } catch (error) {
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };
      
      checkAuth();
    }, []);
    
    if (loading) {
      return <div>Checking authentication...</div>;
    }
    
    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
}

// withErrorBoundary HOC
function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return class WithErrorBoundary extends React.Component<
    P,
    { hasError: boolean; error?: Error }
  > {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Error caught by HOC:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return (
          <div className="error-boundary">
            <h2>Something went wrong!</h2>
            <p>{this.state.error?.message}</p>
            <button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </button>
          </div>
        );
      }
      
      return <WrappedComponent {...this.props} />;
    }
  };
}

// Composition of HOCs
function compose<P>(...hocs: Array<(component: ComponentType<any>) => ComponentType<any>>) {
  return (component: ComponentType<P>) =>
    hocs.reduceRight((acc, hoc) => hoc(acc), component);
}

// Usage Examples
function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Enhanced component với multiple HOCs
const EnhancedUserProfile = compose(
  withAuth,
  withLoading,
  withErrorBoundary
)(UserProfile);

// Usage
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  return (
    <EnhancedUserProfile 
      user={user} 
      isLoading={loading}
    />
  );
}`;

  const customHooksCode = `// Custom Hooks Pattern
import { useState, useEffect, useCallback, useRef } from 'react';

// useLocalStorage Hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue] as const;
}

// useDebounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// useIntersectionObserver Hook
function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    observer.observe(elementRef.current);
    
    return () => observer.disconnect();
  }, [elementRef, options]);
  
  return isIntersecting;
}

// useApi Hook
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
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
  }, [fetchData]);
  
  return { data, loading, error, refetch: fetchData };
}

// useToggle Hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse, setValue };
}

// usePrevious Hook
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

// Usage Examples
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [savedSearches, setSavedSearches] = useLocalStorage<string[]>('searches', []);
  
  const { data, loading, error } = useApi<SearchResult[]>(
    \`/api/search?q=\${debouncedSearchTerm}\`
  );
  
  const { value: isAdvancedMode, toggle: toggleAdvancedMode } = useToggle(false);
  
  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      
      <button onClick={toggleAdvancedMode}>
        {isAdvancedMode ? 'Simple' : 'Advanced'} Mode
      </button>
      
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}
      {data && (
        <div>
          {data.map(result => (
            <div key={result.id}>{result.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}`;

  return (
    <div className="mt-16 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        📚 Học tập Component Patterns
      </h2>
      
      <div className="prose max-w-none">
        <CodeExample
          title="1. 🧩 Compound Components Pattern"
          explanation="Compound Components cho phép tạo component linh hoạt bằng cách chia nhỏ thành các sub-components. Mỗi component con có trách nhiệm riêng nhưng chia sẻ state thông qua Context."
          code={compoundComponentCode}
        />

        <CodeExample
          title="2. 🔄 Render Props Pattern"
          explanation="Render Props cho phép chia sẻ logic giữa các components bằng cách truyền một function như prop. Function này nhận data và trả về JSX element."
          code={renderPropsCode}
        />

        <CodeExample
          title="3. 🎭 Higher-Order Components (HOC)"
          explanation="HOC là function nhận vào một component và trả về component mới với các tính năng bổ sung. Tốt cho cross-cutting concerns như authentication, logging, error handling."
          code={hocCode}
        />

        <CodeExample
          title="4. 🪝 Custom Hooks Pattern"
          explanation="Custom Hooks cho phép tái sử dụng stateful logic giữa các components. Đây là cách hiện đại và được khuyến khích thay thế cho HOC và Render Props."
          code={customHooksCode}
        />
      </div>

      <div className="mt-12 bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-2xl font-bold text-green-800 mb-4">🎯 Khi nào dùng pattern nào?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-2">🧩 Compound Components</h4>
            <ul className="text-sm text-green-600 space-y-1">
              <li>• UI components phức tạp (Tabs, Accordion)</li>
              <li>• Cần flexibility trong composition</li>
              <li>• API giống HTML elements</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-teal-700 mb-2">🔄 Render Props</h4>
            <ul className="text-sm text-teal-600 space-y-1">
              <li>• Chia sẻ logic với UI khác nhau</li>
              <li>• Runtime flexibility cao</li>
              <li>• Khi Custom Hooks không đủ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">🎭 HOC</h4>
            <ul className="text-sm text-emerald-600 space-y-1">
              <li>• Cross-cutting concerns (auth, logging)</li>
              <li>• Enhance existing components</li>
              <li>• Third-party integration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-700 mb-2">🪝 Custom Hooks</h4>
            <ul className="text-sm text-cyan-600 space-y-1">
              <li>• Stateful logic reuse (modern way)</li>
              <li>• Side effects management</li>
              <li>• Cleaner component code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 