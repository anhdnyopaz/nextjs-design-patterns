import Link from 'next/link';
import LearningSection from '@/components/ui-ux-patterns/LearningSection';

export const metadata = {
  title: 'UI/UX Design Patterns (Mẫu thiết kế UI/UX) - Next.js Design Patterns',
  description: 'Học về các mẫu thiết kế UI/UX bao gồm Theme Provider, Portal Pattern và Responsive Design trong React và Next.js',
};

export default function UIUXPatternsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại trang chủ
          </Link>
        </div>

        <LearningSection />
      </div>
    </main>
  );
} 