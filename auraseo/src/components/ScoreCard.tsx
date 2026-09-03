import { useEffect, useState, memo, useId } from 'react';
import { getScoreColor, getScoreLabel } from '../lib/pagespeed';

interface ScoreCardProps {
  title: string;
  score: number;
  metrics: Array<{ label: string; value: string }>;
  icon: React.ReactNode;
  isLoading?: boolean;
  index?: number;
}

function ScoreCardComponent({ title, score, metrics, icon, isLoading, index = 0 }: ScoreCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;
  const filterId = useId();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      setAnimatedValue(score);
    }, 150 + index * 100);
    return () => clearTimeout(timer);
  }, [score, index, isLoading]);

  if (isLoading) {
    return (
      <div 
        className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 opacity-0 animate-fade-up"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <div className="skeleton w-28 h-28 rounded-full" />
        <div className="skeleton w-24 h-5 rounded" />
        <div className="flex gap-4">
          <div className="skeleton w-14 h-4 rounded" />
          <div className="skeleton w-14 h-4 rounded" />
        </div>
      </div>
    );
  }

  const glowColor = getScoreColor(score);

  return (
    <div 
      className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 group relative overflow-hidden border border-accent/20 hover:border-accent/50 transition-all duration-200 opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div 
        className="relative p-2"
        style={{ overflow: 'visible' }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 block"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={glowColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ 
              transition: 'stroke-dashoffset 1s ease-out',
            }}
            filter={`url(#${filterId})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span 
            className="text-3xl font-bold font-mono"
            style={{ color: glowColor }}
          >
            {Math.round(animatedValue)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span style={{ color: glowColor }}>{icon}</span>
        <span className="text-sm font-semibold text-text-primary">{title}</span>
      </div>

      <span 
        className="text-xs font-medium px-3 py-1 rounded-full"
        style={{ 
          color: glowColor,
          backgroundColor: `${glowColor}15`,
          border: `1px solid ${glowColor}30`,
        }}
      >
        {getScoreLabel(score)}
      </span>

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center gap-1.5">
            <span className="text-text-muted text-xs">{metric.label}</span>
            <span className="text-text-primary font-mono text-xs">{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="w-full mt-2">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill h-full rounded-sm"
            style={{ 
              width: `${animatedValue}%`,
              background: `linear-gradient(90deg, ${glowColor}, ${glowColor}80)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const ScoreCard = memo(ScoreCardComponent);