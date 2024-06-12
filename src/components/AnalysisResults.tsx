import React from 'react';
import { Typography, List, ListItem } from '@mui/material';

interface AnalysisResultsProps {
  analysisResults: {
    totalMainHolders: number;
    holdersWithAllTokens: number;
    holdersWithSomeTokens: number;
    holdersWithNoOtherTokens: number;
    tokenHoldingCounts: { [key: number]: number };
  } | null;
  onHoverTokenCount: (tokenCount: number) => void;
  onLeaveTokenCount: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisResults, onHoverTokenCount, onLeaveTokenCount }) => {
  if (!analysisResults) return null;

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Analysis Results
      </Typography>
      <List>
        <ListItem
          onMouseEnter={() => onHoverTokenCount(1)}
          onMouseLeave={onLeaveTokenCount}
        >
          Total Node 1 Holders: {analysisResults.totalMainHolders}
        </ListItem>
        <ListItem
          onMouseEnter={() => onHoverTokenCount(Object.keys(analysisResults.tokenHoldingCounts).length)}
          onMouseLeave={onLeaveTokenCount}
        >
          Holders with All Tokens: {analysisResults.holdersWithAllTokens}
        </ListItem>
        <ListItem
          onMouseEnter={() => onHoverTokenCount(Object.keys(analysisResults.tokenHoldingCounts).length - 1)}
          onMouseLeave={onLeaveTokenCount}
        >
          Holders with Some Tokens: {analysisResults.holdersWithSomeTokens}
        </ListItem>
        <ListItem
          onMouseEnter={() => onHoverTokenCount(0)}
          onMouseLeave={onLeaveTokenCount}
        >
          Holders with No Other Tokens: {analysisResults.holdersWithNoOtherTokens}
        </ListItem>
        {Object.entries(analysisResults.tokenHoldingCounts).map(([count, holders]) => (
          <ListItem
            key={count}
            onMouseEnter={() => onHoverTokenCount(Number(count))}
            onMouseLeave={onLeaveTokenCount}
          >
            Holders with {count} Tokens: {holders}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AnalysisResults;
