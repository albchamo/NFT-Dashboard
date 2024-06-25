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

    const parentNode = svg.node()?.parentNode as HTMLElement | null;
    const containerWidth = parentNode?.getBoundingClientRect().width || 900;
    const containerHeight = parentNode?.getBoundingClientRect().height || 540;
    const width = containerWidth;
    const height = containerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 30; // Adjust radius to fit better

    const angleStep = (2 * Math.PI) / nodes.length;
    const scaledNodes = nodes.map((node, index) => ({
      ...node,
      x: radius * Math.cos(index * angleStep - Math.PI / 2),
      y: radius * Math.sin(index * angleStep - Math.PI / 2)
    }));

    const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

    const colorScale = scaleSequential(interpolateBlues)
      .domain([0, Object.keys(tokenCombinations[tokenCount]).length - 1]);

    // Draw Nodes
    const nodesGroup = g.append('g')
      .selectAll('g')
      .data(scaledNodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    nodesGroup.append('circle')
      .attr('r', 10)
      .attr('fill', '#d80032')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    nodesGroup.append('text')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .text(d => d.tag)
      .style('fill', '#fff')
      .style('font-size', '20px');

    Object.entries(tokenCombinations[tokenCount]).forEach(([combinationKey, comb], index) => {
      const tokenIds = combinationKey.split('-');
      const positions = tokenIds.map(tokenId => scaledNodes.find(n => n?.id === tokenId));

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

  return <Box width="100%" height="100%" overflow="hidden"><svg ref={svgRef} width="100%" height="100%" ></svg></Box>;
};

export default TokenCombinationView;
