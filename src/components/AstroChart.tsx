'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Typography, Box } from '@mui/material';
import { AnalysisResults } from '../components/analysisService';

interface Node {
  id: string;
  tag: string;
  holdersCount: number;
  angle: number;
  x: number;
  y: number;
}

interface Link {
  source: Node;
  target: Node;
  value: number;
}

interface AstroChartProps {
  nodes: { address: string; tag: string }[];
  analysisResults: AnalysisResults;
  hoverTokenCount?: number | null;
  clickTokenCount?: number | null;
}

const AstroChart: React.FC<AstroChartProps> = ({ nodes = [], analysisResults, hoverTokenCount, clickTokenCount }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const linkColorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(analysisResults.linkData, d => d.value) || 1]);

  useEffect(() => {
    if (!nodes.length || !analysisResults.linkData.length) return;

    const width = 900;
    const height = 540;
    const radius = Math.min(width, height) / 2 - 40;
    const angleStep = (2 * Math.PI) / nodes.length;
    const centerX = width / 2;
    const centerY = height / 2;

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#000')
      .append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    const nodeData: Node[] = nodes.map((node, index) => ({
      id: node.address,
      tag: node.tag,
      holdersCount: analysisResults.holderCounts[node.address] || 0,
      angle: index * angleStep,
      x: radius * Math.cos(index * angleStep - Math.PI / 2),
      y: radius * Math.sin(index * angleStep - Math.PI / 2),
    }));

    console.log('Node Data:', nodeData); // Debugging: Check node positions

    const linkData: Link[] = analysisResults.linkData.map(link => ({
      ...link,
      source: nodeData.find(n => n?.id === link.source)!,
      target: nodeData.find(n => n?.id === link.target)!,
    }));

    console.log('Link Data:', linkData);

    svg.append('g')
      .selectAll('path')
      .data(linkData)
      .enter().append('path')
      .attr('class', d => `link link-${d.value}`)
      .attr('d', (d: Link) => {
        const dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      })
      .attr('stroke-width', d => Math.sqrt(d.value) / 4)
      .attr('stroke', d => linkColorScale(d.value))
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.9);

    const nodesGroup = svg.append('g')
      .selectAll('g')
      .data(nodeData)
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

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '8px')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    nodesGroup.on('mouseover', (event, d: Node) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`Node: ${d.tag}<br>Holders: ${d.holdersCount}`)
        .style('left', `${event.pageX + 5}px`)
        .style('top', `${event.pageY - 28}px`);
    }).on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });

    svg.selectAll('.link').on('mouseover', function(event, d) {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`Common Holders: ${(d as Link).value}`)
        .style('left', `${event.pageX + 5}px`)
        .style('top', `${event.pageY - 28}px`);
    }).on('mouseout', function() {
      tooltip.transition().duration(500).style('opacity', 0);
    });

    const drawPatterns = (tokenCount: number) => {
      if (!analysisResults.tokenCombinations[tokenCount]) return;

      console.log(`Drawing patterns for ${tokenCount} tokens`);

      // Remove previously drawn patterns
      svg.selectAll('.pattern').remove();

      const combinations = analysisResults.tokenCombinations[tokenCount];

      Object.keys(combinations).forEach((combinationKey, index) => {
        const tokenIds = combinationKey.split('-');
        const positions = tokenIds.map(tokenId => {
          const position = nodeData.find(n => n?.id === tokenId);
          console.log(`Token ID: ${tokenId}, Position X: ${position?.x}, Position Y: ${position?.y}`); // Debugging: Check positions
          return position;
        });

        if (positions.every(position => position !== undefined)) {
          // Sort positions based on their angle to maintain order
          const sortedPositions = positions.sort((a, b) => (a!.angle - b!.angle));

          const pathData: [number, number][] = sortedPositions.map(pos => [pos!.x, pos!.y]);
          pathData.push([sortedPositions[0]!.x, sortedPositions[0]!.y]); // Close the path

          console.log('Drawing path:', pathData);

          svg.append('path')
            .attr('d', d3.line<[number, number]>()(pathData)!)
            .attr('class', 'pattern')
            .attr('fill', 'none')
            .attr('stroke', colorScale(index.toString())) // Use color scale
            .attr('stroke-opacity', 0.9) // Make the pattern more opaque
            .attr('stroke-width', 4); // Make the pattern thicker
        }
      });
    };

    if (clickTokenCount !== null && clickTokenCount !== undefined) {
      drawPatterns(clickTokenCount);
    }

    return () => {
      tooltip.remove();
    };
  }, [nodes, analysisResults, linkColorScale, clickTokenCount]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 900;
    const height = 540;
    const radius = Math.min(width, height) / 2 - 40;
    const angleStep = (2 * Math.PI) / nodes.length;
    const centerX = width / 2;
    const centerY = height / 2;

    const nodeData = nodes.map((node, index) => ({
      id: node.address,
      tag: node.tag,
      holdersCount: analysisResults.holderCounts[node.address] || 0,
      angle: index * angleStep,
      x: radius * Math.cos(index * angleStep - Math.PI / 2),
      y: radius * Math.sin(index * angleStep - Math.PI / 2),
    }));

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const handleHoverTokenCount = (tokenCount: number) => {
      // Dim all links
      svg.selectAll('.link').attr('opacity', 0);

      // Dim all nodes but keep them slightly visible
      svg.selectAll('.node circle').attr('opacity', 0.2);

      // Remove existing patterns
      svg.selectAll('.pattern').remove();

      drawPatterns(tokenCount);
    };

    const handleLeaveTokenCount = () => {
      svg.selectAll('.link')
        .attr('stroke-opacity', 0.9)
        .attr('stroke-width', d => Math.sqrt((d as Link).value) / 4)
        .attr('stroke', d => linkColorScale((d as Link).value))
        .attr('opacity', 1); // Restore link opacity

      svg.selectAll('.node circle').attr('opacity', 1); // Restore node opacity

      svg.selectAll('.pattern').remove(); // Remove patterns when leaving hover
    };

    const drawPatterns = (tokenCount: number) => {
      if (!analysisResults.tokenCombinations[tokenCount]) return;

      console.log(`Drawing patterns for ${tokenCount} tokens`);

      // Remove previously drawn patterns
      svg.selectAll('.pattern').remove();

      const combinations = analysisResults.tokenCombinations[tokenCount];

      Object.keys(combinations).forEach((combinationKey, index) => {
        const tokenIds = combinationKey.split('-');
        const positions = tokenIds.map(tokenId => {
          const position = nodeData.find(n => n?.id === tokenId);
          console.log(`Token ID: ${tokenId}, Position X: ${position?.x}, Position Y: ${position?.y}`); // Debugging: Check positions
          return position;
        });

        if (positions.every(position => position !== undefined)) {
          // Sort positions based on their angle to maintain order
          const sortedPositions = positions.sort((a, b) => (a!.angle - b!.angle));

          const pathData: [number, number][] = sortedPositions.map(pos => [pos!.x + centerX, pos!.y + centerY]);
          pathData.push([sortedPositions[0]!.x + centerX, sortedPositions[0]!.y + centerY]); // Close the path

          console.log('Drawing path:', pathData);

          svg.append('path')
            .attr('d', d3.line<[number, number]>()(pathData)!)
            .attr('class', 'pattern')
            .attr('fill', 'none')
            .attr('stroke', colorScale(index.toString())) // Use color scale
            .attr('stroke-opacity', 0.9) // Make the pattern more opaque
            .attr('stroke-width', 4); // Make the pattern thicker
        }
      });
    };

    if (hoverTokenCount !== null && hoverTokenCount !== undefined) {
      handleHoverTokenCount(hoverTokenCount);
    } else {
      handleLeaveTokenCount();
    }
  }, [hoverTokenCount, linkColorScale, nodes, analysisResults]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', paddingBottom: '20px' }}>
        Contract Relationships
      </Typography>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default AstroChart;
