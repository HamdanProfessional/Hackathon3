/**
 * Exercise Completion Pie Chart Component
 * Displays exercise completion status distribution
 */

'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface ExerciseData {
  name: string;
  value: number;
  color: string;
}

interface ExercisePieChartProps {
  data: ExerciseData[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

const DEFAULT_COLORS = [
  '#10b981', // green - completed
  '#f59e0b', // amber - in progress
  '#ef4444', // red - not started
  '#8b5cf6', // purple - needs review
  '#06b6d4', // cyan - mastered
];

export default function ExercisePieChart({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100
}: ExercisePieChartProps) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 35, 0.95)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number, name: string) => [value, name]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: '#a78bfa' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
