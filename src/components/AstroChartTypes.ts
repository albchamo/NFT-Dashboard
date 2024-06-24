export interface Node {
    id: string;
    tag: string;
    holdersCount: number;
    angle: number;
    x: number;
    y: number;
  }
  
  export interface Link {
    source: Node;
    target: Node;
    value: number;
    addresses: string[];
  }
  
  export interface TokenCombination {
    [key: number]: {
      [key: string]: Set<string>;
    };
  }
  