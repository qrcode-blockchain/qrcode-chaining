
import React, { useState } from 'react';

const EnhancedProductPieChart = ({ series, labels, className = "" }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const total = series.reduce((sum, value) => sum + value, 0);

  const chartData = series.map((value, index) => ({
    name: labels[index],
    value: value,
    percentage: ((value / total) * 100).toFixed(1),
    color: getColor(index),
    originalIndex: index
  }));

  chartData.sort((a, b) => b.value - a.value);

  function getColor(index) {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280',
      '#14B8A6', '#F43F5E'
    ];
    return colors[index % colors.length];
  }

  const createPath = (startAngle, endAngle, outerRadius, innerRadius = 0) => {
    const start = polarToCartesian(100, 100, outerRadius, endAngle);
    const end = polarToCartesian(100, 100, outerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    if (innerRadius > 0) {
      const innerStart = polarToCartesian(100, 100, innerRadius, endAngle);
      const innerEnd = polarToCartesian(100, 100, innerRadius, startAngle);

      return [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
      ].join(" ");
    } else {
      return [
        "M", 100, 100,
        "L", start.x, start.y,
        "A", 80, 80, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    }
  };

  const polarToCartesian = (cx, cy, r, angle) => {
    const radians = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(radians),
      y: cy + r * Math.sin(radians)
    };
  };

  let currentAngle = 0;
  const slices = chartData.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    const labelAngle = startAngle + sliceAngle / 2;
    const labelRadius = 65;
    const labelPos = polarToCartesian(100, 100, labelRadius, labelAngle);

    currentAngle = endAngle;

    return {
      ...item,
      path: createPath(startAngle, endAngle, 80, 25),
      labelPos,
      startAngle,
      endAngle,
      sliceAngle
    };
  });

  return (
    <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-6 text-center">
        Product Sales Distribution
      </h3>

      <div className="flex flex-col items-center">
        {/* Pie Chart */}
        <div className="relative mb-6">
          <svg width="300" height="300" viewBox="0 0 200 200" className="drop-shadow-lg">
            <defs>
              {slices.map((slice, index) => (
                <linearGradient key={index} id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: slice.color, stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: slice.color, stopOpacity: 0.7 }} />
                </linearGradient>
              ))}
            </defs>

            {slices.map((slice, index) => (
              <g key={index}>
                <path
                  d={slice.path}
                  fill={`url(#grad-${index})`}
                  stroke="#1e293b"
                  strokeWidth="2"
                  onClick={() => setActiveIndex(slice.originalIndex)}
                  className="transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    transformOrigin: '100px 100px'
                  }}
                />
                
                {(slice.sliceAngle > 20 || activeIndex === slice.originalIndex) && (
                  <text
                    x={slice.labelPos.x}
                    y={slice.labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-bold fill-white"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {slice.percentage}%
                  </text>
                )}
              </g>
            ))}

            <circle
              cx="100"
              cy="100"
              r="20"
              fill="#1e293b"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="text-xs font-medium fill-white"
            >
              Total
            </text>
            <text
              x="100"
              y="108"
              textAnchor="middle"
              className="text-sm font-bold fill-white"
            >
              {total.toLocaleString()}
            </text>
          </svg>
        </div>
        
        {/* Compact Legend Below Chart */}
        <div className="w-full max-w-md">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {chartData.map((item) => (
              <div
                key={item.originalIndex}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                  activeIndex === item.originalIndex 
                    ? 'bg-slate-600 border border-blue-400' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                onClick={() => setActiveIndex(item.originalIndex)}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white text-xs truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EnhancedProductPieChart;