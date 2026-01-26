/**
 * Activity Heatmap Component
 * Displays learning activity over time (similar to GitHub contribution graph)
 */

'use client';

import React from 'react';

interface ActivityDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4; // Activity intensity level
  exercises?: number;
  minutes?: number;
}

interface ActivityHeatmapProps {
  data: ActivityDay[];
  weeks?: number;
  color?: string;
}

export default function ActivityHeatmap({
  data,
  weeks = 12,
  color = '#8b5cf6'
}: ActivityHeatmapProps) {
  // Generate data if not provided
  const heatmapData = React.useMemo(() => {
    if (data.length > 0) return data;

    const today = new Date();
    const generated: ActivityDay[] = [];

    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Random activity level for demo
      const level = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4;

      generated.push({
        date: date.toISOString().split('T')[0],
        level,
        exercises: level > 0 ? Math.floor(Math.random() * 10) + 1 : 0,
        minutes: level > 0 ? Math.floor(Math.random() * 60) + 15 : 0
      });
    }

    return generated;
  }, [data, weeks]);

  // Get color based on activity level
  const getCellColor = (level: number) => {
    const opacity = level === 0 ? 0.1 : level * 0.2;
    return `rgba(139, 92, 246, ${opacity})`;
  };

  // Group data by weeks
  const weeksData: ActivityDay[][] = [];
  const daysPerWeek = 7;

  for (let i = 0; i < heatmapData.length; i += daysPerWeek) {
    weeksData.push(heatmapData.slice(i, i + daysPerWeek));
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Day labels */}
        <div className="flex ml-8 mb-2">
          {dayLabels.map((day, idx) => (
            <div
              key={day}
              className="w-3 flex items-center justify-center text-xs"
              style={{ height: '12px' }}
            >
              {idx % 2 === 1 ? day : ''}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex">
          {/* Month labels could go here */}
          <div className="w-8"></div>

          {/* Weeks */}
          <div className="flex gap-1">
            {weeksData.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const dayData = week[dayIdx];
                  const level = dayData?.level ?? 0;
                  const hasTooltip = dayData && level > 0;

                  return (
                    <div
                      key={dayIdx}
                      className="w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-125 hover:ring-2 hover:ring-purple-400"
                      style={{
                        backgroundColor: getCellColor(level)
                      }}
                      title={hasTooltip ? `
                        ${dayData.date}
                        ${dayData.exercises} exercises
                        ${dayData.minutes} minutes
                      ` : 'No activity'}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 ml-8">
          <span className="text-xs text-purple-300">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getCellColor(level) }}
              />
            ))}
          </div>
          <span className="text-xs text-purple-300">More</span>
        </div>
      </div>
    </div>
  );
}
