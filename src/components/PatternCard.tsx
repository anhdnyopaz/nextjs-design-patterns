import Link from "next/link";

interface PatternCardProps {
  href?: string;
  icon: string;
  title: string;
  description: string;
  tags: Array<{
    label: string;
    color: string;
  }>;
  isComingSoon?: boolean;
  gradientColors: string;
}

export default function PatternCard({
  href,
  icon,
  title,
  description,
  tags,
  isComingSoon = false,
  gradientColors
}: PatternCardProps) {
  const cardContent = (
    <div className={`bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${isComingSoon ? 'opacity-60' : ''}`}>
      <div className={`w-16 h-16 bg-gradient-to-r ${gradientColors} rounded-full flex items-center justify-center mx-auto mb-6`}>
        <span className="text-3xl">{icon}</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h2>
      <p className="text-gray-600 text-center mb-6">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {isComingSoon ? (
          <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm">
            Coming Soon
          </span>
        ) : (
          tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 ${tag.color} rounded-full text-sm`}
            >
              {tag.label}
            </span>
          ))
        )}
      </div>
    </div>
  );

  if (href && !isComingSoon) {
    return (
      <Link href={href} className="group">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
} 