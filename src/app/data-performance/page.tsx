'use client';

import Link from 'next/link';
import DemoGuide from '@/components/data-performance/DemoGuide';
import PostsList from '@/components/data-performance/PostsList';
import VirtualScrollDemo from '@/components/data-performance/VirtualScrollDemo';
import LearningSection from '@/components/data-performance/LearningSection';

export default function DataPerformanceDemo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back to Home Button */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Về Trang Chủ
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🚀 Data & Performance Patterns Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Khám phá và thực hành các patterns quan trọng về Data Fetching và Performance Optimization trong React & Next.js
          </p>
        </div>

        {/* Demo Guide */}
        <DemoGuide />

        {/* Demo Sections */}
        <div className="space-y-12">
          {/* SWR Demo */}
          <PostsList />
          
          {/* Virtual Scrolling Demo */}
          <VirtualScrollDemo />
          
          {/* Learning Section */}
          <LearningSection />
        </div>
      </div>
    </div>
  );
} 