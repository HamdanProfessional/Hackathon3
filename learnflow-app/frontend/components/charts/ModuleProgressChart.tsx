/**
 * Module Progress Chart Component
 * Displays progress across different modules using a bar chart
 */

'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';

interface ModuleData {
  name: string;
  progress: number;
  exercises: number;
  mastery: string;
  color?: string;
}

interface ModuleProgressChartProps {
  data: ModuleData[];
  height?: number;
  horizontal?: boolean;
}

const DEFAULT_COLORS = [
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#3b82f6', // blue
  '#84cc16', // lime
];

export default function ModuleProgressChart({
  data,
  height = 300,
  horizontal = false
}: ModuleProgressChartProps) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
          <XAxis
            dataKey="name"
            stroke="#a78bfa"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#a78bfa"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 35, 0.95)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'progress') return [`${value}%`, 'Progress'];
              if (name === 'exercises') return [value, 'Exercises'];
              return [value, name];
            }}
          />
          <Legend wrapperStyle={{ color: '#a78bfa' }} />
          <Bar dataKey="progress" name="Progress %" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Bar>
          <Bar dataKey="exercises" name="Exercises" fill="#06b6d4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
