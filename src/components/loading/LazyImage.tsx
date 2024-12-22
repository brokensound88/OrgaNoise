import React, { useState } from 'react';
import { Skeleton } from '../ui/loading/Skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  fallback,
  ...props 
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <>
      {isLoading && (fallback || <Skeleton className={className} />)}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'hidden' : ''}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          loading="lazy"
          {...props}
        />
      )}
    </>
  );
}