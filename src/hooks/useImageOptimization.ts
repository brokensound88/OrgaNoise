import { useState, useEffect } from 'react';
import { ImageOptimizationOptions, OptimizedImage } from '../utils/images/types';
import { generateSrcSet, defaultBreakpoints } from '../utils/images/dimensions';

export function useImageOptimization(
  src: string,
  options: ImageOptimizationOptions = {}
): OptimizedImage | null {
  const [optimizedImage, setOptimizedImage] = useState<OptimizedImage | null>(null);

  useEffect(() => {
    if (!src) return;

    const dimensions = options.dimensions ? [options.dimensions] : 
      defaultBreakpoints.map(width => ({ width, height: Math.round(width * 9/16) }));

    const srcSet = generateSrcSet(src, dimensions);

    setOptimizedImage({
      src,
      srcSet,
      width: dimensions[0].width,
      height: dimensions[0].height,
    });
  }, [src, options]);

  return optimizedImage;
}