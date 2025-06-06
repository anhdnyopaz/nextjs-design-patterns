export default function DemoGuide() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-lg p-8 mb-12">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <span className="mr-3">🚀</span>
        Hướng dẫn Data & Performance Demo
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">📡</span>
            </div>
            <h3 className="text-xl font-semibold">SWR Pattern</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Caching tự động</li>
            <li>• Revalidation on focus</li>
            <li>• Error retry logic</li>
            <li>• Background updates</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold">Lazy Loading</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Component lazy loading</li>
            <li>• Image lazy loading</li>
            <li>• Route-based splitting</li>
            <li>• Suspense fallbacks</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold">Memoization</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• React.memo() usage</li>
            <li>• useMemo optimization</li>
            <li>• useCallback caching</li>
            <li>• Render optimization</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold">Virtual Scrolling</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Large list rendering</li>
            <li>• Memory optimization</li>
            <li>• Smooth scrolling</li>
            <li>• Dynamic heights</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
        <p className="text-white/90 text-center">
          💡 <strong>Tip:</strong> Mở Network tab trong DevTools để xem caching behavior và performance improvements
        </p>
      </div>
    </div>
  );
} 