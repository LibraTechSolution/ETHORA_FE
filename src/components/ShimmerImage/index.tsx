import NextImage, { ImageLoaderProps, ImageProps } from 'next/image';
import { PropsWithChildren, useState } from 'react';

import { getAssetUrl } from '@/utils';
import { AspectRatio, AspectRatioProps, Box, BoxProps, Skeleton } from '@chakra-ui/react';

type Props = ImageProps &
  BoxProps &
  Pick<AspectRatioProps, 'ratio'> & {
    disableLoading?: boolean;
    alt: string;
    fallbackSrc?: string;
  };

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const AspectRatioWrap = ({
  ratio,
  borderRadius,
  children,
}: PropsWithChildren & Pick<AspectRatioProps, 'ratio'> & Pick<AspectRatioProps, 'borderRadius'>) => {
  if (ratio === undefined) return children;
  return (
    <AspectRatio w="full" ratio={ratio} position="relative" overflow="hidden" borderRadius={borderRadius}>
      {children}
    </AspectRatio>
  );
};

const ShimmerImage: React.FC<Props> = (props) => {
  const {
    src,
    alt,
    fallbackSrc = 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png',
    bgGradient,
    priority,
    quality,
    ratio,
    disableLoading,
    ...rest
  } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleLoad = (result: { naturalWidth: number; naturalHeight: number }) => {
    if (result.naturalWidth === 0) setIsError(true);
    else setIsLoaded(true);
  };
  const handleError = () => setIsError(true);

  return (
    <Box {...rest}>
      <AspectRatioWrap ratio={ratio} borderRadius={props.borderRadius}>
        <Skeleton position="absolute" top="0" left="0" width="100%" height="100%" isLoaded={disableLoading || isLoaded}>
          <NextImage
            src={isError ? fallbackSrc : getAssetUrl(src)}
            loader={imageLoader}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            onLoadingComplete={handleLoad}
            onError={handleError}
            priority={priority}
            quality={quality}
          />
          <Box position="absolute" top="0" left="0" width="100%" height="100%" bgGradient={bgGradient} />
        </Skeleton>
      </AspectRatioWrap>
    </Box>
  );
};

export default ShimmerImage;
