export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageFormat {
  format: 'webp' | 'jpeg' | 'png' | 'avif';
  quality: number;
}

export interface ImageOptimizationOptions {
  dimensions?: ImageDimensions;
  formats?: ImageFormat[];
  lazy?: boolean;
  placeholder?: boolean;
}

export interface OptimizedImage {
  src: string;
  srcSet: string;
  placeholder?: string;
  width: number;
  height: number;
}