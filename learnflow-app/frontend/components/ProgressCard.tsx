import { getMasteryCategory, getMasteryColor, getMasteryTextColor } from '@/stores/progressStore';

interface ProgressCardProps {
  title: string;
  value: number;
  type: 'percentage' | 'streak' | 'count';
}

export default function ProgressCard({ title, value, type }: ProgressCardProps) {
  const masteryCategory = type === 'percentage' ? getMasteryCategory(value) : null;
  const bgColor = masteryCategory ? getMasteryColor(value) : 'bg-blue-500';
  const textColor = masteryCategory ? getMasteryTextColor(value) : 'text-blue-600';

  // Calculate circumference for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = type === 'percentage'
    ? circumference - (value / 100) * circumference
    : circumference;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center">
        {/* Circular Progress */}
        <div className="relative mr-4 flex h-20 w-20 flex-shrink-0 items-center justify-center">
          <svg className="h-full w-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            {type === 'percentage' && (
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`${bgColor.replace('bg-', 'text-')} transition-all duration-500 ease-out`}
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="absolute flex flex-col items-center">
            {type === 'streak' ? (
              <span className="text-2xl font-bold text-orange-500">ST</span>
            ) : (
              <span className={`text-lg font-bold ${textColor}`}>
                {type === 'percentage' ? `${Math.round(value)}%` : value}
              </span>
            )}
          </div>
        </div>

        {/* Title and Value */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-1">
            {type === 'percentage' && masteryCategory && (
              <span className={`text-sm font-semibold ${textColor} capitalize`}>
                {masteryCategory}
              </span>
            )}
            {type === 'streak' && (
              <span className="text-2xl font-bold text-gray-900">{value}</span>
            )}
            {type === 'count' && (
              <span className="text-2xl font-bold text-gray-900">{value}</span>
            )}
          </div>
          {type === 'streak' && (
            <p className="mt-1 text-sm text-gray-500">days in a row!</p>
          )}
        </div>
      </div>
    </div>
  );
}
