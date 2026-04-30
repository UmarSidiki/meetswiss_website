import { Link } from 'next-view-transitions';

import { StrapiImage } from '@/components/ui/strapi-image';

type Service = {
  title: string;
  slug: string;
  short_description?: string;
  hero_image?: { url?: string };
};

export function ServiceCard({
  service,
  locale,
}: {
  service: Service;
  locale: string;
}) {
  return (
    <Link
      href={`/${locale}/services/${service.slug}` as never}
      className="group relative min-h-[17rem] overflow-hidden rounded-2xl border border-primary/25 transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_20px_42px_rgba(0,0,0,0.45)]"
    >
      {service.hero_image?.url ? (
        <StrapiImage
          src={service.hero_image.url}
          alt={service.title}
          width={1200}
          height={800}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1a14] to-[#0a0a0a]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.88)_0%,rgba(8,8,8,0.3)_55%,rgba(8,8,8,0.05)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <h3 className="text-lg font-semibold text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
          {service.title}
        </h3>
        {service.short_description && (
          <p className="mt-1.5 text-sm leading-[1.65] text-[#c8bfa8]">
            {service.short_description}
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors duration-200 group-hover:text-amber-300">
          View details →
        </span>
      </div>
    </Link>
  );
}
