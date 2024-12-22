import React from 'react';
import { LazyImage } from '../loading/LazyImage';
import { useImageOptimization } from '../../hooks/useImageOptimization';
import { ImageOptimizationOptions } from '../../utils/images/types';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  options?: ImageOptimizationOptions;
}

export function OptimizedImage({ 
  src, 
  options,
  alt = '',
  className = '',
  ...props 
}: OptimizedImageProps) {
  const optimized = useImageOptimization(src, options);

  if (!optimized) return null;

  return (
    <LazyImage
      src={optimized.src}
      srcSet={optimized.srcSet}
      width={optimized.width}
      height={optimized.height}
      alt={alt}
      className={className}
      {...props}
    />
  );
}