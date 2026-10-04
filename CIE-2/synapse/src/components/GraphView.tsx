'use dom';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Note, NoteLink } from '@/lib/types';

interface GraphViewProps {
  notes: Note[];
  links: NoteLink[];
  onNodeClick?: (noteId: string) => void;
  dom?: import('expo/dom').DOMProps;
}

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  val: number;
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum;
  target: string | NodeDatum;
}

export default function GraphView({ notes, links, onNodeClick }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear old graph
    containerRef.current.innerHTML = '';

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const nodes: NodeDatum[] = notes.map((n) => ({
      id: n.id,
      title: n.title || 'Untitled',
      val: (links.filter(l => l.source_id === n.id || l.target_id === n.id).length) + 1,
    }));

    const graphLinks: LinkDatum[] = links.map((l) => ({
      source: l.source_id,
      target: l.target_id,
    }));

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.1, 4]).on('zoom', (event) => {
        g.attr('transform', event.transform);
      }));

    const g = svg.append('g');

    const simulation = d3.forceSimulation<NodeDatum>(nodes)
      .force('link', d3.forceLink<NodeDatum, LinkDatum>(graphLinks).id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius((d: any) => d.val * 4 + 10));

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(graphLinks)
      .enter()
      .append('line')
      .attr('stroke', 'var(--link-stroke)')
      .attr('stroke-width', 1.5);

    // Nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => Math.min(d.val * 3 + 6, 24))
      .attr('fill', (d, i) => {
        const colors = ['var(--node-fill-1)', 'var(--node-fill-2)', 'var(--node-fill-3)'];
        return colors[i % colors.length];
      })
      .attr('stroke', 'var(--node-stroke)')
      .attr('stroke-width', 2.5)
      .call(d3.drag<SVGCircleElement, NodeDatum>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any)
      .on('click', (event, d) => {
        if (onNodeClick) onNodeClick(d.id);
      })
      .style('cursor', 'pointer');

    // Labels
    const label = g.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d) => d.title)
      .attr('font-size', (d) => Math.min(d.val + 10, 15) + 'px')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('font-weight', '500')
      .attr('fill', 'var(--text-fill)')
      .attr('dx', (d) => Math.min(d.val * 3 + 6, 24) + 8)
      .attr('dy', 5)
      .style('pointer-events', 'none')
      .style('text-shadow', '0px 0px 4px var(--text-shadow), 0px 0px 4px var(--text-shadow), 0px 0px 4px var(--text-shadow)');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [notes, links]);

  return (
    <>
      <style>{`
        :root {
          --link-stroke: rgba(0, 0, 0, 0.15);
          --node-stroke: #EBE9E1;
          --node-fill-1: #1C1C1C;
          --node-fill-2: #FF6B35;
          --node-fill-3: #D4A336;
          --text-fill: #1C1C1C;
          --text-shadow: #EBE9E1;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --link-stroke: rgba(255, 255, 255, 0.2);
            --node-stroke: #1C1C1C;
            --node-fill-1: #404040;
            --node-fill-2: #FF6B35;
            --node-fill-3: #D4A336;
            --text-fill: #EBE9E1;
            --text-shadow: #1C1C1C;
          }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
        .graph-container { width: 100%; height: 100vh; }
      `}</style>
      <div ref={containerRef} className="graph-container" />
    </>
  );
}
