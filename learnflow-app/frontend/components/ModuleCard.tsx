import Link from 'next/link';
import type { ModuleProgress } from '@/types';
import { getMasteryColor, getMasteryCategory } from '@/stores/progressStore';

interface ModuleCardProps {
  module: ModuleProgress;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const masteryCategory = getMasteryCategory(module.mastery);
  const masteryColor = getMasteryColor(module.mastery);

  const getStatusColor = () => {
    if (module.completed) return 'bg-green-100 text-green-700';
    if (module.inProgress) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusText = () => {
    if (module.completed) return 'Completed';
    if (module.inProgress) return 'In Progress';
    return 'Not Started';
  };

  return (
    <Link
      href={`/exercise?module=${module.moduleId}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{module.moduleName}</h3>
          <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Mastery Bar */}
      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-gray-600">Mastery</span>
          <span className={`font-medium capitalize ${masteryColor.replace('bg-', 'text-')}`}>
            {masteryCategory} ({module.mastery}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${masteryColor} transition-all duration-500`}
            style={{ width: `${module.mastery}%` }}
          />
        </div>
      </div>

      {/* Exercises */}
      <p className="text-sm text-gray-600">
        {module.exercisesCompleted} of {module.totalExercises} exercises completed
      </p>
    </Link>
  );
}
