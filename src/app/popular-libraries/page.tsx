'use client';

import Link from 'next/link';
import PopularLibraries from '@/components/state-management/PopularLibraries';

export default function PopularLibrariesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Back to Home Button */}
      <div className="p-8 pb-0">
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Về Trang Chủ
        </Link>
      </div>

      <div className="container mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📚 Thư viện phổ biến
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Khám phá các thư viện React phổ biến áp dụng Design Patterns. 
            Từ state management đến data fetching, từ event systems đến component patterns.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] rounded-full">
              <div className="bg-white rounded-full px-8 py-3">
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Cẩm nang cho Developer
                </span>
              </div>
            </div>
          </div>
        </div>

        <PopularLibraries />

        {/* Additional Navigation */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">🚀 Khám phá thêm</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/state-management"
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  State Management Demo
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Thực hành với Provider, Repository và Observer patterns
                </p>
              </Link>
              
              <Link 
                href="/component-patterns"
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="text-3xl mb-3">🧩</div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Component Patterns
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Tìm hiểu các pattern để xây dựng component hiệu quả
                </p>
              </Link>
              
              <Link 
                href="/data-performance"
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Data & Performance
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Tối ưu hóa performance và xử lý data
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 