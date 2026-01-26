/**
 * Skill Radar Chart Component
 * Displays multi-dimensional skill assessment using radar chart
 */

'use client';

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface SkillData {
  skill: string;
  current: number;
  target: number;
}

interface SkillRadarChartProps {
  data: SkillData[];
  height?: number;
}

export default function SkillRadarChart({
  data,
  height = 350
}: SkillRadarChartProps) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <PolarGrid stroke="rgba(139, 92, 246, 0.2)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#a78bfa', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#a78bfa', fontSize: 10 }}
          />
          <Radar
            name="Current Level"
            dataKey="current"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="#8b5cf6"
            fillOpacity={0.4}
          />
          <Radar
            name="Target Level"
            dataKey="target"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="#06b6d4"
            fillOpacity={0.2}
            strokeDasharray="5 5"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 15, 35, 0.95)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [`${value}%`, '']}
          />
          <Legend wrapperStyle={{ color: '#a78bfa' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
