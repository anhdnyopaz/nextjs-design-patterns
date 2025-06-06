'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useSWR } from '@/patterns/data-performance/hooks/useSWR';
import { fetchers, type ApiResponse, type Post } from '@/patterns/data-performance/services/api';

// Memoized Post Card component
const PostCard = React.memo(({ post, onLike }: { post: Post; onLike: (id: number) => void }) => {
  console.log(`Rendering PostCard ${post.id}`); // Debug log
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{post.title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          post.category === 'Technology' ? 'bg-blue-100 text-blue-800' :
          post.category === 'Design' ? 'bg-purple-100 text-purple-800' :
          post.category === 'Programming' ? 'bg-green-100 text-green-800' :
          post.category === 'Tutorial' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {post.category}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{post.body}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
        <div className="flex items-center space-x-4">
          <span>👁️ {post.views}</span>
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center space-x-1 hover:text-red-500 transition-colors"
          >
            <span>❤️</span>
            <span>{post.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

PostCard.displayName = 'PostCard';

export default function PostsList() {
  const [page, setPage] = useState(1);
  const limit = 6;
  
  // SWR for posts with caching
  const { data, error, isLoading, isValidating, mutate, revalidate } = useSWR<ApiResponse<Post[]>>(
    `posts-${page}-${limit}`,
    () => fetchers.posts(page, limit),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      dedupingInterval: 5000 // 5 seconds deduping
    }
  );

  // Memoized like handler
  const handleLike = useCallback(async (postId: number) => {
    if (!data) return;
    
    // Optimistic update
    const optimisticData = {
      ...data,
      data: data.data.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    };
    
    await mutate(optimisticData);
  }, [data, mutate]);

  // Memoized pagination info
  const paginationInfo = useMemo(() => {
    if (!data) return null;
    
    const totalPages = Math.ceil(data.total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return { totalPages, hasNext, hasPrev, total: data.total };
  }, [data, page, limit]);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => revalidate()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Posts với SWR</h2>
          <p className="text-gray-600">
            Caching, background updates, optimistic updates
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {isValidating && (
            <div className="flex items-center text-blue-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-sm">Đang cập nhật...</span>
            </div>
          )}
          <button
            onClick={() => revalidate()}
            disabled={isValidating}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-3"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-4"></div>
              <div className="flex space-x-2 mb-4">
                <div className="h-6 w-12 bg-gray-300 rounded"></div>
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
                <div className="h-3 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {data.data.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>

          {/* Pagination */}
          {paginationInfo && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Trang {page} / {paginationInfo.totalPages} (Tổng: {paginationInfo.total} posts)
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={!paginationInfo.hasPrev || isValidating}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!paginationInfo.hasNext || isValidating}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Tiếp
                </button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
} 