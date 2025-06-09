import PatternCard from './PatternCard';

interface Pattern {
  href?: string;
  icon: string;
  title: string;
  description: string;
  gradientColors: string;
  tags: { label: string; color: string; }[];
  isComingSoon?: boolean;
}

export default function PatternGrid() {
  const patterns: Pattern[] = [
    {
      href: "/state-management",
      icon: "🏗️",
      title: "State Management",
      description: "Provider Pattern, Repository Pattern, Observer Pattern",
      gradientColors: "from-blue-500 to-purple-600",
      tags: [
        { label: "Context API", color: "bg-blue-100 text-blue-800" },
        { label: "Repository", color: "bg-green-100 text-green-800" },
        { label: "Observer", color: "bg-purple-100 text-purple-800" }
      ]
    },
    {
      href: "/component-patterns",
      icon: "🧩",
      title: "Component Patterns",
      description: "Compound Components, Render Props, HOC, Custom Hooks",
      gradientColors: "from-green-500 to-teal-600",
      tags: [
        { label: "Compound", color: "bg-green-100 text-green-800" },
        { label: "Render Props", color: "bg-teal-100 text-teal-800" },
        { label: "HOC", color: "bg-emerald-100 text-emerald-800" }
      ]
    },
    {
      href: "/data-performance",
      icon: "🚀",
      title: "Data & Performance",
      description: "SWR, Lazy Loading, Memoization, Virtual Scrolling",
      gradientColors: "from-orange-500 to-red-600",
      tags: [
        { label: "SWR", color: "bg-orange-100 text-orange-800" },
        { label: "Lazy Loading", color: "bg-red-100 text-red-800" },
        { label: "Memoization", color: "bg-pink-100 text-pink-800" }
      ]
    },
    {
      href: "/ui-ux-patterns",
      icon: "🎨",
      title: "UI/UX Patterns",
      description: "Theme Provider, Portal Pattern, Responsive Design",
      gradientColors: "from-teal-500 to-cyan-600",
      tags: [
        { label: "Theme Provider", color: "bg-purple-100 text-purple-800" },
        { label: "Portal", color: "bg-blue-100 text-blue-800" },
        { label: "Responsive", color: "bg-teal-100 text-teal-800" }
      ]
    },
    {
      href: "/error-handling",
      icon: "🛡️",
      title: "Error Handling",
      description: "Error Boundary, Retry Pattern, Circuit Breaker",
      gradientColors: "from-red-500 to-pink-600",
      tags: [
        { label: "Error Boundary", color: "bg-red-100 text-red-800" },
        { label: "Retry Pattern", color: "bg-orange-100 text-orange-800" },
        { label: "Circuit Breaker", color: "bg-yellow-100 text-yellow-800" }
      ]
    },
    {
      href: "/popular-libraries",
      icon: "📚",
      title: "Popular Libraries",
      description: "Khám phá thư viện áp dụng Design Patterns",
      gradientColors: "from-purple-500 to-pink-600",
      tags: [
        { label: "Redux", color: "bg-purple-100 text-purple-800" },
        { label: "Zustand", color: "bg-pink-100 text-pink-800" },
        { label: "React Query", color: "bg-indigo-100 text-indigo-800" }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {patterns.map((pattern, index) => (
        <PatternCard
          key={index}
          href={pattern.href}
          icon={pattern.icon}
          title={pattern.title}
          description={pattern.description}
          tags={pattern.tags}
          isComingSoon={pattern.isComingSoon}
          gradientColors={pattern.gradientColors}
        />
      ))}
    </div>
  );
} 