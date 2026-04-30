import type { BlocksContent } from '@strapi/blocks-react-renderer';

import type { StrapiLocaleObject } from '@/types/strapi';

export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
}

export interface Article {
  title: string;
  description?: string | null;
  localizations: StrapiLocaleObject[];
  slug: string;
  content: BlocksContent;
  dynamic_zone: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[];
  seo?: any;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: any[];
  perks: any[];
  dynamic_zone: any[];
  featured?: boolean;
  images: any[];
  categories?: any[];
  localizations?: any[];
  seo?: any;
}

export interface City {
  title: string;
  slug: string;
  short_description?: string | null;
  mini_hero_title?: string | null;
  booking_form_embed_html?: string | null;
  content?: BlocksContent;
  hero_image?: Image;
  localizations?: StrapiLocaleObject[];
  seo?: any;
}

export type LocaleParamsProps = {
  params: Promise<{
    locale: string;
  }>;
};

export type LocaleSlugParamsProps = {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
};
