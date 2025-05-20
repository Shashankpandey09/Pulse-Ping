import { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import type { Monitor } from '../types/types';
import {
  Chart as ChartJS,
  LineController,
  BarController,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  LineController,
  BarController,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

// Color constants
const BRIGHT_GREEN = '#4cff4c';
const BRIGHT_RED = '#ff4c4c';
const TEXT_WHITE = '#ffffff';
const GRID_COLOR = '#ffffff30';

interface HistoryPoint {
  lastPing: Date;
  responseTime: number | null;
  lastStatus: string;
}

interface Props {
  history: HistoryPoint[];
  monitor:Monitor
}

export const MonitorGraph: React.FC<Props> = ({ history = [] ,monitor}) => {
  const [view, setView] = useState<'both' | 'response' | 'status'>('both');

  // Prepare chart data
  const labels = history.map(h => new Date(h.lastPing));
  
  // Response time line configuration
  const responseLine = {
    type: 'line' as const,
    label: 'Response Time (ms)',
    data: history.map(h => h.responseTime ?? null),
    borderColor: BRIGHT_GREEN,
    backgroundColor: BRIGHT_GREEN + '40',
    yAxisID: 'y1',
    tension: 0.3,
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: TEXT_WHITE,
    spanGaps: true
  };

  // Status bars configuration (red for down, green for up)
  const statusBars = {
    type: 'bar' as const,
    label: 'Service Status',
    data: history.map(h => (h.lastStatus === 'up' ? 1 : 0.5)),
    backgroundColor: history.map(h => 
      h.lastStatus === 'up' ? BRIGHT_GREEN + 'cc' : BRIGHT_RED + 'cc'
    ),
    borderColor: TEXT_WHITE,
    borderWidth: 1,
    yAxisID: 'y2',
    barPercentage: 0.6
  };

  const data = {
    labels,
    datasets:
      view === 'both' ? [responseLine, statusBars]
      : view === 'response' ? [responseLine]
      : [statusBars]
  };

  // Chart options with white text and dark theme
  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: TEXT_WHITE,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'MMM dd, HH:mm',
          displayFormats: { minute: 'HH:mm' }
        },
        title: { 
          display: true, 
          text: 'Time',
          color: TEXT_WHITE
        },
        grid: { color: GRID_COLOR },
        ticks: { color: TEXT_WHITE }
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: { 
          display: true, 
          text: 'Response Time (ms)',
          color: TEXT_WHITE
        },
        min: 0,
        display: view !== 'status',
        grid: { color: GRID_COLOR },
        ticks: { color: TEXT_WHITE }
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: { 
          display: true, 
          text: 'Service Status',
          color: TEXT_WHITE
        },
        min: 0,
        max: 1,
        display: view !== 'response',
        ticks: {
          stepSize: 1,
          callback: (v) => v === 1 ? 'UP' : 'DOWN',
          color: TEXT_WHITE
        },
        grid: { 
          drawOnChartArea: view === 'both',
          color: GRID_COLOR
        }
      }
    },
    plugins: {
      title: { 
        display: true, 
        text: 'Service Monitoring',
        color: TEXT_WHITE,
        font: { size: 18 }
      },
      legend: { 
        position: 'top',
        labels: {
          color: TEXT_WHITE,
          usePointStyle: true,
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: '#000000dd',
        bodyColor: TEXT_WHITE,
        titleColor: BRIGHT_GREEN,
        borderColor: GRID_COLOR,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const isStatus = context.dataset.yAxisID === 'y2';
            
            return `${label}: ${
              isStatus 
                ? (value === 1 ? 'UP' : 'DOWN') 
                : `${value} ms`
            }`;
          }
        }
      }
    }
  };

 return (
  <div style={{
    position: 'relative',
    height: '100%',
    width: '100%',
    padding: '20px',
    color: TEXT_WHITE
  }}>
    {/* Monitor Info */}
    <div style={{
      marginBottom: '20px',
      backgroundColor: '#1e1e1e',
      padding: '16px',
      borderRadius: '8px',
      border: `1px solid ${GRID_COLOR}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ marginBottom: '8px', fontSize: '20px', color: BRIGHT_GREEN }}>{monitor?.name}</h2>
      <p style={{ margin: '4px 0' }}><strong>URL:</strong> {monitor?.url}</p>
      <p style={{ margin: '4px 0' }}><strong>Check Interval:</strong> Every {monitor?.interval} min</p>
      {monitor?.currentStatus && (
        <p style={{ margin: '4px 0' }}>
          <strong>Expected Status:</strong> {monitor?.currentStatus}
        </p>
      )}
      {monitor?.createdAt && (
        <p style={{ margin: '4px 0' }}>
          <strong>Started Monitoring:</strong> {new Date(monitor.createdAt).toLocaleString()}
        </p>
      )}
    </div>

    {/* View Selector */}
    <div style={{ marginBottom: 20 }}>
      <select
        value={view}
        onChange={(e) => setView(e.target.value as typeof view)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#333',
          color: TEXT_WHITE,
          border: `1px solid ${GRID_COLOR}`,
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        <option value="both">Both Metrics</option>
        <option value="response">Response Times</option>
        <option value="status">Status Overview</option>
      </select>
    </div>

    {/* Chart */}
    <div style={{ height: '500px' }}>
      <Chart
        type={view === 'status' ? 'bar' : 'line'}
        data={data}
        options={options}
      />
    </div>
  </div>
);
};

export default MonitorGraph;