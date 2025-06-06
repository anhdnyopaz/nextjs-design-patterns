import PatternCard from './PatternCard';

export default function PatternGrid() {
  const patterns = [
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
      icon: "🎨",
      title: "UI/UX Patterns",
      description: "Theme Provider, Portal Pattern, Responsive Design",
      gradientColors: "from-teal-500 to-cyan-600",
      isComingSoon: true,
      tags: []
    },
    {
      icon: "🛡️",
      title: "Error Handling",
      description: "Error Boundary, Retry Pattern, Circuit Breaker",
      gradientColors: "from-red-500 to-pink-600",
      isComingSoon: true,
      tags: []
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