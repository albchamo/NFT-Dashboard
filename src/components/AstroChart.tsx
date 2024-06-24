import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import * as d3 from 'd3';
import { AnalysisResults } from '../components/analysisService';
import NodeRelationshipView from './NodeRelationshipView';
import TokenCombinationView from './TokenCombinationView';
import { Node, Link, TokenCombination } from './AstroChartTypes';

interface AstroChartProps {
  nodes: { address: string; tag: string }[];
  analysisResults: AnalysisResults;
  clickTokenCount?: number | null;
  setClickTokenCount: (count: number | null) => void;
  setExportListToLink: (link: Link) => void;
  resetExportList: () => void;
}

const AstroChart: React.FC<AstroChartProps> = ({
  nodes = [],
  analysisResults,
  clickTokenCount,
  setClickTokenCount,
  setExportListToLink,
  resetExportList,
}) => {
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [viewState, setViewState] = useState<'Node Relationship View' | 'Token Combination View'>('Node Relationship View');

  useEffect(() => {
    if (clickTokenCount !== null && clickTokenCount !== undefined) {
      setViewState('Token Combination View');
    } else {
      setViewState('Node Relationship View');
      setSelectedLink(null);
      resetExportList();
    }
  }, [clickTokenCount, resetExportList]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!(event.target as Element).closest('svg')) {
      setClickTokenCount(null);
    }
  }, [setClickTokenCount]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  const angleStep = (2 * Math.PI) / nodes.length;
  const nodeData: Node[] = nodes.map((node, index) => ({
    id: node.address,
    tag: node.tag,
    holdersCount: analysisResults.holderCounts[node.address] || 0,
    angle: index * angleStep,
    x: 360 * Math.cos(index * angleStep - Math.PI / 2),
    y: 360 * Math.sin(index * angleStep - Math.PI / 2),
  }));

  const linkData: Link[] = analysisResults.linkData.map(link => ({
    ...link,
    source: nodeData.find(n => n?.id === link.source)!,
    target: nodeData.find(n => n?.id === link.target)!,
  })).filter(link => link.source && link.target);

  const linkColorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(analysisResults.linkData, d => d.value) || 1]);

  return (
    <Box width="100%" height="500px" overflow="hidden">
      {viewState === 'Node Relationship View' && (
        <NodeRelationshipView
          nodes={nodeData}
          links={linkData}
          linkColorScale={linkColorScale}
          setExportListToLink={setExportListToLink}
          resetExportList={resetExportList}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
        />
      )}
      {viewState === 'Token Combination View' && clickTokenCount !== undefined && clickTokenCount !== null && (
        <TokenCombinationView
          nodes={nodeData}
          tokenCombinations={analysisResults.tokenCombinations as TokenCombination}
          tokenCount={clickTokenCount}
        />
      )}
    </Box>
  );
};

export default AstroChart;
