import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell
} from 'recharts';
import { AnalysisResults } from '../components/analysisService';
import { Box, Typography } from '@mui/material';

interface ChartProps {
  analysisResults: AnalysisResults | null;
  setExportListToTokenCount: (tokenCount: number) => void; // Use the function here
  resetExportList: () => void;
}

const Chart: React.FC<ChartProps> = ({ analysisResults,  setExportListToTokenCount, resetExportList }) => {
  const [activeTokenCount, setActiveTokenCount] = useState<number | null>(null);

  if (!analysisResults) return null;

  const barData = Object.entries(analysisResults.tokenHoldingCounts)
    .filter(([count, holders]) => Number(count) > 1)
    .map(([count, holders]) => ({
      name: `${count} Tokens`,
      holders,
    }));

  const handleClick = (data: any) => {
    const tokenCount = Number(data.name.split(' ')[0]);
    console.log('Token count clicked:', tokenCount);
    if (activeTokenCount === tokenCount) {
      setActiveTokenCount(null);
      resetExportList(); // Reset to allHolders when no token count is selected
      console.log('Export list reset to all holders:');
    } else {
      setActiveTokenCount(tokenCount);
      setExportListToTokenCount(tokenCount); // Update export list with holders of the selected token count
      console.log(`Export list updated for token count ${tokenCount}`);
    }
  };

  return (
    <Box style={{ paddingLeft: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', paddingBottom: '20px' }}>
        Holders by Token Count
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis type="number" domain={['auto', 'auto']} scale="log" hide />
          <YAxis dataKey="name" type="category">
          </YAxis>
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none' }}
            labelStyle={{ color: '#ffffff' }}
            itemStyle={{ color: '#ffffff' }}
          />
          <Bar
            dataKey="holders"
            fill="#ffffff"
            barSize={20}
            minPointSize={50} // Ensures minimum bar size
            onClick={handleClick}
          >
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name.includes(`${activeTokenCount} `) ? '#ff0000' : '#ffffff'}>
                <LabelList
                  dataKey="holders"
                  position="insideRight"
                  style={{ fill: '#000000', fontSize: '12px' }}
                />
              </Cell>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;
