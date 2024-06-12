import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Your Alchemy API Key
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

export const getHolders = async (contractAddress: string): Promise<Set<string>> => {
  if (!contractAddress) {
    throw new Error('Contract address is required');
  }

  console.log(`Fetching holders for contract: ${contractAddress}`);

  try {
    const holders = await alchemy.nft.getOwnersForContract(contractAddress);
    console.log(`Holders for ${contractAddress}:`, holders);
    return new Set<string>(holders.owners);
  } catch (error) {
    console.error(`Error fetching holders for contract ${contractAddress}:`, error);
    return new Set<string>();
  }
};

export const getAllHolders = async (
  mainContractAddress: string,
  otherContracts: { address: string; tag: string }[]
): Promise<{ otherHolders: { [address: string]: Set<string> } }> => {
  const otherHolders: { [address: string]: Set<string> } = {};

  await Promise.all(otherContracts.map(async contract => {
    console.log(`Fetching holders for contract: ${contract.address}`);

    try {
      const holders = await alchemy.nft.getOwnersForContract(contract.address);
      otherHolders[contract.address] = new Set<string>(holders.owners);
      console.log(`Holders for ${contract.address}:`, holders.owners);
    } catch (error) {
      console.error(`Error fetching holders for contract ${contract.address}:`, error);
      otherHolders[contract.address] = new Set<string>();
    }
  }));

  return { otherHolders };
};

export const analyzeHolders = (
  mainHolders: Set<string>,
  otherHolders: { [address: string]: Set<string> }
) => {
  let holdersWithAllTokens = 0;
  let holdersWithSomeTokens = 0;
  let holdersWithNoOtherTokens = 0;
  const tokenHoldingCounts: { [key: number]: number } = {};

  mainHolders.forEach(holder => {
    const tokensOwned = Object.values(otherHolders).filter(holdersSet => holdersSet.has(holder)).length;
    if (tokensOwned === Object.keys(otherHolders).length) {
      holdersWithAllTokens++;
    } else if (tokensOwned > 0) {
      holdersWithSomeTokens++;
    } else {
      holdersWithNoOtherTokens++;
    }
    tokenHoldingCounts[tokensOwned] = (tokenHoldingCounts[tokensOwned] || 0) + 1;
  });

  return {
    totalMainHolders: mainHolders.size,
    holdersWithAllTokens,
    holdersWithSomeTokens,
    holdersWithNoOtherTokens,
    tokenHoldingCounts,
  };
};
