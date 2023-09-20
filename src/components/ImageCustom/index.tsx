import { getAssetUrl } from '@/utils';
import { forwardRef, Image, ImageProps } from '@chakra-ui/react';

export const ImageCustom = forwardRef<ImageProps, 'image'>(({ src, ...props }, ref) => {
  return <Image ref={ref} alt="" src={getAssetUrl(src)} {...props} />;
});
