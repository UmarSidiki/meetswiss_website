import { IconArrowLeft } from '@tabler/icons-react';
import { format } from 'date-fns';
import { Link } from 'next-view-transitions';

import { Container } from './container';
import { AmbientColor } from './decorations/ambient-color';
import DynamicZoneManager from './dynamic-zone/manager';
import { StrapiImage } from '@/components/ui/strapi-image';
import { Article } from '@/types/types';

export async function BlogLayout({
  article,
  locale,
  children,
}: Readonly<{
  article: Article;
  locale: string;
  children: React.ReactNode;
}>) {
  const basePath = locale === 'en' ? '' : `/${locale}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      <AmbientColor />

      <Container className="relative z-10 mt-16 lg:mt-28">
        <div className="px-2 py-6">
          <Link
            href={`${basePath}/blog`}
            className="inline-flex items-center gap-2 text-sm text-[#9c9179] transition-colors duration-200 hover:text-primary"
          >
            <IconArrowLeft className="h-4 w-4" />
            <span>Back to news</span>
          </Link>
        </div>

        <div className="w-full">
          {article?.image ? (
            <div className="overflow-hidden rounded-2xl border border-primary/20">
              <StrapiImage
                src={article.image.url}
                height={800}
                width={1600}
                className="h-48 w-full object-cover md:h-[26rem]"
                alt={article.title}
              />
            </div>
          ) : (
            <div className="h-48 w-full rounded-2xl border border-primary/20 bg-[#111] md:h-[26rem]" />
          )}
        </div>

        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            <article className="pb-12 pt-8">
              {article.categories && article.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.categories.map((category, idx) => (
                    <span
                      key={`blog-cat-${idx}`}
                      className="rounded-full border border-primary/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}

              <header className="mt-6 flex flex-col">
                <h1 className="text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif] sm:text-4xl md:text-5xl">
                  {article.title}
                </h1>
              </header>

              <div className="mt-4 flex items-center gap-2 text-sm text-[#9c9179]">
                <time dateTime={article.publishedAt}>
                  {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
                </time>
              </div>

              <div className="mt-8 prose prose-sm prose-invert max-w-none prose-headings:font-display prose-headings:text-[#f5f1e8] prose-p:text-[#d4cabc] prose-p:leading-[1.78] prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-[#f5f1e8] prose-hr:border-primary/20">
                {children}
              </div>

              <div className="mt-12 border-t border-primary/20 pt-8">
                <Link
                  href={`${basePath}/blog`}
                  className="inline-flex items-center gap-2 text-sm text-[#9c9179] transition-colors duration-200 hover:text-primary"
                >
                  <IconArrowLeft className="h-4 w-4" />
                  <span>Back to news</span>
                </Link>
              </div>
            </article>
          </div>
        </div>

        {article?.dynamic_zone && (
          <DynamicZoneManager
            dynamicZone={article?.dynamic_zone}
            locale={locale}
          />
        )}
      </Container>
    </div>
  );
}
