import Image from 'next/image';
import { ComponentProps } from 'react';

import { API_URL } from '@/lib/utils';

interface StrapiImageProps extends Omit<
  ComponentProps<typeof Image>,
  'src' | 'alt'
> {
  src: string;
  alt: string | null;
}

const isDev = process.env.ENVIRONMENT === 'development';

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http') || url.startsWith('//')) return url;

  // Relative Strapi path → local in prod, Strapi API in dev
  if (isDev) {
    return API_URL + url;
  }
  return `/strapi-images${url}`;
}

export function StrapiImage({
  src,
  alt,
  className,
  ...rest
}: Readonly<StrapiImageProps>) {
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;
  return (
    <Image
      src={imageUrl}
      alt={alt ?? 'No alternative text provided'}
      className={className}
      {...rest}
    />
  );
}
