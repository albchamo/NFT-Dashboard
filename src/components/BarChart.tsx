import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ChartProps {
  analysisResults: {
    totalMainHolders: number;
    holdersWithAllTokens: number;
    holdersWithSomeTokens: number;
    holdersWithNoOtherTokens: number;
    tokenHoldingCounts: { [key: number]: number };
  } | null;
  onHoverTokenCount: (tokenCount: number) => void;
  onLeaveTokenCount: () => void;
  onClickTokenCount: (tokenCount: number) => void;
}

const Chart: React.FC<ChartProps> = ({ analysisResults, onHoverTokenCount, onLeaveTokenCount, onClickTokenCount }) => {
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
          onClick={(data) => onClickTokenCount(Number(data.name.split(' ')[0]))}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
