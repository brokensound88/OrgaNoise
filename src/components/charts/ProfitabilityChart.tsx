import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ProfitabilityData, TimeRange } from '../../types/financial';
import { FinancialsService } from '../../services/financials';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProfitabilityChartProps {
  timeRange: TimeRange;
}

const ProfitabilityChart: React.FC<ProfitabilityChartProps> = ({ timeRange }) => {
  const [data, setData] = useState<ProfitabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const financialsService = new FinancialsService();
        const profitabilityData = await financialsService.getProfitabilityData(timeRange);
        setData(profitabilityData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profitability data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const chartData: ChartData<'line'> = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Profit',
        data: data.map(item => item.profit),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Margin',
        data: data.map(item => item.margin),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Growth',
        data: data.map(item => item.growth),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Profitability Metrics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProfitabilityChart; 