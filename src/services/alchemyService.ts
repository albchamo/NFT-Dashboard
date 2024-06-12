import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Your Alchemy API Key
  network: Network.BASE_MAINNET, // Update this to the appropriate network for Base if necessary
};

const alchemy = new Alchemy(settings);

export const getHolders = async (contractAddress: string): Promise<Set<string>> => {
  if (!contractAddress) {
    throw new Error('Contract address is required');
  }

  try {
    const holdersResponse = await alchemy.nft.getOwnersForContract(contractAddress);
    return new Set(holdersResponse.owners);
  } catch (error) {
    console.error('Alchemy API error:', error);
    return new Set();
  }
};

interface ContractWithTag {
  address: string;
  tag: string;
}

interface HolderAnalysisResult {
  totalMainHolders: number;
  holdersWithAllTokens: number;
  holdersWithSomeTokens: number;
  holdersWithNoOtherTokens: number;
  tokenHoldingCounts: { [key: number]: number }; // Detailed breakdown
}

export const getAllHolders = async (mainContract: string, otherContracts: ContractWithTag[]): Promise<{ mainHolders: Set<string>, otherHolders: { [address: string]: { holders: Set<string>, tag: string } } }> => {
  const mainHoldersPromise = getHolders(mainContract);
  const otherHoldersPromises = otherContracts.map(contract => getHolders(contract.address));

  const [mainHolders, ...otherHoldersArray] = await Promise.all([mainHoldersPromise, ...otherHoldersPromises]);

  const otherHolders = otherContracts.reduce((acc, contract, index) => {
    acc[contract.address] = { holders: otherHoldersArray[index], tag: contract.tag };
    return acc;
  }, {} as { [address: string]: { holders: Set<string>, tag: string } });

  return { mainHolders, otherHolders };
};

export const analyzeHolders = (mainHolders: Set<string>, otherHolders: { [address: string]: { holders: Set<string>, tag: string } }): HolderAnalysisResult => {
  const totalContracts = Object.keys(otherHolders).length;
  const analysisResults: HolderAnalysisResult = {
    totalMainHolders: mainHolders.size,
    holdersWithAllTokens: 0,
    holdersWithSomeTokens: 0,
    holdersWithNoOtherTokens: 0,
    tokenHoldingCounts: {}, // Initialize the detailed breakdown
  };

  for (let i = 0; i <= totalContracts; i++) {
    analysisResults.tokenHoldingCounts[i] = 0; // Initialize the count for each possible number of tokens
  }

  mainHolders.forEach(holder => {
    const holdingContracts = Object.keys(otherHolders).filter(contract => otherHolders[contract].holders.has(holder)).length;
    analysisResults.tokenHoldingCounts[holdingContracts] += 1;
    
    if (holdingContracts === totalContracts) {
      analysisResults.holdersWithAllTokens += 1;
    } else if (holdingContracts > 0) {
      analysisResults.holdersWithSomeTokens += 1;
    } else {
      analysisResults.holdersWithNoOtherTokens += 1;
    }
  });

  return analysisResults;
};
