import React from 'react';
import { Typography, List, ListItem } from '@mui/material';

interface AnalysisResultsProps {
  analysisResults: {
    tokenHoldingCounts: { [key: number]: number };
    holdersByTokenCount: { [key: number]: Set<string> };
  } | null;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisResults }) => {
  if (!analysisResults) return null;

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Analysis Results
      </Typography>
      <List>
        {Object.entries(analysisResults.tokenHoldingCounts).map(([count, holders]) => (
          <ListItem key={count}>
            Holders with {count} Tokens: {holders}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AnalysisResults;
