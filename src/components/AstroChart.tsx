'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Typography, Box } from '@mui/material';

interface Node {
  id: string;
  holdersCount: number;
  angle: number;
  x?: number;
  y?: number;
}

interface Link {
  source: Node;
  target: Node;
  value: number;
}

interface AstroChartProps {
  nodes: { address: string; tag: string }[];
  holdersData: { address: string; holders: Set<string> }[];
  onHoverTokenCount?: number | null;
  onClickTokenCount?: number | null;
}

const AstroChart: React.FC<AstroChartProps> = ({ nodes = [], holdersData = [], onHoverTokenCount, onClickTokenCount }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!nodes.length || !holdersData.length) return;

    const width = 960;
    const height = 600;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const angleStep = (2 * Math.PI) / nodes.length;

    // Prepare node data with angles for placement
    const nodeData: Node[] = nodes.map((node, index) => ({
      id: node.tag,
      holdersCount: holdersData[index] ? holdersData[index].holders.size : 0,
      angle: index * angleStep,
    }));

    // Calculate positions based on angles
    nodeData.forEach(node => {
      node.x = radius * Math.cos(node.angle - Math.PI / 2);
      node.y = radius * Math.sin(node.angle - Math.PI / 2);
    });

    // Prepare link data for all pairwise relationships
    const linkData: Link[] = [];
    for (let i = 0; i < holdersData.length; i++) {
      for (let j = i + 1; j < holdersData.length; j++) {
        const commonHolders = Array.from(holdersData[i].holders).filter(holder => holdersData[j].holders.has(holder)).length;
        if (commonHolders > 0) {
          linkData.push({
            source: nodeData[i],
            target: nodeData[j],
            value: commonHolders,
          });
        }
      }
    }

    // Color scale for links based on common holders
    const linkColorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(linkData, d => d.value) || 1]);

    // Color scale for nodes based on holdersCount
    const nodeColorScale = d3.scaleSequential(d3.interpolateWarm)
      .domain([0, d3.max(nodeData, d => d.holdersCount) || 1]);

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '8px')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Create links
    svg.append('g')
      .selectAll('line')
      .data(linkData)
      .enter().append('line')
      .attr('class', d => `link link-${d.value}`)
      .attr('x1', d => d.source.x!)
      .attr('y1', d => d.source.y!)
      .attr('x2', d => d.target.x!)
      .attr('y2', d => d.target.y!)
      .attr('stroke-width', d => Math.sqrt(d.value))
      .attr('stroke', d => {
        const color = linkColorScale(d.value);
        return color || '';
      })
      .attr('data-original-stroke', d => {
        const color = linkColorScale(d.value);
        return color || '';
      })
      .attr('stroke-opacity', 0.6)
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`Source: ${d.source.id}<br>Target: ${d.target.id}<br>Common Holders: ${d.value}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Create nodes
    svg.append('g')
      .selectAll('circle')
      .data(nodeData)
      .enter().append('circle')
      .attr('cx', d => d.x!)
      .attr('cy', d => d.y!)
      .attr('r', 10)
      .attr('fill', d => nodeColorScale(d.holdersCount)!)
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`Node: ${d.id}<br>Holders: ${d.holdersCount}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Remove tooltip on unmount
    return () => {
      tooltip.remove();
    };

  }, [nodes, holdersData]);

  useEffect(() => {
    const handleHoverTokenCount = (tokenCount: number) => {
      d3.selectAll('.link')
        .attr('stroke-opacity', 0.1);

      d3.selectAll(`.link-${tokenCount}`)
        .attr('stroke-opacity', 0.6)
        .attr('stroke', '#ff0');
    };

    const handleLeaveTokenCount = () => {
      d3.selectAll('.link')
        .attr('stroke-opacity', 0.6)
        .attr('stroke', function() {
          return d3.select(this).attr('data-original-stroke')!;
        });
    };

    if (onHoverTokenCount !== null && onHoverTokenCount !== undefined) {
      handleHoverTokenCount(onHoverTokenCount);
    }
  }, [onHoverTokenCount]);

  useEffect(() => {
    const handleClickTokenCount = (tokenCount: number) => {
      d3.selectAll('.link')
        .attr('stroke-opacity', 0.1);

      d3.selectAll(`.link-${tokenCount}`)
        .attr('stroke-opacity', 0.6)
        .attr('stroke', '#ff0');
    };

    if (onClickTokenCount !== null && onClickTokenCount !== undefined) {
      handleClickTokenCount(onClickTokenCount);
    }
  }, [onClickTokenCount]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        AstroChart
      </Typography>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default AstroChart;
