import React from 'react';

interface ThroughputChartProps {
  data: { time: string; sent: number; delivered: number; opens: number; clicks: number }[];
  height?: number;
}

export const ThroughputChart: React.FC<ThroughputChartProps> = ({ data, height = 220 }) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.sent)) * 1.15;
  const width = 640;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const getPoints = (key: 'sent' | 'delivered' | 'opens') => {
    return data.map((d, i) => {
      const x = paddingX + (i / (data.length - 1)) * chartW;
      const y = paddingY + chartH - (d[key] / maxVal) * chartH;
      return `${x},${y}`;
    }).join(' ');
  };

  const sentPoints = getPoints('sent');
  const deliveredPoints = getPoints('delivered');
  const opensPoints = getPoints('opens');

  // Create area path for sent
  const firstX = paddingX;
  const lastX = paddingX + chartW;
  const baseY = paddingY + chartH;
  const sentArea = `M ${firstX},${baseY} L ${sentPoints.split(' ')[0]} ${sentPoints} L ${lastX},${baseY} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))' }}
      >
        <defs>
          <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="deliveredGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingY + chartH * (1 - ratio);
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#64748b"
                className="font-mono"
              >
                {Math.round((maxVal * ratio) / 1000)}k
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={sentArea} fill="url(#sentGradient)" />

        {/* Lines */}
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="2.5"
          points={sentPoints}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          points={deliveredPoints}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="1.8"
          strokeDasharray="3 3"
          points={opensPoints}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = paddingX + (i / (data.length - 1)) * chartW;
          const y = paddingY + chartH - (d.sent / maxVal) * chartH;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill="#6366f1"
              stroke="#0f172a"
              strokeWidth="2"
            />
          );
        })}

        {/* X Axis labels */}
        {data.map((d, i) => {
          if (i % 2 !== 0 && i !== data.length - 1) return null;
          const x = paddingX + (i / (data.length - 1)) * chartW;
          return (
            <text
              key={i}
              x={x}
              y={height - 5}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
            >
              {d.time}
            </text>
          );
        })}
      </svg>

      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-indigo-500 rounded-full inline-block"></span>
          <span>Dispatch Velocity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-cyan-500 rounded-full inline-block"></span>
          <span>Delivered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block border-b border-dashed"></span>
          <span>Unique Opens</span>
        </div>
      </div>
    </div>
  );
};
