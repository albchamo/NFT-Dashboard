import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Cell, LabelList
} from 'recharts';
import { AnalysisResults } from '../components/analysisService';
import { Box, Typography } from '@mui/material';

interface ChartProps {
  analysisResults: AnalysisResults | null;
  onHoverTokenCount: (tokenCount: number) => void;
  onLeaveTokenCount: () => void;
  onClickTokenCount: (tokenCount: number | null) => void;
  setExportList: (holders: Set<string>) => void; // Add this prop
}

const Chart: React.FC<ChartProps> = ({ analysisResults, onHoverTokenCount, onLeaveTokenCount, onClickTokenCount, setExportList }) => {
  const [activeTokenCount, setActiveTokenCount] = useState<number | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [totalHolders, setTotalHolders] = useState<number>(0);

  useEffect(() => {
    console.log('Active token count changed:', activeTokenCount);
    if (activeTokenCount !== null && analysisResults) {
      setTotalHolders(analysisResults.tokenHoldingCounts[activeTokenCount] || 0);
    } else {
      setTotalHolders(Object.values(analysisResults?.tokenHoldingCounts || {}).reduce((sum, holders) => sum + holders, 0));
    }
  }, [activeTokenCount, analysisResults]);

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
      setIsClicked(false);
      onClickTokenCount(null);
      setExportList(new Set()); // Clear export list when no token count is selected
      console.log('Export list cleared');
    } else {
      setActiveTokenCount(tokenCount);
      setIsClicked(true);
      onClickTokenCount(tokenCount);
      const holders = analysisResults?.holdersByTokenCount[tokenCount] || new Set();
      setExportList(holders); // Update export list with holders of the selected token count
      console.log(`Export list updated for token count ${tokenCount}:`, holders);
    }
  };

  const handleMouseLeave = () => {
    if (!isClicked) {
      onLeaveTokenCount();
    }
  };

  return (
    <Box style={{ paddingLeft: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', paddingBottom: "20px" }}>
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
      <Typography variant="body1" gutterBottom style={{ textAlign: 'right', paddingTop: '16px', fontSize: "18px" }}>
        Holders: {totalHolders}
      </Typography>
      <Typography variant="body1" gutterBottom style={{ textAlign: 'right', paddingTop: '16px', fontSize: "18px" }}>
        Select a number of tokens and export the address list.
      </Typography>
    </Box>
  );
};

export default Chart;
