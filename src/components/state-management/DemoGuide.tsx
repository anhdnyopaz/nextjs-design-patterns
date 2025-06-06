export default function DemoGuide() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg p-8 mb-12">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <span className="mr-3">🚀</span>
        Hướng dẫn sử dụng Demo
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">1️⃣</span>
            </div>
            <h3 className="text-xl font-semibold">Provider Pattern</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Đăng nhập/đăng xuất người dùng</li>
            <li>• Xem thông tin user hiện tại</li>
            <li>• State được chia sẻ toàn cục</li>
            <li>• Type-safe với TypeScript</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">2️⃣</span>
            </div>
            <h3 className="text-xl font-semibold">Repository Pattern</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Thêm người dùng mới</li>
            <li>• Tìm kiếm và xóa user</li>
            <li>• Mock data layer</li>
            <li>• Abstraction cho data access</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl">3️⃣</span>
            </div>
            <h3 className="text-xl font-semibold">Observer Pattern</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Theo dõi statistics real-time</li>
            <li>• Event tracking tự động</li>
            <li>• Multiple observers</li>
            <li>• Loose coupling design</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
        <p className="text-white/90 text-center">
          💡 <strong>Tip:</strong> Mở Developer Console để xem các events được log bởi Observer Pattern
        </p>
      </div>
    </div>
  );
} 