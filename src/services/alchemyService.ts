import { Alchemy, Network, AssetTransfersCategory } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Your Alchemy API Key
  network: Network.BASE_MAINNET, // Update this to the appropriate network for Base if necessary
};

const alchemy = new Alchemy(settings);

export const getNftHolders = async (contractAddress: string) => {
  if (!contractAddress) {
    throw new Error('Contract address is required');
  }

  try {
    const holders = await alchemy.nft.getOwnersForContract(contractAddress);
    return holders.owners;
  } catch (error) {
    console.error('Alchemy API error:', error);
    return [];
  }
};

export const getTokenOwnership = async (addresses: string[], holders: string[]) => {
  const ownershipData: { [address: string]: string[] } = {};

  for (const address of addresses) {
    ownershipData[address] = [];

    for (const holder of holders) {
      try {
        const balance = await alchemy.core.getTokenBalances(holder, [address]);
        if (balance.tokenBalances[0].tokenBalance !== '0x0') {
          ownershipData[address].push(holder);
        }
      } catch (error) {
        console.error(`Error fetching token balance for ${holder}:`, error);
      }
    }
  }

  return ownershipData;
};

export const getTokenTransferEvents = async (contractAddresses: string[], holder: string) => {
  try {
    console.log(`Fetching transfers for holder: ${holder}, contracts: ${contractAddresses}`);
    const transfers = await alchemy.core.getAssetTransfers({
      toAddress: holder,
      contractAddresses: contractAddresses,
      category: [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155],
    });
    console.log(`Transfers for holder ${holder}:`, transfers.transfers);
    return transfers.transfers;
  } catch (error) {
    console.error('Error fetching transfer events:', error);
    return [];
  }
};