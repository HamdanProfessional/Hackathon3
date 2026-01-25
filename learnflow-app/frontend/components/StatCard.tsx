import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-cosmic-cyan/15',
      text: 'text-cosmic-cyan',
      iconBg: 'icon-nebula-cyan',
      iconText: 'text-cosmic-cyan',
    },
    green: {
      bg: 'bg-success/15',
      text: 'text-success',
      iconBg: 'icon-container-success',
      iconText: 'text-success',
    },
    yellow: {
      bg: 'bg-warning/15',
      text: 'text-warning',
      iconBg: 'icon-container-warning',
      iconText: 'text-warning',
    },
    red: {
      bg: 'bg-destructive/15',
      text: 'text-destructive',
      iconBg: 'icon-container-destructive',
      iconText: 'text-destructive',
    },
    purple: {
      bg: 'bg-cosmic-purple/15',
      text: 'text-cosmic-purple',
      iconBg: 'icon-nebula-purple',
      iconText: 'text-cosmic-purple',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-card hover-lift transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className={`mt-2 text-3xl font-bold text-foreground`}>{value}</p>
          {trend && (
            <p className={`mt-2 text-sm font-medium flex items-center gap-1 ${
              trend.isPositive ? 'text-success' : 'text-destructive'
            }`}>
              <span className={`text-base ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${classes.iconBg}`}>
          <Icon className={`h-7 w-7 ${classes.iconText}`} />
        </div>
      </div>
    </div>
  );
}
