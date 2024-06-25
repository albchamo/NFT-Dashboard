// AlchemyService.ts

import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Your Alchemy API Key
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

const logError = (error: any, message: string) => {
  console.error(`${message}:`, error);
};

export const getHolders = async (contractAddress: string): Promise<Set<string>> => {
  if (!contractAddress) {
    throw new Error('Contract address is required');
  }

  try {
    const holders = await alchemy.nft.getOwnersForContract(contractAddress);
    return new Set<string>(holders.owners);
  } catch (error) {
    logError(error, `Error fetching holders for contract ${contractAddress}`);
    return new Set<string>();
  }
};

export const getAllHolders = async (
  mainContractAddress: string,
  otherContracts: { address: string; tag: string }[]
): Promise<{ allHolders: { [address: string]: Set<string> } }> => {
  const allHolders: { [address: string]: Set<string> } = {};

  allHolders[mainContractAddress] = await getHolders(mainContractAddress);

  for (const contract of otherContracts) {
    allHolders[contract.address] = await getHolders(contract.address);
  }

  return { allHolders };
};

export const getContractMetadata = async (contractAddress: string) => {
  if (!contractAddress) {
    throw new Error('Contract address is required');
  }

  try {
    const metadata = await alchemy.core.getTokenMetadata(contractAddress);
    return metadata;
  } catch (error) {
    logError(error, `Error fetching metadata for contract ${contractAddress}`);
    return null;
  }
};
