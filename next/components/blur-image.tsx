'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

// Lightweight SVG placeholder for blur effect
const PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect fill="%23e5e7eb" width="1" height="1"/%3E%3C/svg%3E';

export const BlurImage = ({
  src,
  width,
  height,
  alt,
  priority = false,
  className,
  ...rest
}: React.ComponentProps<typeof Image> & { priority?: boolean }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      className={cn(
        'transition duration-300',
        isLoading ? 'blur-sm' : 'blur-0',
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      placeholder="blur"
      blurDataURL={PLACEHOLDER_SVG}
      alt={alt || 'Image'}
      priority={priority}
      {...rest}
    />
  );
};
