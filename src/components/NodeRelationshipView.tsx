import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';
import { Node, Link } from './AstroChartTypes';

interface NodeRelationshipViewProps {
  nodes: Node[];
  links: Link[];
  linkColorScale: d3.ScaleSequential<string>;
  setExportListToLink: (link: Link) => void;
  resetExportList: () => void;
  selectedLink: Link | null;
  setSelectedLink: (link: Link | null) => void;
}

const NodeRelationshipView: React.FC<NodeRelationshipViewProps> = ({
  nodes,
  links,
  linkColorScale,
  setExportListToLink,
  resetExportList,
  selectedLink,
  setSelectedLink,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear previous elements
    svg.selectAll('*').remove();

    // General Configuration
    const parentNode = svg.node()?.parentNode as HTMLElement | null;
    const containerWidth = parentNode?.getBoundingClientRect().width || 900;
    const containerHeight = parentNode?.getBoundingClientRect().height || 540;
    const width = containerWidth;
    const height = containerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 30; // Adjust radius to fit better

    // Scale the node positions
    const scaledNodes = nodes.map((node, index) => ({
      ...node,
      x: radius * Math.cos(index * (2 * Math.PI / nodes.length) - Math.PI / 2),
      y: radius * Math.sin(index * (2 * Math.PI / nodes.length) - Math.PI / 2)
    }));

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background-color', '#000')
      .append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    // Draw Links
    g.append('g')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', (d: Link) => {
        const sourceNode = scaledNodes.find(node => node.id === d.source.id);
        const targetNode = scaledNodes.find(node => node.id === d.target.id);
        if (!sourceNode || !targetNode) return '';
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${sourceNode.x},${sourceNode.y}A${dr},${dr} 0 0,1 ${targetNode.x},${targetNode.y}`;
      })
      .attr('stroke-width', d => Math.sqrt(d.value) / 4)
      .attr('stroke', d => linkColorScale(d.value))
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.9)
      .on('click', function(event, d: Link) {
        if (selectedLink === d) {
          setSelectedLink(null);
          resetExportList();
        } else {
          setSelectedLink(d);
          setExportListToLink(d);
        }
      });

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

    return () => {
      tooltip.remove();
    };
  }, [nodes, links, linkColorScale, selectedLink, setSelectedLink, setExportListToLink, resetExportList]);

  return <Box width="100%" height="100%" overflow="hidden"><svg ref={svgRef}></svg></Box>;
};

export default NodeRelationshipView;
