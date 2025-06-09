'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ErrorHandlingLearningSection from './LearningSection';

export default function ErrorHandlingPageClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải Error Handling Patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Về trang chủ
        </Link>
      </div>

      <ErrorHandlingLearningSection />
    </div>
  );
} 