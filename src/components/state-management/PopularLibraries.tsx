export default function PopularLibraries() {
  const libraries = [
    {
      category: "State Management (Provider Pattern)",
      icon: "🏗️",
      color: "from-blue-500 to-cyan-500",
      items: [
        { name: "Redux Toolkit", description: "Official Redux toolset với modern patterns", url: "https://redux-toolkit.js.org/" },
        { name: "Zustand", description: "Lightweight state management", url: "https://zustand-demo.pmnd.rs/" },
        { name: "Jotai", description: "Atomic state management", url: "https://jotai.org/" },
        { name: "Valtio", description: "Proxy-based state management", url: "https://valtio.pmnd.rs/" },
        { name: "React Query/TanStack Query", description: "Server state management", url: "https://tanstack.com/query" }
      ]
    },
    {
      category: "Data Fetching (Repository Pattern)",
      icon: "🗄️",
      color: "from-green-500 to-emerald-500",
      items: [
        { name: "Apollo Client", description: "GraphQL client với caching", url: "https://www.apollographql.com/docs/react/" },
        { name: "SWR", description: "Data fetching với caching", url: "https://swr.vercel.app/" },
        { name: "React Query", description: "Async state management", url: "https://tanstack.com/query" },
        { name: "Axios", description: "HTTP client với interceptors", url: "https://axios-http.com/" },
        { name: "tRPC", description: "End-to-end typesafe APIs", url: "https://trpc.io/" }
      ]
    },
    {
      category: "Event System (Observer Pattern)",
      icon: "👁️",
      color: "from-purple-500 to-pink-500",
      items: [
        { name: "EventEmitter3", description: "High performance event emitter", url: "https://github.com/primus/eventemitter3" },
        { name: "Mitt", description: "Tiny functional event emitter", url: "https://github.com/developit/mitt" },
        { name: "RxJS", description: "Reactive programming với Observables", url: "https://rxjs.dev/" },
        { name: "Immer", description: "Immutable state với mutation syntax", url: "https://immerjs.github.io/immer/" },
        { name: "MobX", description: "Reactive state management", url: "https://mobx.js.org/" }
      ]
    },
    {
      category: "Component Patterns",
      icon: "🧩",
      color: "from-orange-500 to-red-500",
      items: [
        { name: "Headless UI", description: "Unstyled accessible components", url: "https://headlessui.com/" },
        { name: "Radix UI", description: "Low-level UI primitives", url: "https://www.radix-ui.com/" },
        { name: "React Hook Form", description: "Forms với minimal re-renders", url: "https://react-hook-form.com/" },
        { name: "Formik", description: "Form library với validation", url: "https://formik.org/" },
        { name: "React Spring", description: "Animation library", url: "https://react-spring.dev/" }
      ]
    }
  ];

  return (
    <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
        <span className="mr-3">📚</span>
        Thư viện phổ biến áp dụng Design Patterns
      </h2>
      
      <div className="space-y-8">
        {libraries.map((category, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className={`bg-gradient-to-r ${category.color} p-6`}>
              <h3 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-3 text-3xl">{category.icon}</span>
                {category.category}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                    <div className="flex items-center mt-3 text-blue-500 text-sm">
                      <span>Tìm hiểu thêm</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-l-4 border-blue-500">
        <h3 className="text-xl font-bold text-gray-800 mb-3">💡 Gợi ý khi chọn thư viện</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">🎯 Cho dự án nhỏ:</h4>
            <ul className="space-y-1">
              <li>• Zustand cho state management</li>
              <li>• SWR cho data fetching</li>
              <li>• Mitt cho event system</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🏢 Cho dự án lớn:</h4>
            <ul className="space-y-1">
              <li>• Redux Toolkit + RTK Query</li>
              <li>• Apollo Client cho GraphQL</li>
              <li>• RxJS cho complex async flows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 