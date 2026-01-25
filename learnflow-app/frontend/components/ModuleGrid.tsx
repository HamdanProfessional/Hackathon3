import ModuleCard from './ModuleCard';
import type { ModuleProgress } from '@/types';

interface ModuleGridProps {
  modules: ModuleProgress[];
}

// Default modules to show if no data is available
const defaultModules: ModuleProgress[] = [
  {
    moduleId: 'python-basics',
    moduleName: 'Python Basics',
    mastery: 75,
    completed: false,
    inProgress: true,
    exercisesCompleted: 6,
    totalExercises: 8,
  },
  {
    moduleId: 'data-types',
    moduleName: 'Data Types & Variables',
    mastery: 100,
    completed: true,
    inProgress: false,
    exercisesCompleted: 5,
    totalExercises: 5,
  },
  {
    moduleId: 'control-flow',
    moduleName: 'Control Flow',
    mastery: 40,
    completed: false,
    inProgress: true,
    exercisesCompleted: 2,
    totalExercises: 5,
  },
  {
    moduleId: 'functions',
    moduleName: 'Functions',
    mastery: 0,
    completed: false,
    inProgress: false,
    exercisesCompleted: 0,
    totalExercises: 6,
  },
  {
    moduleId: 'oop',
    moduleName: 'Object-Oriented Programming',
    mastery: 0,
    completed: false,
    inProgress: false,
    exercisesCompleted: 0,
    totalExercises: 8,
  },
  {
    moduleId: 'file-handling',
    moduleName: 'File Handling',
    mastery: 0,
    completed: false,
    inProgress: false,
    exercisesCompleted: 0,
    totalExercises: 4,
  },
];

export default function ModuleGrid({ modules = [] }: ModuleGridProps) {
  const displayModules = modules.length > 0 ? modules : defaultModules;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {displayModules.map((module) => (
        <ModuleCard key={module.moduleId} module={module} />
      ))}
    </div>
  );
}
