'use client';

import Link from 'next/link';
import { UserProvider } from '@/patterns/state-management/provider/UserProvider';
import DemoGuide from '@/components/state-management/DemoGuide';
import PopularLibraries from '@/components/state-management/PopularLibraries';
import UserList from '@/components/state-management/UserList';
import AddUserForm from '@/components/state-management/AddUserForm';
import CurrentUserDisplay from '@/components/state-management/CurrentUserDisplay';
import ObserverStats from '@/components/state-management/ObserverStats';
import LearningSection from '@/components/state-management/LearningSection';

// Main Demo Component
export default function StateManagementDemo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back to Home Button */}
      <div className="mb-8">
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

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎯 State Management Patterns Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Khám phá và thực hành các Design Patterns quan trọng trong React: Provider Pattern, Repository Pattern, và Observer Pattern
          </p>
        </div>

        {/* Demo Guide */}
        <DemoGuide />

        <UserProvider>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-8">
              <CurrentUserDisplay />
              <AddUserForm />
            </div>
            <div className="space-y-8">
              <UserList />
              <ObserverStats />
            </div>
          </div>
        </UserProvider>

        <LearningSection />
        <PopularLibraries />
      </div>
    </div>
  );
}

