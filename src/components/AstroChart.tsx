import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Typography, Box, Button } from '@mui/material';
import { AnalysisResults } from '../components/analysisService';
import CSVExport from '../components/CSVExport';

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
  setClickTokenCount: (count: number | null) => void;
}

const AstroChart: React.FC<AstroChartProps> = ({ nodes = [], analysisResults, hoverTokenCount, clickTokenCount, setClickTokenCount }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedHolders, setSelectedHolders] = useState<Set<string> | null>(null);
  const [viewState, setViewState] = useState<'Node Relationship View' | 'Token Combination View'>('Node Relationship View');

  const linkColorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(analysisResults.linkData, d => d.value) || 1]);

  // General Configuration
  const width = 900;
  const height = 540;
  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;

  // Initialize SVG
  useEffect(() => {
    if (!nodes.length || !analysisResults.linkData.length) return;

    const angleStep = (2 * Math.PI) / nodes.length;
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#000')
      .append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    // Node Data Preparation
    const nodeData: Node[] = nodes.map((node, index) => ({
      id: node.address,
      tag: node.tag,
      holdersCount: analysisResults.holderCounts[node.address] || 0,
      angle: index * angleStep,
      x: radius * Math.cos(index * angleStep - Math.PI / 2),
      y: radius * Math.sin(index * angleStep - Math.PI / 2),
    }));

    console.log('AstroChart Node Data:', nodeData);

    // Link Data Preparation
    const linkData: Link[] = analysisResults.linkData.map(link => ({
      ...link,
      source: nodeData.find(n => n?.id === link.source)!,
      target: nodeData.find(n => n?.id === link.target)!,
    })).filter(link => link.source && link.target);

    console.log('AstroChart Link Data:', linkData);

    // Draw Links (Node Relationship View)
    if (viewState === 'Node Relationship View') {
      svg.append('g')
        .selectAll('path')
        .data(linkData)
        .enter().append('path')
        .attr('class', 'link')
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
    }

    // Draw Nodes
    const nodesGroup = svg.append('g')
      .selectAll('g')
      .data(nodeData)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('click', function(event, d: Node) {
        console.log(`AstroChart Clicked node: ${d.tag}`);
      });

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

    if (viewState === 'Node Relationship View') {
      svg.selectAll('.link').on('mouseover', function(event, d) {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`Common Holders: ${(d as Link).value}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      }).on('mouseout', function() {
        tooltip.transition().duration(500).style('opacity', 0);
      });
    }

    // Function to Draw Patterns for Token Combinations (Token Combination View)
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
          console.log(`Token ID: ${tokenId}, Position X: ${position?.x}, Position Y: ${position?.y}`);
          return position;
        });

        if (positions.every(position => position !== undefined)) {
          const sortedPositions = positions.sort((a, b) => (a!.angle - b!.angle));
          const pathData: [number, number][] = sortedPositions.map(pos => [pos!.x, pos!.y]);
          pathData.push([sortedPositions[0]!.x, sortedPositions[0]!.y]);

          console.log('Drawing path:', pathData);

          svg.append('path')
            .attr('d', d3.line<[number, number]>()(pathData)!)
            .attr('class', 'pattern')
            .attr('fill', 'none')
            .attr('stroke', colorScale(index.toString()))
            .attr('stroke-opacity', 0.9)
            .attr('stroke-width', 4);
        }
      });
    };

    if (viewState === 'Token Combination View' && clickTokenCount !== null && clickTokenCount !== undefined) {
      drawPatterns(clickTokenCount);
    }

    return () => {
      tooltip.remove();
    };
  }, [nodes, analysisResults, linkColorScale, clickTokenCount, viewState]);

  // Handle Hover Effects for Token Counts
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const angleStep = (2 * Math.PI) / nodes.length;

    const nodeData = nodes.map((node, index) => ({
      id: node.address,
      tag: node.tag,
      holdersCount: analysisResults.holderCounts[node.address] || 0,
      angle: index * angleStep,
      x: radius * Math.cos(index * angleStep - Math.PI / 2),
      y: radius * Math.sin(index * angleStep - Math.PI / 2),
    }));

    const handleHoverTokenCount = (tokenCount: number) => {
      if (viewState === 'Token Combination View') return;

      svg.selectAll('.link').attr('opacity', 0);
      svg.selectAll('.node circle').attr('opacity', 0.2);
      svg.selectAll('.pattern').remove();
      drawPatterns(tokenCount);
    };

    const handleLeaveTokenCount = () => {
      if (viewState === 'Token Combination View') return;

      svg.selectAll('.link').attr('stroke-opacity', 0.9).attr('stroke-width', d => Math.sqrt((d as Link).value) / 4).attr('stroke', d => linkColorScale((d as Link).value)).attr('opacity', 1);
      svg.selectAll('.node circle').attr('opacity', 1);
      svg.selectAll('.pattern').remove();
    };

    const drawPatterns = (tokenCount: number) => {
      if (!analysisResults.tokenCombinations[tokenCount]) return;

      console.log(`Drawing patterns for ${tokenCount} tokens`);

      svg.selectAll('.pattern').remove();

      const combinations = analysisResults.tokenCombinations[tokenCount];

      Object.keys(combinations).forEach((combinationKey, index) => {
        const tokenIds = combinationKey.split('-');
        const positions = tokenIds.map(tokenId => {
          const position = nodeData.find(n => n?.id === tokenId);
          console.log(`Token ID: ${tokenId}, Position X: ${position?.x}, Position Y: ${position?.y}`);
          return position;
        });

        if (positions.every(position => position !== undefined)) {
          const sortedPositions = positions.sort((a, b) => (a!.angle - b!.angle));
          const pathData: [number, number][] = sortedPositions.map(pos => [pos!.x + centerX, pos!.y + centerY]);
          pathData.push([sortedPositions[0]!.x + centerX, sortedPositions[0]!.y + centerY]);

          console.log('Drawing path:', pathData);

          svg.append('path')
            .attr('d', d3.line<[number, number]>()(pathData)!)
            .attr('class', 'pattern')
            .attr('fill', 'none')
            .attr('stroke', d3.scaleOrdinal(d3.schemeCategory10)(index.toString())!)
            .attr('stroke-opacity', 0.9)
            .attr('stroke-width', 4);
        }
      });
    };

    if (hoverTokenCount !== null && hoverTokenCount !== undefined) {
      handleHoverTokenCount(hoverTokenCount);
    } else {
      handleLeaveTokenCount();
    }
  }, [hoverTokenCount, linkColorScale, nodes, analysisResults, viewState]);

  // Handle Selected Holders State
  useEffect(() => {
    if (clickTokenCount !== null && clickTokenCount !== undefined) {
      setViewState('Token Combination View');
      const tokenCombinations = analysisResults.tokenCombinations[clickTokenCount];

      // Check if tokenCombinations is defined
      if (tokenCombinations) {
        console.log('Token Combinations:', tokenCombinations);

        // Flatten the combinations and create a set of holders
        const holders = new Set<string>();
        Object.values(tokenCombinations).forEach((comb: Set<string>) => {
          comb.forEach(holder => holders.add(holder));
        });

        setSelectedHolders(holders);
      } else {
        setSelectedHolders(null);
      }
    } else {
      setViewState('Node Relationship View');
      setSelectedHolders(null);
    }
  }, [clickTokenCount, analysisResults.tokenCombinations]);

  // Handle Click Outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (svgRef.current && !(svgRef.current as unknown as Element).contains(event.target as Element)) {
      setClickTokenCount(null);
    }
  }, [setClickTokenCount]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', paddingBottom: '20px' }}>
        Contract Relationships ({viewState})
      </Typography>
      <svg ref={svgRef}></svg>
      {selectedHolders && (
        <Box mt={2}>
          <Typography variant="h6">Selected Group Holders:</Typography>
          <ul>
            {Array.from(selectedHolders).map(holder => (
              <li key={holder}>{holder}</li>
            ))}
          </ul>
          <Button
            onClick={() => CSVExport({ data: Array.from(selectedHolders), filename: 'selected_holders.csv' })}
            variant="contained"
            color="primary"
          >
            Export List
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AstroChart;

