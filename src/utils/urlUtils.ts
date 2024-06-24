import { useRouter } from 'next/navigation';

export const getNodesFromUrl = (): { address: string; tag: string }[] => {
  if (typeof window === 'undefined') return [];

  const urlParams = new URLSearchParams(window.location.search);
  const contractsParam = urlParams.get('contracts');

  if (!contractsParam) return [];

  return contractsParam.split(';').map(contract => {
    const [address, tag] = contract.split(',');
    return { address, tag };
  });
};

export const updateUrlParams = (router: ReturnType<typeof useRouter>, nodes: { address: string; tag: string }[]) => {
  const contracts = nodes.map(node => `${node.address},${node.tag}`).join(';');
  const currentPath = window.location.pathname; // Get the current path from the window location

  // Update the URL
  const url = `${currentPath}?contracts=${contracts}`;
  router.replace(url);
};
