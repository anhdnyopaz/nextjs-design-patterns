export default function DemoGuide() {
  return (
    <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg p-8 mb-12">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <span className="mr-3">🧩</span>
        Hướng dẫn Component Patterns Demo
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold">Compound Components</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Tabs system linh hoạt</li>
            <li>• Modal components</li>
            <li>• Dropdown menus</li>
            <li>• Context-based sharing</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">🎭</span>
            </div>
            <h3 className="text-xl font-semibold">Render Props</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Mouse tracking</li>
            <li>• Toggle states</li>
            <li>• Data fetching</li>
            <li>• Window size detection</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">🏗️</span>
            </div>
            <h3 className="text-xl font-semibold">Higher-Order Components</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Loading states</li>
            <li>• Authentication</li>
            <li>• Error boundaries</li>
            <li>• Theme switching</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">🪝</span>
            </div>
            <h3 className="text-xl font-semibold">Custom Hooks</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• useToggle hook</li>
            <li>• useLocalStorage</li>
            <li>• useDebounce</li>
            <li>• useWindowSize</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
        <p className="text-white/90 text-center">
          💡 <strong>Tip:</strong> Mỗi pattern có ưu điểm riêng - Compound Components cho flexibility, Render Props cho reusability, HOCs cho cross-cutting concerns
        </p>
      </div>
    </div>
  );
} 