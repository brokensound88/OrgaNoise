import { ImageDimensions } from './types';

export const defaultBreakpoints = [640, 768, 1024, 1280, 1536];

export function generateSrcSet(src: string, dimensions: ImageDimensions[]): string {
  return dimensions
    .map(({ width, height }) => 
      `${addImageParams(src, { width, height })} ${width}w`
    )
    .join(', ');
}

export function addImageParams(src: string, dimensions: ImageDimensions): string {
  const url = new URL(src);
  url.searchParams.set('w', dimensions.width.toString());
  url.searchParams.set('h', dimensions.height.toString());
  return url.toString();
}