import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart2, Award, Calendar, Layers } from 'lucide-react';
import { UserRole } from '../types';

export interface TermPerformanceData {
  term: string;
  termShort: string;
  schoolAverage: number;
  classAverage: number;
  stemSubjects: number;
  humanities: number;
  topHonorsAverage: number;
  studentScore?: number;
}

export const THREE_TERMS_DATA: TermPerformanceData[] = [
  {
    term: 'Term 1 (Autumn 2025)',
    termShort: 'Term 1',
    schoolAverage: 81.2,
    classAverage: 83.5,
    stemSubjects: 82.0,
    humanities: 85.0,
    topHonorsAverage: 94.2,
    studentScore: 88.4,
  },
  {
    term: 'Term 2 (Spring 2026)',
    termShort: 'Term 2',
    schoolAverage: 83.8,
    classAverage: 86.4,
    stemSubjects: 85.6,
    humanities: 87.2,
    topHonorsAverage: 95.8,
    studentScore: 90.6,
  },
  {
    term: 'Term 3 (Mid-Term 2026)',
    termShort: 'Term 3 (Current)',
    schoolAverage: 86.5,
    classAverage: 89.2,
    stemSubjects: 89.8,
    humanities: 88.5,
    topHonorsAverage: 97.4,
    studentScore: 92.2,
  },
];

interface PerformanceTrendChartProps {
  currentRole: UserRole;
  studentName?: string;
  customStudentData?: { term: string; score: number }[];
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({
  currentRole,
  studentName = 'Marcus Vance',
}) => {
  const [viewMetric, setViewMetric] = useState<'overall' | 'subjects'>('overall');

  // Compute growth delta
  const initialClassAvg = THREE_TERMS_DATA[0].classAverage;
  const latestClassAvg = THREE_TERMS_DATA[THREE_TERMS_DATA.length - 1].classAverage;
  const growthRate = Math.round((latestClassAvg - initialClassAvg) * 10) / 10;

  const isStudentOrParent = currentRole === 'student' || currentRole === 'parent';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isStudentOrParent
                ? `${studentName} — Performance Trend (Last 3 Terms)`
                : 'Student Average Performance Trend (Last 3 Terms)'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudentOrParent
              ? `Term-over-term score progression compared with class average & honor roll standards.`
              : `Academic evaluation trend across Term 1 (Autumn), Term 2 (Spring), and Current Term 3.`}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMetric('overall')}
              className={`px-3 py-1 rounded-md transition ${
                viewMetric === 'overall'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Class & Benchmark
            </button>
            <button
              type="button"
              onClick={() => setViewMetric('subjects')}
              className={`px-3 py-1 rounded-md transition ${
                viewMetric === 'subjects'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              STEM vs Humanities
            </button>
          </div>
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
          <span className="text-slate-400 block font-medium">Term 1 Avg</span>
          <span className="text-base font-bold text-slate-800">{THREE_TERMS_DATA[0].classAverage}%</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
          <span className="text-slate-400 block font-medium">Term 2 Avg</span>
          <span className="text-base font-bold text-slate-800">{THREE_TERMS_DATA[1].classAverage}%</span>
        </div>
        <div className="bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-200/70">
          <span className="text-indigo-600 block font-medium">Current Term 3</span>
          <span className="text-base font-bold text-indigo-950">
            {THREE_TERMS_DATA[2].classAverage}%
          </span>
        </div>
        <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/70">
          <span className="text-emerald-700 block font-medium">3-Term Growth</span>
          <span className="text-base font-bold text-emerald-800">+{growthRate}% YoY</span>
        </div>
      </div>

      {/* Chart Visualization Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMetric === 'overall' ? (
            <AreaChart data={THREE_TERMS_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="classAvgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="termShort"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[70, 100]}
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                  padding: '10px 14px',
                }}
                formatter={(value: any, name: any) => [`${value}%`, name]}
                labelStyle={{ fontWeight: 'bold', color: '#cbd5e1', marginBottom: '4px' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
              <Area
                type="monotone"
                dataKey="classAverage"
                name="Class Grade Average"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#classAvgGrad)"
              />
              {isStudentOrParent ? (
                <Area
                  type="monotone"
                  dataKey="studentScore"
                  name={`${studentName} Score`}
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#studentGrad)"
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="schoolAverage"
                  name="Institution Benchmark"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={0}
                  fill="none"
                />
              )}
              <Line
                type="monotone"
                dataKey="topHonorsAverage"
                name="Top Honors (90th percentile)"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 3, fill: '#f59e0b' }}
              />
            </AreaChart>
          ) : (
            <LineChart data={THREE_TERMS_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="termShort"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[70, 100]}
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                  padding: '10px 14px',
                }}
                formatter={(value: any, name: any) => [`${value}%`, name]}
                labelStyle={{ fontWeight: 'bold', color: '#cbd5e1', marginBottom: '4px' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
              <Line
                type="monotone"
                dataKey="stemSubjects"
                name="STEM (Math, Physics, CS)"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#4f46e5' }}
              />
              <Line
                type="monotone"
                dataKey="humanities"
                name="Humanities & English"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#059669' }}
              />
              <Line
                type="monotone"
                dataKey="classAverage"
                name="Overall Composite"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#64748b' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100">
        <span className="flex items-center gap-1.5 font-medium text-slate-700">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Consistent progress: Aggregate score elevated from 83.5% to 89.2% over 3 terms.</span>
        </span>
        <span className="text-slate-400 font-mono text-[11px]">Evaluation Model: Rolling 3-Term Composite</span>
      </div>
    </div>
  );
};
