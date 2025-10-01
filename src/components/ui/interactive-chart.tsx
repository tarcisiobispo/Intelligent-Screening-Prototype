import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
  drillDown?: ChartDataPoint[];
  metadata?: any;
}

interface InteractiveChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  type: 'bar' | 'pie' | 'line';
  onDrillDown?: (point: ChartDataPoint) => void;
  height?: number;
}

// Cores consistentes para categorias específicas
const getColorForCategory = (name: string): string => {
  const colorMap: { [key: string]: string } = {
    'Pendente': '#FF8042',
    'Em Andamento': '#FFBB28', 
    'Concluído': '#00C49F',
    'Cancelado': '#FF6B6B',
    'Alta': '#FF4444',
    'Média': '#FFA500',
    'Baixa': '#00C49F',
    'Crítica': '#8B0000',
    'João Silva': '#0088FE',
    'Maria Santos': '#00C49F',
    'Pedro Costa': '#FFBB28',
    'Ana Oliveira': '#FF8042',
    'Carlos Lima': '#8884D8',
    'Documentos': '#0088FE',
    'Tarefas': '#00C49F',
    'Relatórios': '#FFBB28',
    'Análises': '#FF8042'
  };
  
  return colorMap[name] || `hsl(${Math.abs(name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 360}, 70%, 50%)`;
};

export function InteractiveChart({ title, description, data, type, onDrillDown, height = 200 }: InteractiveChartProps) {
  const [drillPath, setDrillPath] = useState<ChartDataPoint[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Aplicar cores consistentes aos dados
  const processedData = data.map(item => ({
    ...item,
    color: item.color || getColorForCategory(item.label)
  }));

  const currentData = drillPath.length > 0 ? 
    (drillPath[drillPath.length - 1].drillDown || []).map(item => ({
      ...item,
      color: item.color || getColorForCategory(item.label)
    })) : 
    processedData;
    
  const maxValue = Math.max(...currentData.map(d => d.value));

  const handleClick = (point: ChartDataPoint, index: number) => {
    if (point.drillDown && point.drillDown.length > 0) {
      setDrillPath([...drillPath, point]);
      onDrillDown?.(point);
    }
  };

  const handleBack = () => {
    setDrillPath(drillPath.slice(0, -1));
  };

  const renderBarChart = () => (
    <div className="space-y-3 overflow-y-auto max-h-full">
      {currentData.map((point, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium truncate flex-1 mr-2">{point.label}</span>
            <span className="text-[var(--muted)] font-mono text-xs">{point.value.toLocaleString()}</span>
          </div>
          <div 
            className="relative h-7 bg-[var(--border)] rounded-md cursor-pointer transition-all hover:shadow-sm"
            onClick={() => handleClick(point, index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="h-full rounded-md transition-all duration-300 flex items-center justify-end pr-2"
              style={{ 
                width: `${Math.max((point.value / maxValue) * 100, 5)}%`,
                backgroundColor: point.color,
                transform: hoveredIndex === index ? 'scaleY(1.05)' : 'scaleY(1)',
                boxShadow: hoveredIndex === index ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {point.drillDown && (
                <span className="text-white text-xs font-bold opacity-80">→</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = currentData.reduce((sum, point) => sum + point.value, 0);
    let currentAngle = 0;
    const size = Math.min(140, typeof window !== 'undefined' ? window.innerWidth * 0.2 : 140);
    const radius = size / 2 - 10;
    const center = size / 2;

    return (
      <div className="flex flex-col lg:flex-row items-center gap-4 h-full">
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {currentData.map((point, index) => {
              const percentage = point.value / total;
              const angle = percentage * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = center + radius * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = center + radius * Math.sin(((startAngle + angle) * Math.PI) / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={point.color}
                  className="cursor-pointer hover:opacity-80 transition-all hover:scale-105"
                  onClick={() => handleClick(point, index)}
                  style={{ transformOrigin: `${center}px ${center}px` }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-2">
              <div className="text-lg font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{total.toLocaleString()}</div>
              <div className="text-xs text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Total</div>
            </div>
          </div>
        </div>
        <div className="space-y-2 flex-1 max-h-[200px] overflow-y-auto">
          {currentData.map((point, index) => (
            <div key={index} className="flex items-center gap-2 text-sm p-1 rounded hover:bg-[var(--accent)]/50 cursor-pointer transition-colors" onClick={() => handleClick(point, index)}>
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: point.color }}
              />
              <span className="flex-1 truncate text-[var(--foreground)]">{point.label}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-medium font-mono text-xs text-[var(--foreground)]">{point.value.toLocaleString()}</span>
                <span className="text-[var(--muted)] text-xs min-w-[40px] text-right">
                  {Math.round((point.value / total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const containerWidth = Math.min(400, typeof window !== 'undefined' ? window.innerWidth * 0.8 : 400);
    const chartHeight = Math.min(height, 250);
    const padding = { top: 20, right: 30, bottom: 60, left: 40 };
    const chartWidth = containerWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;
    
    const points = currentData.map((point, index) => {
      const x = (index / Math.max(currentData.length - 1, 1)) * chartWidth;
      const y = innerHeight - ((point.value / maxValue) * innerHeight);
      return { x, y, ...point };
    });

    return (
      <div className="relative w-full overflow-x-auto">
        <svg width={containerWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={padding.top + ratio * innerHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + ratio * innerHeight}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={padding.top + ratio * innerHeight + 4}
              textAnchor="end"
              className="text-xs fill-[var(--muted)]"
            >
              {Math.round(maxValue * (1 - ratio))}
            </text>
          ))}
          
          {/* Line */}
          {points.length > 1 && (
            <polyline
              points={points.map(p => `${p.x + padding.left},${p.y + padding.top}`).join(' ')}
              fill="none"
              stroke={currentData[0]?.color || '#0088FE'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x + padding.left}
                cy={point.y + padding.top}
                r="5"
                fill={point.color}
                className="cursor-pointer hover:r-7 transition-all drop-shadow-sm"
                onClick={() => handleClick(point, index)}
              />
              {hoveredIndex === index && (
                <text
                  x={point.x + padding.left}
                  y={point.y + padding.top - 15}
                  textAnchor="middle"
                  className="text-xs font-medium fill-[var(--foreground)]"
                >
                  {point.value}
                </text>
              )}
            </g>
          ))}
        </svg>
        
        {/* X-axis Labels */}
        <div className="flex justify-between mt-2" style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
          {currentData.map((point, index) => (
            <span 
              key={index} 
              className="text-xs text-[var(--muted)] text-center max-w-[60px] truncate"
              style={{ transform: 'rotate(-45deg)', transformOrigin: 'center top' }}
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <p className="text-sm text-[var(--muted)] mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {drillPath.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="text-xs">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Voltar
              </Button>
            )}
            {drillPath.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {drillPath[drillPath.length - 1].label}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Breadcrumb */}
        {drillPath.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-[var(--muted)] flex-wrap">
            <span>Dashboard</span>
            {drillPath.map((item, index) => (
              <React.Fragment key={index}>
                <span className="mx-1">→</span>
                <span className="truncate max-w-[100px]">{item.label}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-[200px] max-h-[400px] overflow-hidden">
          {type === 'bar' && renderBarChart()}
          {type === 'pie' && renderPieChart()}
          {type === 'line' && renderLineChart()}
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex-shrink-0">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Total:</span>
            <span className="font-medium">
              {currentData.reduce((sum, point) => sum + point.value, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}