'use client';

import { format } from 'date-fns';
import FuzzySearch from 'fuzzy-search';
import { Link } from 'next-view-transitions';
import React, { useEffect, useState } from 'react';

import { localePath } from '@/lib/locale-path';
import { truncate } from '@/lib/utils';
import { Article } from '@/types/types';

export const BlogPostRows = ({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) => {
  const [search, setSearch] = useState('');

  const searcher = new FuzzySearch(articles, ['title'], {
    caseSensitive: false,
  });

  const [results, setResults] = useState(articles);
  useEffect(() => {
    const results = searcher.search(search);
    setResults(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="w-full py-16">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-xl font-semibold text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
          More articles
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles…"
          className="min-w-full rounded-xl border border-primary/25 bg-[#111] px-4 py-2.5 text-sm text-[#f5f1e8] placeholder-[#7a7268] outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary/60 focus:ring-0 sm:min-w-80"
        />
      </div>

      <div className="divide-y divide-primary/15">
        {results.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#9c9179]">
            No articles found
          </p>
        ) : (
          results.map((article, index) => (
            <BlogPostRow
              article={article}
              key={article.slug + index}
              locale={locale}
            />
          ))
        )}
      </div>
    </div>
  );
};

export const BlogPostRow = ({
  article,
  locale,
}: {
  article: Article;
  locale: string;
}) => {
  return (
    <Link
      href={localePath(locale, `/blog/${article.slug}`)}
      className="group flex flex-col items-start justify-between gap-3 py-5 transition-colors duration-200 md:flex-row md:items-center"
    >
      <div className="flex-1">
        <p className="text-base font-medium text-[#e8e0d0] transition-colors duration-200 group-hover:text-[#f5f1e8]">
          {article.title}
        </p>
        {article.description && (
          <p className="mt-1 max-w-xl text-sm leading-[1.65] text-[#9c9179] transition-colors duration-200 group-hover:text-[#c8bfa8]">
            {truncate(article.description, 100)}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <time
            dateTime={article.publishedAt}
            className="text-xs text-[#7a7268]"
          >
            {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
          </time>
          {article.categories && article.categories.length > 0 && (
            <>
              <span className="h-1 w-1 rounded-full bg-[#7a7268]" />
              <div className="flex flex-wrap gap-1.5">
                {article.categories.map((category, idx) => (
                  <span
                    key={`row-cat-${idx}`}
                    className="rounded-full border border-primary/30 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-primary"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <span className="shrink-0 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Read →
      </span>
    </Link>
  );
};
