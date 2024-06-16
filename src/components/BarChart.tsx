import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Cell, LabelList
} from 'recharts';
import { AnalysisResults } from '../components/analysisService';
import { Box, Typography } from '@mui/material';

interface ChartProps {
  analysisResults: AnalysisResults | null;
  onHoverTokenCount: (tokenCount: number) => void;
  onLeaveTokenCount: () => void;
  onClickTokenCount: (tokenCount: number | null) => void; // Allow null for deactivation
}

const Chart: React.FC<ChartProps> = ({ analysisResults, onHoverTokenCount, onLeaveTokenCount, onClickTokenCount }) => {
  const [activeTokenCount, setActiveTokenCount] = useState<number | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false); // Flag to indicate clicked state

  if (!analysisResults) return null;

  const barData = Object.entries(analysisResults.tokenHoldingCounts)
    .filter(([count, holders]) => Number(count) > 1)
    .map(([count, holders]) => ({
      name: `${count} Tokens`,
      holders,
    }));

  const totalHolders = Object.values(analysisResults.tokenHoldingCounts).reduce((sum, holders) => sum + holders, 0);

  const handleClick = (data: any) => {
    const tokenCount = Number(data.name.split(' ')[0]);
    if (activeTokenCount === tokenCount) {
      setActiveTokenCount(null);
      setIsClicked(false); // Deactivate the clicked state
      onClickTokenCount(null); // Reset to default view
    } else {
      setActiveTokenCount(tokenCount);
      setIsClicked(true); // Set the clicked state
      onClickTokenCount(tokenCount);
    }
  };

  const handleMouseLeave = () => {
    if (!isClicked) { // Only call onLeaveTokenCount if not in clicked state
      onLeaveTokenCount();
    }
  };

  return (
    <Box style={{ paddingLeft: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', paddingBottom: "20px" }}>
        Analysis Console
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis type="number" domain={['auto', 'auto']} scale="log" hide />
          <YAxis dataKey="name" type="category">
            <Label value="# Tokens" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#ffffff' }} />
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
            onMouseEnter={(data) => {
              const tokenCount = Number(data.name.split(' ')[0]);
              if (tokenCount >= 3) {
                onHoverTokenCount(tokenCount);
              }
            }}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name.includes(`${activeTokenCount} Tokens`) ? '#ff0000' : '#ffffff'}>
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
      <Typography variant="body1" gutterBottom style={{ textAlign: 'right', paddingTop: '16px' }}>
        Total Holders: {totalHolders}
      </Typography>
    </Box>
  );
};

export default Chart;
