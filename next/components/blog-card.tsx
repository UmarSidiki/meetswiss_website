import { format } from 'date-fns';
import { Link } from 'next-view-transitions';
import React from 'react';
import Balancer from 'react-wrap-balancer';

import { BlurImage } from '@/components/blur-image';
import { localePath } from '@/lib/locale-path';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { truncate } from '@/lib/utils';
import { Article } from '@/types/types';

export const BlogCard = ({
  article,
  locale,
}: {
  article: Article;
  locale: string;
}) => {
  return (
    <Link
      href={localePath(locale, `/blog/${article.slug}`)}
      className="group grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-primary/25 bg-[#111] transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)] md:grid-cols-2"
    >
      <div className="relative min-h-[14rem] overflow-hidden md:min-h-[20rem]">
        {article.image ? (
          <BlurImage
            src={strapiImage(article.image.url)}
            alt={article.title}
            height={1200}
            width={1200}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full min-h-[14rem] w-full bg-gradient-to-br from-[#1c1a14] to-[#0a0a0a]" />
        )}
        {article.categories && article.categories.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {article.categories.slice(0, 2).map((category, idx) => (
              <span
                key={`featured-cat-${idx}`}
                className="rounded-full border border-primary/40 bg-black/65 px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-primary backdrop-blur-sm"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between p-6 md:p-8">
        <div>
          <p className="text-lg font-semibold leading-[1.35] tracking-[-0.01em] text-[#f5f1e8] md:text-2xl [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
            <Balancer>{article.title}</Balancer>
          </p>
          {article.description && (
            <p className="mt-3 text-sm leading-[1.7] text-[#c8bfa8]">
              {truncate(article.description, 200)}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-[#9c9179]">
          <time dateTime={article.publishedAt}>
            {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
          </time>
          <span className="inline-block h-1 w-1 rounded-full bg-[#9c9179]" />
          <span className="font-medium text-primary transition-colors duration-200 group-hover:text-amber-300">
            Read article
          </span>
        </div>
      </div>
    </Link>
  );
};

export const BlogCardVertical = ({
  article,
  locale,
}: {
  article: Article;
  locale: string;
}) => {
  return (
    <Link
      href={localePath(locale, `/blog/${article.slug}`)}
      className="group overflow-hidden rounded-2xl border border-primary/25 bg-[#111] transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.4)]"
    >
      <div className="relative overflow-hidden">
        {article.image ? (
          <BlurImage
            src={strapiImage(article.image.url || '')}
            alt={article.title}
            height={800}
            width={800}
            className="h-52 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] md:h-64"
          />
        ) : (
          <div className="h-52 w-full bg-gradient-to-br from-[#1c1a14] to-[#0a0a0a] md:h-64" />
        )}
        {article.categories && article.categories.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {article.categories.slice(0, 1).map((category, idx) => (
              <span
                key={`vertical-cat-${idx}`}
                className="rounded-full border border-primary/40 bg-black/65 px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-primary backdrop-blur-sm"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-base font-semibold leading-[1.35] tracking-[-0.01em] text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif] md:text-lg">
          <Balancer>{article.title}</Balancer>
        </p>
        {article.description && (
          <p className="mt-2 text-sm leading-[1.65] text-[#c8bfa8]">
            {truncate(article.description, 120)}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-[#9c9179]">
          <time dateTime={article.publishedAt}>
            {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
          </time>
        </div>
      </div>
    </Link>
  );
};
