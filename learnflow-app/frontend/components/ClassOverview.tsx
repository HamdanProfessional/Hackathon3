import { Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import StatCard from './StatCard';
import type { ClassOverview } from '@/types';

interface ClassOverviewProps {
  overview: ClassOverview;
}

export default function ClassOverviewComponent({ overview }: ClassOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={overview.totalStudents}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Today"
          value={overview.activeToday}
          icon={CheckCircle}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Struggling"
          value={overview.strugglingCount}
          icon={AlertCircle}
          color="red"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Avg Mastery"
          value={`${Math.round(overview.averageMastery)}%`}
          icon={TrendingUp}
          color="purple"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Top Performers */}
      {overview.topPerformers.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">Top Performers</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-elevated">
            <table className="min-w-full divide-y divide-border/50">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {overview.topPerformers.slice(0, 5).map((student, index) => (
                  <tr key={student.id} className="transition-colors hover:bg-muted/20">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          index === 0 ? 'gradient-nebula text-white' :
                          index === 1 ? 'icon-nebula-blue text-cosmic-blue' :
                          index === 2 ? 'icon-nebula-cyan text-cosmic-cyan' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground">{student.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {student.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        student.level === 'advanced' ? 'badge-success' :
                        student.level === 'intermediate' ? 'badge-warning' :
                        'badge-primary'
                      }`}>
                        {student.level || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
