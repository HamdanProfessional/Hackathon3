/**
 * Progress Chart Component
 * Displays learning progress over time using line charts
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ProgressData {
  date: string;
  mastery: number;
  exercisesCompleted: number;
  timeSpent: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  height?: number;
  showArea?: boolean;
}

export default function ProgressChart({
  data,
  height = 300,
  showArea = false
}: ProgressChartProps) {
  const ChartComponent = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
          <XAxis
            dataKey="date"
            stroke="#a78bfa"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#a78bfa"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 35, 0.95)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend
            wrapperStyle={{ color: '#a78bfa' }}
          />
          <DataComponent
            type="monotone"
            dataKey="mastery"
            name="Mastery Score"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="rgba(139, 92, 246, 0.3)"
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <DataComponent
            type="monotone"
            dataKey="exercisesCompleted"
            name="Exercises"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="rgba(6, 182, 212, 0.3)"
            dot={{ fill: '#06b6d4', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
