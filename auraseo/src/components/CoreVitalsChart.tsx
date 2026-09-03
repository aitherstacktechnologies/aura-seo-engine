import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { CoreVitals } from '../types';
import { memo } from 'react';

interface CoreVitalsChartProps {
  vitals: CoreVitals;
  isLoading?: boolean;
}

function CoreVitalsChartComponent({ vitals, isLoading }: CoreVitalsChartProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-80 flex items-center justify-center opacity-0 animate-fade-up">
        <div className="skeleton w-full h-full rounded-xl" />
      </div>
    );
  }

  const data = [
    { name: 'LCP', value: vitals.lcp, color: '#674EBC' },
    { name: 'FID', value: vitals.fid, color: '#8D86C9' },
    { name: 'CLS', value: vitals.cls, color: '#D7D3DA' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const metric = payload[0].payload;
      return (
        <div className="glass rounded-xl p-3 border border-accent/30 shadow-xl">
          <p className="text-text-primary font-semibold">{metric.name}</p>
          <p className="text-text-secondary text-sm">
            Value: <span className="font-mono font-bold" style={{ color: metric.color }}>{metric.value}</span>
            {metric.name !== 'CLS' ? 'ms' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="glass-card rounded-2xl p-6 border border-accent/20 hover:border-accent/40 transition-all duration-200 opacity-0 animate-fade-up"
      style={{ animationDelay: '300ms' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Core Web Vitals</h3>
          <p className="text-xs text-text-muted mt-0.5">Real-time performance metrics</p>
        </div>
        <span className="text-[10px] text-text-muted px-2 py-1 rounded-full bg-bg-secondary border border-accent/20">
          Chrome UX
        </span>
      </div>

      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={`grad-${index}`} id={`colorBar${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(103, 78, 188, 0.08)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9890A8"
              tick={{ fill: '#D7D3DA', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: 'rgba(103, 78, 188, 0.2)' }}
              tickLine={false}
            />
            <YAxis 
              stroke="#9890A8"
              tick={{ fill: '#9890A8', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(103, 78, 188, 0.2)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
              animationBegin={200}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#colorBar${index})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {data.map((metric, i) => (
          <div 
            key={metric.name}
            className="rounded-xl p-4 text-center border border-accent/20 transition-transform duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: `${metric.color}10`, animationDelay: `${400 + i * 80}ms` }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ 
                  backgroundColor: metric.color,
                  boxShadow: `0 0 6px ${metric.color}`
                }}
              />
              <span className="text-text-muted text-xs sm:text-sm font-medium">{metric.name}</span>
            </div>
            <p 
              className="text-xl sm:text-2xl font-bold font-mono"
              style={{ color: metric.color }}
            >
              {metric.value}
              <span className="text-[10px] sm:text-xs text-text-muted ml-1">
                {metric.name === 'LCP' || metric.name === 'FID' ? 'ms' : ''}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const CoreVitalsChart = memo(CoreVitalsChartComponent);