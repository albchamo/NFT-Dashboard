export interface AnalysisResults {
  tokenHoldingCounts: { [key: number]: number };
  holdersByTokenCount: { [key: number]: Set<string> };
  holderCounts: { [address: string]: number };
  linkData: { source: string, target: string, value: number, addresses: string[] }[];
  tokenCombinations: { [key: number]: { [key: string]: Set<string> } };
}

export const analyzeHolders = (
  allHolders: { [address: string]: Set<string> }
): AnalysisResults => {
  const tokenHoldingCounts: { [key: number]: number } = {};
  const holdersByTokenCount: { [key: number]: Set<string> } = {};
  const holderCounts: { [address: string]: number } = {};
  const linkData: { source: string, target: string, value: number, addresses: string[] }[] = [];
  const tokenCombinations: { [key: number]: { [key: string]: Set<string> } } = {};

  const allHolderSet = new Set<string>();
  Object.values(allHolders).forEach(holdersSet => {
    holdersSet.forEach(holder => {
      allHolderSet.add(holder);
    });
  });

  allHolderSet.forEach(holder => {
    const tokensOwned = Object.values(allHolders).filter(holdersSet => holdersSet.has(holder)).length;
    tokenHoldingCounts[tokensOwned] = (tokenHoldingCounts[tokensOwned] || 0) + 1;
    if (!holdersByTokenCount[tokensOwned]) {
      holdersByTokenCount[tokensOwned] = new Set<string>();
    }
    holdersByTokenCount[tokensOwned].add(holder);
  });

  // Calculate holder counts and link data
  Object.keys(allHolders).forEach(address => {
    holderCounts[address] = allHolders[address].size;
  });

  const addresses = Object.keys(allHolders);
  for (let i = 0; i < addresses.length; i++) {
    for (let j = i + 1; j < addresses.length; j++) {
      const commonHolders = new Set(
        [...allHolders[addresses[i]]].filter(x => allHolders[addresses[j]].has(x))
      );
      if (commonHolders.size > 0) {
        linkData.push({ 
          source: addresses[i], 
          target: addresses[j], 
          value: commonHolders.size,
          addresses: Array.from(commonHolders) // Include common holders addresses
        });
      }
    }
  }

  // Generate data for token combinations of 3, 4, etc.
  allHolderSet.forEach(holder => {
    const tokens = Object.keys(allHolders).filter(address => allHolders[address].has(holder));
    if (tokens.length >= 3) {
      for (let size = 3; size <= tokens.length; size++) {
        if (!tokenCombinations[size]) {
          tokenCombinations[size] = {};
        }
        const combinations = getCombinations(tokens, size);
        combinations.forEach(combination => {
          const key = combination.sort().join('-');
          if (!tokenCombinations[size][key]) {
            tokenCombinations[size][key] = new Set<string>();
          }
          tokenCombinations[size][key].add(holder);
        });
      }
    }
  });

  return {
    tokenHoldingCounts,
    holdersByTokenCount,
    holderCounts,
    linkData,
    tokenCombinations,
  };
};

// Helper function to generate combinations
const getCombinations = (arr: string[], size: number): string[][] => {
  const result: string[][] = [];
  const f = (prefix: string[], arr: string[]): void => {
    if (prefix.length === size) {
      result.push(prefix);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      f([...prefix, arr[i]], arr.slice(i + 1));
    }
  };
  f([], arr);
  return result;
};
