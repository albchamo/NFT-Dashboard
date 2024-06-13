import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { AnalysisResults } from '../components/analysisService';

interface ChartProps {
  analysisResults: AnalysisResults | null;
  onHoverTokenCount: (tokenCount: number) => void;
  onLeaveTokenCount: () => void;
}

const Chart: React.FC<ChartProps> = ({ analysisResults, onHoverTokenCount, onLeaveTokenCount }) => {
  if (!analysisResults) return null;

  const barData = Object.entries(analysisResults.tokenHoldingCounts)
    .filter(([count, holders]) => Number(count) > 0)
    .map(([count, holders]) => ({
      name: `${count} Tokens`,
      holders,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="holders"
          fill="#8884d8"
          onMouseEnter={(data) => onHoverTokenCount(Number(data.name.split(' ')[0]))}
          onMouseLeave={onLeaveTokenCount}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
