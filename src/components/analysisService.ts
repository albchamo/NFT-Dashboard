export interface AnalysisResults {
  tokenHoldingCounts: { [key: number]: number };
  holdersByTokenCount: { [key: number]: Set<string> };
  holderCounts: { [address: string]: number };
  linkData: { source: string, target: string, value: number }[];
}

export const analyzeHolders = (
  allHolders: { [address: string]: Set<string> }
): AnalysisResults => {
  const tokenHoldingCounts: { [key: number]: number } = {};
  const holdersByTokenCount: { [key: number]: Set<string> } = {};
  const holderCounts: { [address: string]: number } = {};
  const linkData: { source: string, target: string, value: number }[] = [];

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
      ).size;
      if (commonHolders > 0) {
        linkData.push({ source: addresses[i], target: addresses[j], value: commonHolders });
      }
    }
  }

  return {
    tokenHoldingCounts,
    holdersByTokenCount,
    holderCounts,
    linkData,
  };
};
