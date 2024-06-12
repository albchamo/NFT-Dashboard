'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Typography, Box } from '@mui/material';

interface Node {
  id: string;
  holdersCount: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: Node;
  target: Node;
  value: number;
}

interface ForceDirectedGraphProps {
  nodes: { address: string; tag: string }[];
  holdersData: { address: string; holders: Set<string> }[];
}

const ForceDirectedGraph: React.FC<ForceDirectedGraphProps> = ({ nodes, holdersData }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 960;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f0f0f0')
      .style('margin-top', '20px');

    // Prepare node data
    const nodeData: Node[] = nodes.map((node, index) => ({
      id: node.tag,
      holdersCount: holdersData[index] ? holdersData[index].holders.size : 0,
    }));

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

    // Create simulation
    const simulation = d3.forceSimulation<Node, Link>(nodeData)
      .force('link', d3.forceLink<Node, Link>(linkData).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(linkData)
      .enter().append('line')
      .attr('stroke-width', d => Math.sqrt(d.value))
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodeData)
      .enter().append('circle')
      .attr('r', 5)
      .attr('fill', '#69b3a2')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodeData)
      .enter().append('text')
      .attr('dy', -10)
      .attr('text-anchor', 'middle')
      .text(d => d.id);

    // Update simulation on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });

    // Drag event handlers
    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [nodes, holdersData]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Force-Directed Graph
      </Typography>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default ForceDirectedGraph;
