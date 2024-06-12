declare module 'd3-sankey' {
    import { SankeyNode, SankeyLink, SankeyLayout, SankeyGraph } from 'd3';
  
    export function sankey<NS, LS>(): SankeyLayout<NS, LS>;
    export function sankeyLinkHorizontal(): any;
  
    export interface SankeyNodeMinimal {
      x0?: number;
      x1?: number;
      y0?: number;
      y1?: number;
    }
  
    export interface SankeyLinkMinimal<NS, LS> {
      index?: number;
      width?: number;
      value: number;
      source: NS;
      target: NS;
    }
  
    export interface SankeyGraph<NS, LS> {
      nodes: NS[];
      links: LS[];
    }
  
    export interface SankeyLayout<NS, LS> {
      (graph: SankeyGraph<NS, LS>): SankeyGraph<NS, LS>;
      nodeWidth(): number;
      nodeWidth(width: number): this;
      nodePadding(): number;
      nodePadding(padding: number): this;
      extent(): [[number, number], [number, number]];
      extent(extent: [[number, number], [number, number]]): this;
    }
  }
  