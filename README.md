# 🎯 Next.js Design Patterns

Một ứng dụng demo tương tác để học và thực hành các **Design Patterns** quan trọng trong React/Next.js. Dự án này cung cấp các ví dụ thực tế, code mẫu, và hướng dẫn chi tiết về cách áp dụng các pattern trong development.

## 🚀 Tính năng chính

### 📋 Design Patterns được hỗ trợ

#### 🏗️ **State Management Patterns**
- **Provider Pattern** - Context API và React Provider
- **Repository Pattern** - Data access layer abstraction  
- **Observer Pattern** - Event-driven architecture
- Demo tương tác với user management system
- Tích hợp các patterns với nhau

#### 🧩 **Component Patterns**  
- **Compound Components** - Flexible component composition
- **Render Props** - Logic sharing với function props
- **Higher-Order Components (HOC)** - Component enhancement
- **Custom Hooks** - Modern stateful logic reuse
- Live demos với code examples

#### ⚡ **Data & Performance Patterns**
- **SWR Pattern** - Stale-while-revalidate caching
- **Memoization** - React.memo, useMemo, useCallback
- **Virtual Scrolling** - Efficient large list rendering
- **Lazy Loading** - Code splitting và resource optimization

#### 📚 **Popular Libraries**
- Danh sách thư viện phổ biến áp dụng Design Patterns
- Redux Toolkit, Zustand, React Query, RxJS, và nhiều hơn nữa
- Hướng dẫn khi nào nên sử dụng thư viện nào

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Package Manager**: Bun
- **Linting**: ESLint với Next.js config
- **Development**: Hot reload, Fast refresh

## 📦 Cài đặt và Chạy

### Prerequisites
- Node.js 18+ hoặc Bun
- Git

### Quick Start

1. **Clone repository**
```bash
git clone <repository-url>
cd next_design_pattern
```

2. **Cài đặt dependencies**
```bash
bun install
# hoặc
npm install
```

3. **Chạy development server**
```bash
bun run dev
# hoặc
npm run dev
```

4. **Mở ứng dụng**
Truy cập [http://localhost:3001](http://localhost:3001) trong browser

### Các Scripts có sẵn

```bash
# Development
bun run dev          # Chạy dev server

# Production  
bun run build        # Build ứng dụng
bun run start        # Chạy production build

# Code Quality
bun run lint         # Chạy ESLint
```

## 📁 Cấu trúc Project

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Trang chủ
│   ├── state-management/        # State Management demo
│   ├── component-patterns/      # Component Patterns demo  
│   ├── data-performance/        # Data & Performance demo
│   └── popular-libraries/       # Popular Libraries page
├── components/                   # React Components
│   ├── state-management/        # State management components
│   ├── component-patterns/      # Component pattern examples
│   ├── data-performance/        # Performance optimization components
│   ├── Hero.tsx                 # Landing page hero
│   ├── PatternGrid.tsx          # Pattern navigation grid
│   └── ...
├── patterns/                     # Pattern implementations
│   └── state-management/        # Core pattern logic
│       ├── provider/            # Provider Pattern
│       ├── repository/          # Repository Pattern
│       └── observer/            # Observer Pattern
└── globals.css                  # Global styles
```

## 🎓 Cách sử dụng

### 1. Khám phá Patterns
- Bắt đầu từ trang chủ để xem tổng quan các patterns
- Click vào từng card để truy cập demo chi tiết
- Đọc code examples và giải thích

### 2. Thực hành với Demo
- **State Management**: Thử nghiệm user CRUD operations
- **Component Patterns**: Tương tác với live examples
- **Data & Performance**: Test performance optimizations

### 3. Học từ Code
- Mỗi pattern có code examples chi tiết
- Copy code để sử dụng trong dự án của bạn
- Hiểu best practices và use cases

### 4. Khám phá Thư viện
- Xem danh sách thư viện phổ biến
- Hiểu cách chúng áp dụng Design Patterns
- Chọn thư viện phù hợp cho dự án

## 🎯 Mục tiêu học tập

Sau khi hoàn thành dự án này, bạn sẽ:

- ✅ Hiểu các Design Patterns cơ bản trong React
- ✅ Biết cách implement patterns trong dự án thực tế  
- ✅ Tối ưu hóa performance ứng dụng React
- ✅ Chọn lựa thư viện phù hợp cho từng use case
- ✅ Viết code sạch, có thể maintain và scale

## 🔧 Development

### Code Style
- TypeScript strict mode
- ESLint với Next.js configuration
- Prettier formatting (recommend)

### Best Practices được áp dụng
- Component composition over inheritance
- Custom hooks for logic reuse
- Proper TypeScript typing
- Performance optimizations
- Accessibility considerations

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Để contribute:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-pattern`)
3. Commit changes (`git commit -m 'Add amazing pattern'`)
4. Push to branch (`git push origin feature/amazing-pattern`)
5. Tạo Pull Request

### Ideas for contributions
- Thêm patterns mới (Error Boundary, Portal, etc.)
- Cải thiện UI/UX
- Thêm tests
- Optimize performance
- Cập nhật documentation

## 📝 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 🙏 Acknowledgments

- **Next.js team** - Amazing React framework
- **React team** - Revolutionary UI library  
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety for JavaScript
- **Design Patterns community** - Inspiration và best practices

## 📞 Liên hệ

Nếu bạn có câu hỏi hoặc suggestion:

- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/next_design_pattern/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/your-username/next_design_pattern/discussions)
- 📧 **Email**: your-email@example.com

---

<div align="center">
  
**Made with ❤️ for the React community**

⭐ Star this repo if you find it helpful!

</div>
