'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Typography, Box } from '@mui/material';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  address: string;
  holdersCount: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: Node;
  target: Node;
  value: number;
}

interface NodeVisualizationProps {
  nodes: { address: string; tag: string }[];
  holdersData: { address: string; holders: Set<string> }[];
}

const NodeVisualization: React.FC<NodeVisualizationProps> = ({ nodes, holdersData }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f0f0f0')
      .style('margin-top', '20px');

    const nodeData: Node[] = nodes.map((node, index) => {
      const holdersCount = holdersData[index] ? holdersData[index].holders.size : 0;
      return {
        id: node.tag,
        address: node.address,
        holdersCount,
      };
    });

    const linkData: Link[] = holdersData.slice(1).map((node, index) => {
      const sharedHoldersCount = Array.from(holdersData[0].holders).filter(holder => node.holders.has(holder)).length;
      return {
        source: nodeData[0],
        target: nodeData[index + 1],
        value: sharedHoldersCount,
      };
    });

    const simulation = d3.forceSimulation<Node>(nodeData)
      .force('link', d3.forceLink<Node, Link>(linkData).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    svg.selectAll('*').remove();

    const link = svg.append('g')
      .selectAll('line')
      .data(linkData)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodeData)
      .enter().append('circle')
      .attr('r', d => Math.sqrt(d.holdersCount) * 5)
      .attr('fill', '#69b3a2')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', (event, d) => dragstarted(event, d))
        .on('drag', (event, d) => dragged(event, d))
        .on('end', (event, d) => dragended(event, d)));

    node.append('title')
      .text(d => `${d.id}\n${d.address}\nHolders: ${d.holdersCount}`);

    const text = svg.append('g')
      .selectAll('text')
      .data(nodeData)
      .enter().append('text')
      .attr('dy', -3)
      .attr('text-anchor', 'middle')
      .text(d => d.id);

    const edgeLabels = svg.append('g')
      .selectAll('text')
      .data(linkData)
      .enter().append('text')
      .attr('dy', -3)
      .attr('text-anchor', 'middle')
      .text(d => d.value);

    simulation
      .nodes(nodeData)
      .on('tick', ticked);

    simulation.force<d3.ForceLink<Node, Link>>('link')!.links(linkData);

    function ticked() {
      link
        .attr('x1', d => (d.source as Node).x as number)
        .attr('y1', d => (d.source as Node).y as number)
        .attr('x2', d => (d.target as Node).x as number)
        .attr('y2', d => (d.target as Node).y as number);

      node
        .attr('cx', d => d.x as number)
        .attr('cy', d => d.y as number);

      text
        .attr('x', d => d.x as number)
        .attr('y', d => (d.y as number) - 25);

      edgeLabels
        .attr('x', d => (((d.source as Node).x as number) + ((d.target as Node).x as number)) / 2)
        .attr('y', d => (((d.source as Node).y as number) + ((d.target as Node).y as number)) / 2)
        .text(d => d.value);
    }

    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [nodes, holdersData]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Node Visualization
      </Typography>
      <svg ref={svgRef}></svg>
    </Box>
  );
};

export default NodeVisualization;
