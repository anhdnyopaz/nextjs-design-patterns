'use client';

import Link from 'next/link';
import DemoGuide from '@/components/component-patterns/DemoGuide';
import CompoundComponentsDemo from '@/components/component-patterns/CompoundComponentsDemo';
import RenderPropsDemo from '@/components/component-patterns/RenderPropsDemo';

export default function ComponentPatternsDemo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back to Home Button */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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
            🧩 Component Patterns Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Khám phá và thực hành các Component Design Patterns phổ biến trong React: Compound Components, Render Props, Higher-Order Components
          </p>
        </div>

        {/* Demo Guide */}
        <DemoGuide />

        {/* Demo Sections */}
        <div className="space-y-12">
          {/* Compound Components Demo */}
          <CompoundComponentsDemo />
          
          {/* Render Props Demo */}
          <RenderPropsDemo />
        </div>
      </div>
    </div>
  );
} 