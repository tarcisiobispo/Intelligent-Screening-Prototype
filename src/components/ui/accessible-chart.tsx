import { InteractiveChart } from './interactive-chart';
import { announceToScreenReader } from '../../lib/accessibility';

interface AccessibleChartProps {
  title: string;
  description: string;
  data: any[];
  type: 'bar' | 'pie' | 'line';
  onDrillDown?: (point: any) => void;
  height?: number;
}

export function AccessibleChart({ title, description, data, type, onDrillDown, height }: AccessibleChartProps) {
  const generateDataTable = () => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(', ');
    const rows = data.map(item => Object.values(item).join(', ')).join('; ');
    return `${headers}. Dados: ${rows}`;
  };

  const handleDrillDown = (point: any) => {
    announceToScreenReader(`Explorando dados de ${point.label}: ${point.value}`, 'assertive');
    onDrillDown?.(point);
  };

  return (
    <div role="img" aria-label={`${title}. ${description}. ${generateDataTable()}`}>
      <InteractiveChart
        title={title}
        description={description}
        data={data}
        type={type}
        onDrillDown={handleDrillDown}
        height={height}
      />
      {/* Screen reader only data table */}
      <div className="sr-only">
        <table>
          <caption>{title} - {description}</caption>
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, i) => (
                  <td key={i}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}