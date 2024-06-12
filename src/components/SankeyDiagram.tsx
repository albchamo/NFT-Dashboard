'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal, SankeyNodeMinimal, SankeyLinkMinimal } from 'd3-sankey';
import { Typography, Box } from '@mui/material';

interface Node extends SankeyNodeMinimal {
  name: string;
  holdersCount: number;
}

interface Link extends SankeyLinkMinimal<Node, Node> {
  value: number;
}

interface SankeyDiagramProps {
  nodes: { address: string; tag: string }[];
  holdersData: { address: string; holders: Set<string> }[];
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ nodes, holdersData }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 960;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f0f0f0')
      .style('margin-top', '20px');

    const nodeData: Node[] = nodes.map((node, index) => ({
      name: node.tag,
      holdersCount: holdersData[index] ? holdersData[index].holders.size : 0,
    }));

    const linkData: Link[] = holdersData.slice(1).map((node, index) => ({
      source: nodeData[0],
      target: nodeData[index + 1],
      value: Array.from(holdersData[0].holders).filter(holder => node.holders.has(holder)).length,
    }));

    const sankey = d3Sankey<Node, Link>()
      .nodeWidth(20)
      .nodePadding(20)
      .extent([[1, 1], [width - 1, height - 6]]);

    const { nodes: sankeyNodes, links: sankeyLinks } = sankey({
      nodes: nodeData,
      links: linkData,
    });

    svg.selectAll('*').remove();

    const link = svg.append('g')
      .selectAll<SVGPathElement, Link>('path')
      .data(sankeyLinks)
      .enter().append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', '#000')
      .attr('stroke-width', (d: Link) => Math.max(1, d.width || 1))
      .attr('fill', 'none');

    const node = svg.append('g')
      .selectAll<SVGRectElement, Node>('rect')
      .data(sankeyNodes)
      .enter().append('rect')
      .attr('x', (d: Node) => d.x0!)
      .attr('y', (d: Node) => d.y0!)
      .attr('height', (d: Node) => (d.y1! - d.y0!))
      .attr('width', sankey.nodeWidth())
      .attr('fill', '#69b3a2')
      .append('title')
      .text((d: Node) => `${d.name}\n${d.holdersCount}`);

    svg.append('g')
      .selectAll<SVGTextElement, Node>('text')
      .data(sankeyNodes)
      .enter().append('text')
      .attr('x', (d: Node) => d.x0! - 6)
      .attr('y', (d: Node) => (d.y0! + d.y1!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text((d: Node) => d.name)
      .filter((d: Node) => d.x0! < width / 2)
      .attr('x', (d: Node) => d.x1! + 6)
      .attr('text-anchor', 'start');
  }, [nodes, holdersData]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sankey Diagram
      </Typography>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default SankeyDiagram;
