import { useEffect } from 'react';

import { getAssetUrl } from '@/utils';

const preloadImageMap = new Map();

export const usePreloadImages = (imageSources: string[]) => {
  useEffect(() => {
    for (const src of imageSources) {
      if (!preloadImageMap.has(src)) {
        preloadImageMap.set(src, true);
        const img = new Image();
        img.src = getAssetUrl(src);
      }
    }
  }, [imageSources]);
};
