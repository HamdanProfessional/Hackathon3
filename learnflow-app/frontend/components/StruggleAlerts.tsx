import { AlertTriangle, Clock, XCircle, HelpCircle, TrendingDown, CheckCircle2 } from 'lucide-react';
import type { StruggleAlert } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface StruggleAlertsProps {
  alerts: StruggleAlert[];
  onResolve?: (alertId: string) => void;
}

const alertIcons = {
  repeated_error: XCircle,
  time_spent: Clock,
  low_quiz_score: TrendingDown,
  help_request: HelpCircle,
  failed_executions: AlertTriangle,
};

const alertColors = {
  repeated_error: 'icon-container-destructive text-destructive',
  time_spent: 'icon-container-warning text-warning',
  low_quiz_score: 'icon-nebula-pink text-cosmic-pink',
  help_request: 'icon-nebula-blue text-cosmic-blue',
  failed_executions: 'icon-container-destructive text-destructive',
};

const severityBorderColors = {
  low: 'border-border',
  medium: 'border-warning/50',
  high: 'border-destructive/50 shadow-glow-purple',
};

const severityBadgeColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/20 text-warning border-warning/30',
  high: 'bg-destructive/20 text-destructive border-destructive/30',
};

export default function StruggleAlerts({ alerts, onResolve }: StruggleAlertsProps) {
  const handleResolve = async (alertId: string) => {
    await api.resolveAlert(alertId);
    if (onResolve) {
      onResolve(alertId);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 text-center shadow-elevated">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No Active Alerts</h3>
        <p className="mt-2 text-muted-foreground">All students are doing well!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts?.map((alert) => {
        const Icon = alertIcons[alert.type];
        const colors = alertColors[alert.type];
        const borderColor = severityBorderColors[alert.severity];
        const badgeColor = severityBadgeColors[alert.severity];

        return (
          <div
            key={alert.id}
            className={`rounded-xl border-2 ${borderColor} bg-card/80 backdrop-blur-sm p-4 shadow-card hover-lift transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-foreground">{alert.studentName}</h4>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${badgeColor}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {alert.context.exerciseId && (
                      <span className="rounded-full bg-muted px-2.5 py-1 border border-border/50">
                        Exercise: {alert.context.exerciseId}
                      </span>
                    )}
                    {alert.context.attempts && (
                      <span className="rounded-full bg-muted px-2.5 py-1 border border-border/50">
                        {alert.context.attempts} attempts
                      </span>
                    )}
                    {alert.context.timeSpent && (
                      <span className="rounded-full bg-muted px-2.5 py-1 border border-border/50">
                        {Math.floor(alert.context.timeSpent / 60)} min
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground/70">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {!alert.resolved && (
                <Button
                  onClick={() => handleResolve(alert.id)}
                  size="sm"
                  variant="outline"
                  className="border-cosmic-purple/30 hover:border-cosmic-purple/60 hover:bg-cosmic-purple/10 text-foreground"
                >
                  Resolve
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
