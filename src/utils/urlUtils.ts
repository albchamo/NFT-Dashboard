import { useRouter } from 'next/navigation';

export const updateUrlParams = (router: any, nodes: { address: string; tag: string }[]) => {
    const encodedNodes = encodeURIComponent(JSON.stringify(nodes));
    router.push(`?contracts=${encodedNodes}`, undefined, { shallow: true });
  };
  
  export const getNodesFromUrl = (): { address: string; tag: string }[] => {
    if (typeof window === 'undefined') return [{ address: '', tag: '' }];
  
    const params = new URLSearchParams(window.location.search);
    const encodedNodes = params.get('contracts');
    return encodedNodes ? JSON.parse(decodeURIComponent(encodedNodes)) : [{ address: '', tag: '' }];
  };
  