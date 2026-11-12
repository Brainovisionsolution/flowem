import React from 'react';

interface ThroughputChartProps {
  data: { time: string; sent: number; delivered: number; opens: number; clicks: number }[];
  height?: number;
}

export const ThroughputChart: React.FC<ThroughputChartProps> = ({ data, height = 220 }) => {
  if (!data || data.length === 0) return null;

  const rawMax = Math.max(0, ...data.map(d => Math.max(Number(d.sent) || 0, Number(d.delivered) || 0, Number(d.opens) || 0)));
  const maxVal = rawMax > 0 ? rawMax * 1.15 : 100;
  const width = 640;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;
  const count = Math.max(data.length - 1, 1);

  const getPoints = (key: 'sent' | 'delivered' | 'opens') => {
    return data.map((d, i) => {
      const x = paddingX + (i / count) * chartW;
      const val = Number(d[key]) || 0;
      const y = paddingY + chartH - (val / maxVal) * chartH;
      const safeX = Number.isFinite(x) ? x : paddingX;
      const safeY = Number.isFinite(y) ? y : paddingY + chartH;
      return `${safeX},${safeY}`;
    }).join(' ');
  };

  const sentPoints = getPoints('sent');
  const deliveredPoints = getPoints('delivered');
  const opensPoints = getPoints('opens');

  // Area path
  const firstX = paddingX;
  const lastX = paddingX + chartW;
  const baseY = paddingY + chartH;
  const firstPoint = sentPoints.split(' ')[0] || `${firstX},${baseY}`;
  const sentArea = `M ${firstX},${baseY} L ${firstPoint} ${sentPoints} L ${lastX},${baseY} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="sentGradientLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingY + chartH * (1 - ratio);
          const safeY = Number.isFinite(y) ? y : paddingY;
          const labelVal = rawMax > 0 ? Math.round((maxVal * ratio) / 1000) : Math.round(100 * ratio);
          const labelText = rawMax > 0 ? `${labelVal}k` : `${labelVal}`;
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={safeY}
                x2={width - paddingX}
                y2={safeY}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 8}
                y={safeY + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
                className="font-mono"
              >
                {labelText}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={sentArea} fill="url(#sentGradientLight)" />

        {/* Lines */}
        <polyline
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2.5"
          points={sentPoints}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          fill="none"
          stroke="#0284c7"
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
          const x = paddingX + (i / count) * chartW;
          const val = Number(d.sent) || 0;
          const y = paddingY + chartH - (val / maxVal) * chartH;
          const safeX = Number.isFinite(x) ? x : paddingX;
          const safeY = Number.isFinite(y) ? y : paddingY + chartH;
          return (
            <circle
              key={i}
              cx={safeX}
              cy={safeY}
              r="3.5"
              fill="#4f46e5"
              stroke="#ffffff"
              strokeWidth="2"
            />
          );
        })}

        {/* X Axis labels */}
        {data.map((d, i) => {
          if (i % 2 !== 0 && i !== data.length - 1) return null;
          const x = paddingX + (i / count) * chartW;
          const safeX = Number.isFinite(x) ? x : paddingX;
          return (
            <text
              key={i}
              x={safeX}
              y={height - 5}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              {d.time}
            </text>
          );
        })}
      </svg>

      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-indigo-600 rounded-full inline-block"></span>
          <span>Emails Sent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-sky-600 rounded-full inline-block"></span>
          <span>Delivered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block border-b border-dashed"></span>
          <span>Opened</span>
        </div>
      </div>
    </div>
  );
};