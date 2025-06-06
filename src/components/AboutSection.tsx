export default function AboutSection() {
  return (
    <div className="text-center mt-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Về dự án này
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Dự án này được tạo ra để minh họa các <strong>Design Patterns</strong> quan trọng 
          trong phát triển ứng dụng Next.js. Mỗi pattern được implement với ví dụ thực tế, 
          kèm theo giải thích chi tiết và best practices.
        </p>
        <div className="flex justify-center mt-6 space-x-4">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            Next.js 15
          </span>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
            TypeScript
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full">
            Tailwind CSS
          </span>
          <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full">
            Bun.js
          </span>
        </div>
      </div>
    </div>
  );
} 