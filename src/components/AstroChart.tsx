// AstroChart.tsx
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
}

const AstroChart: React.FC<AstroChartProps> = ({ nodes = [], analysisResults, hoverTokenCount }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const linkColorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(analysisResults.linkData, d => d.value) || 1]);

  useEffect(() => {
    if (!nodes.length || !analysisResults.linkData.length) return;

    const width = 900;
    const height = 540;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#000') // Dark background
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const angleStep = (2 * Math.PI) / nodes.length;

    const nodeData: Node[] = nodes.map((node, index) => ({
      id: node.address,
      tag: node.tag,
      holdersCount: analysisResults.holderCounts[node.address] || 0,
      angle: index * angleStep,
      x: radius * Math.cos(index * angleStep - Math.PI / 2),
      y: radius * Math.sin(index * angleStep - Math.PI / 2),
    }));

    const linkData: Link[] = analysisResults.linkData.map(link => ({
      ...link,
      source: nodeData.find(n => n.id === link.source)!,
      target: nodeData.find(n => n.id === link.target)!,
    }));

    const link = svg.append('g')
      .selectAll('path')
      .data(linkData)
      .enter().append('path')
      .attr('class', d => `link link-${d.value}`)
      .attr('d', d => {
        const dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      })
      .attr('stroke-width', d => Math.sqrt(d.value) / 4) // Adjusted line thickness
      .attr('stroke', d => linkColorScale(d.value))
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.9);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodeData)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', 10)
      .attr('fill', '#d80032') // Light color for nodes
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    node.append('text')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .text(d => d.tag)
      .style('fill', '#fff') // Light color for text
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

    node.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`Node: ${d.tag}<br>Holders: ${d.holdersCount}`)
        .style('left', `${event.pageX + 5}px`)
        .style('top', `${event.pageY - 28}px`);
    }).on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });

    link.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`Common Holders: ${d.value}`)
        .style('left', `${event.pageX + 5}px`)
        .style('top', `${event.pageY - 28}px`);
    }).on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });

    return () => {
      tooltip.remove();
    };
  }, [nodes, analysisResults, linkColorScale]);

  useEffect(() => {
    const handleHoverTokenCount = (tokenCount: number) => {
      d3.selectAll('.link')
        .attr('stroke-opacity', 0.1);

      d3.selectAll(`.link-${tokenCount}`)
        .attr('stroke-opacity', 0.9)
        .attr('stroke', '#ff0'); // Highlight color
    };

    const handleLeaveTokenCount = () => {
      d3.selectAll('.link')
        .attr('stroke-opacity', 0.9)
        .attr('stroke', d => linkColorScale(d.value));
    };

    if (hoverTokenCount !== null && hoverTokenCount !== undefined) {
      handleHoverTokenCount(hoverTokenCount);
    } else {
      handleLeaveTokenCount();
    }
  }, [hoverTokenCount, linkColorScale]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom  style= {{ textAlign: 'center' , paddingBottom: "20px"}}>
        Contract Relationships
      </Typography>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default AstroChart;
