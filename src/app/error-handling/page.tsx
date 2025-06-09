import ErrorHandlingPageClient from '@/components/error-handling/ErrorHandlingPageClient';

export default function ErrorHandlingPage() {
  return <ErrorHandlingPageClient />;
}

// Metadata cho trang
export const metadata = {
  title: 'Error Handling Patterns | React Design Patterns',
  description: 'Học các pattern xử lý lỗi quan trọng trong React: Error Boundary, Retry Pattern, và Circuit Breaker với demos tương tác.',
  keywords: 'React, Error Handling, Error Boundary, Retry Pattern, Circuit Breaker, TypeScript, Design Patterns',
  openGraph: {
    title: 'Error Handling Patterns - React Design Patterns',
    description: 'Tìm hiểu cách xây dựng ứng dụng React robust với Error Boundary, Retry Pattern, và Circuit Breaker',
    type: 'website',
  },
}; 