import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';
import { Node, TokenCombination } from './AstroChartTypes';
import { scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';

interface TokenCombinationViewProps {
  nodes: Node[];
  tokenCombinations: TokenCombination;
  tokenCount: number;
}

const TokenCombinationView: React.FC<TokenCombinationViewProps> = ({
  nodes,
  tokenCombinations,
  tokenCount,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!nodes.length || !tokenCombinations[tokenCount]) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 900;
    const height = 540;
    const centerX = width / 2;
    const centerY = height / 2;

    const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

    const colorScale = scaleSequential(interpolateBlues)
      .domain([0, Object.keys(tokenCombinations[tokenCount]).length - 1]);

    Object.entries(tokenCombinations[tokenCount]).forEach(([combinationKey, comb], index) => {
      const tokenIds = combinationKey.split('-');
      const positions = tokenIds.map(tokenId => nodes.find(n => n?.id === tokenId));

      if (positions.every(position => position !== undefined)) {
        const sortedPositions = positions.sort((a, b) => (a!.angle - b!.angle));
        const pathData: [number, number][] = sortedPositions.map(pos => [pos!.x, pos!.y]);
        pathData.push([sortedPositions[0]!.x, sortedPositions[0]!.y]);

        g.append('path')
          .attr('d', d3.line<[number, number]>()(pathData)!)
          .attr('class', 'pattern')
          .attr('fill', 'none')
          .attr('stroke', colorScale(index))
          .attr('stroke-opacity', 0.9)
          .attr('stroke-width', 4);
      }
    });

    return () => {
      svg.selectAll('*').remove();
    };
  }, [nodes, tokenCombinations, tokenCount]);

  return <svg ref={svgRef} width="100%" height="500px"></svg>;
};

export default TokenCombinationView;
