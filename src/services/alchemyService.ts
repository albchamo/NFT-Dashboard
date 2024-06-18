// AlchemyService.ts

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
): Promise<{ allHolders: { [address: string]: Set<string> }, detailedConnections: { [holder: string]: string[] } }> => {
  const allHolders: { [address: string]: Set<string> } = {};
  const detailedConnections: { [holder: string]: string[] } = {};

  const mainHolders = await getHolders(mainContractAddress);
  allHolders[mainContractAddress] = mainHolders;

  for (const contract of otherContracts) {
    console.log(`Fetching holders for contract: ${contract.address}`);

    try {
      const holders = await alchemy.nft.getOwnersForContract(contract.address);
      allHolders[contract.address] = new Set<string>(holders.owners);
      console.log(`Holders for ${contract.address}:`, holders.owners);
    } catch (error) {
      console.error(`Error fetching holders for contract ${contract.address}:`, error);
      allHolders[contract.address] = new Set<string>();
    }
  }

  return { allHolders, detailedConnections };
};

export const getContractMetadata = async (contractAddress: string) => {
  if (!contractAddress) {
    throw new Error('Contract address is required');
  }

  console.log(`Fetching metadata for contract: ${contractAddress}`);

  try {
    const metadata = await alchemy.core.getTokenMetadata(contractAddress);
    console.log(`Metadata for ${contractAddress}:`, metadata);
    return metadata;
  } catch (error) {
    console.error(`Error fetching metadata for contract ${contractAddress}:`, error);
    return null;
  }
};

