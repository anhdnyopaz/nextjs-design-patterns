import CodeExample from '../state-management/CodeExample';

export default function LearningSection() {
  const swrCode = `// Custom SWR Hook Implementation
import { useState, useEffect, useCallback, useRef } from 'react';

interface SWRConfig {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
  dedupingInterval?: number;
  errorRetryCount?: number;
}

interface SWRResponse<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: (data?: T | Promise<T>) => Promise<T | undefined>;
  revalidate: () => Promise<T | undefined>;
}

const cache = new Map<string, any>();
const timestamps = new Map<string, number>();

export function useSWR<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  config: SWRConfig = {}
): SWRResponse<T> {
  const [data, setData] = useState<T | undefined>(() => cache.get(key || ''));
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(() => !cache.has(key || ''));
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const fetchData = useCallback(async (): Promise<T | undefined> => {
    if (!key || !fetcher) return;

    // Deduping logic
    const now = Date.now();
    const lastFetch = timestamps.get(key);
    if (lastFetch && now - lastFetch < (config.dedupingInterval || 2000)) {
      return cache.get(key);
    }

    setIsValidating(true);
    setError(undefined);

    try {
      timestamps.set(key, now);
      const result = await fetcher();
      
      cache.set(key, result);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      // Retry logic
      if (config.errorRetryCount) {
        setTimeout(() => fetchData(), config.errorRetryInterval || 5000);
      }
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [key, fetcher, config]);

  // Optimistic updates
  const mutate = useCallback(async (
    data?: T | Promise<T>
  ): Promise<T | undefined> => {
    if (!key) return;

    if (data) {
      const newData = await data;
      cache.set(key, newData);
      setData(newData);
      return newData;
    } else {
      return fetchData();
    }
  }, [key, fetchData]);

  return { data, error, isLoading, isValidating, mutate, revalidate: fetchData };
}`;

  const memoizationCode = `// Performance Optimization với React.memo và useMemo
import React, { useState, useMemo, useCallback } from 'react';

// Memoized Component với React.memo
const PostCard = React.memo(({ 
  post, 
  onLike 
}: { 
  post: Post; 
  onLike: (id: number) => void;
}) => {
  console.log('PostCard render:', post.id); // Chỉ log khi thực sự re-render
  
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <button onClick={() => onLike(post.id)}>
        ❤️ {post.likes}
      </button>
    </div>
  );
});

// Component sử dụng useMemo và useCallback
function PostsList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState('');
  
  // useMemo cho expensive calculations
  const filteredPosts = useMemo(() => {
    console.log('Filtering posts...'); // Chỉ chạy khi posts hoặc filter thay đổi
    return posts.filter(post =>
      post.title.toLowerCase().includes(filter.toLowerCase()) ||
      post.body.toLowerCase().includes(filter.toLowerCase())
    );
  }, [posts, filter]);
  
  // useCallback cho event handlers
  const handleLike = useCallback((postId: number) => {
    console.log('Like post:', postId);
    // Optimistic update logic here
  }, []);
  
  // useMemo cho pagination data
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(filteredPosts.length / 10);
    return { totalPages, hasNext: page < totalPages };
  }, [filteredPosts.length, page]);
  
  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search posts..."
      />
      {filteredPosts.map(post => (
        <PostCard key={post.id} post={post} onLike={handleLike} />
      ))}
    </div>
  );
}`;

  const virtualScrollingCode = `// Virtual Scrolling Implementation
import React, { useState, useMemo, useCallback } from 'react';

interface VirtualListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
}

function useVirtualList({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const { startIndex, endIndex, totalHeight } = useMemo(() => {
    const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIdx = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return {
      startIndex: startIdx,
      endIndex: endIdx,
      totalHeight: items.length * itemHeight
    };
  }, [items.length, itemHeight, scrollTop, containerHeight, overscan]);
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, startIndex, endIndex]);
  
  return {
    visibleItems,
    totalHeight,
    offsetY: startIndex * itemHeight,
    setScrollTop
  };
}

// Virtual List Component
function VirtualList({ items, itemHeight, containerHeight, renderItem }: VirtualListProps) {
  const { visibleItems, totalHeight, offsetY, setScrollTop } = useVirtualList({
    items,
    itemHeight,
    containerHeight
  });
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, [setScrollTop]);
  
  return (
    <div
      onScroll={handleScroll}
      style={{ height: containerHeight, overflow: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;

  const lazyLoadingCode = `// Lazy Loading Patterns
import React, { lazy, Suspense } from 'react';

// 1. Component Lazy Loading
const LazyComponent = lazy(() => import('./ExpensiveComponent'));

// 2. Image Lazy Loading với Intersection Observer
function LazyImage({ src, alt, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef} {...props}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}

// 3. Route-based Code Splitting
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<Loading />}>
              <LazyComponent />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

// 4. Dynamic Import với Loading States
function DynamicFeature() {
  const [component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);
  
  const loadComponent = async () => {
    setLoading(true);
    try {
      const { default: Component } = await import('./HeavyFeature');
      setComponent(() => Component);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {!component && (
        <button onClick={loadComponent} disabled={loading}>
          {loading ? 'Loading...' : 'Load Feature'}
        </button>
      )}
      {component && React.createElement(component)}
    </div>
  );
}`;

  return (
    <div className="mt-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        📚 Học tập Data & Performance Patterns
      </h2>
      
      <div className="prose max-w-none">
        <CodeExample
          title="1. 📡 SWR Pattern"
          explanation="SWR (Stale-While-Revalidate) pattern cho phép hiển thị dữ liệu cached ngay lập tức và fetch dữ liệu mới trong background. Bao gồm caching, deduping, revalidation, và optimistic updates."
          code={swrCode}
        />

        <CodeExample
          title="2. 🧠 Memoization Patterns"
          explanation="Tối ưu hóa performance với React.memo, useMemo, và useCallback. Tránh re-render không cần thiết và cache expensive calculations."
          code={memoizationCode}
        />

        <CodeExample
          title="3. 📋 Virtual Scrolling"
          explanation="Virtual Scrolling cho phép render danh sách lớn một cách hiệu quả bằng cách chỉ render các items hiển thị trong viewport. Sử dụng Intersection Observer và position calculations."
          code={virtualScrollingCode}
        />

        <CodeExample
          title="4. ⚡ Lazy Loading Patterns"
          explanation="Lazy Loading giúp giảm initial bundle size và tăng performance bằng cách chỉ load code/content khi cần. Bao gồm component lazy loading, image lazy loading, và code splitting."
          code={lazyLoadingCode}
        />
      </div>

      <div className="mt-12 bg-orange-50 rounded-lg p-6 border border-orange-200">
        <h3 className="text-2xl font-bold text-orange-800 mb-4">🎯 Performance Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-orange-700 mb-2">📡 Data Fetching</h4>
            <ul className="text-sm text-orange-600 space-y-1">
              <li>• Implement caching strategies</li>
              <li>• Use optimistic updates</li>
              <li>• Handle loading và error states</li>
              <li>• Debounce search requests</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-700 mb-2">⚡ Rendering Performance</h4>
            <ul className="text-sm text-red-600 space-y-1">
              <li>• Memoize expensive calculations</li>
              <li>• Avoid unnecessary re-renders</li>
              <li>• Use React.memo cho pure components</li>
              <li>• Implement virtual scrolling for large lists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 