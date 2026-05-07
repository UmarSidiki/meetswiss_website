import { Link } from 'next-view-transitions';
import { FaSuitcaseRolling, FaUserFriends } from 'react-icons/fa';

import { StrapiImage } from '@/components/ui/strapi-image';
import { localePath } from '@/lib/locale-path';

type Fleet = {
  name: string;
  slug?: string;
  description?: string;
  capacity?: number;
  luggage_capacity?: number;
  image?: { url?: string };
  amenities?: Array<{ text?: string }>;
};

export function FleetCard({
  fleet,
  locale,
}: {
  fleet: Fleet;
  locale?: string;
}) {
  const card = (
    <article className="group overflow-hidden rounded-2xl border border-primary/25 bg-[#111] transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.4)]">
      {fleet.image?.url ? (
        <div className="relative h-52 overflow-hidden">
          <StrapiImage
            src={fleet.image.url}
            alt={fleet.name}
            width={1200}
            height={800}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="h-52 w-full bg-gradient-to-br from-[#1c1a14] to-[#0a0a0a]" />
      )}

      <div className="p-5">
        <h3 className="text-lg font-medium text-[#f5f1e8] [font-family:var(--font-luxury),ui-serif,Georgia,serif]">
          {fleet.name}
        </h3>

        {fleet.description && (
          <p className="mt-2 text-sm leading-[1.65] text-[#c8bfa8]">
            {fleet.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#d4a574]">
          {fleet.capacity ? (
            <span className="inline-flex items-center gap-1.5">
              <FaUserFriends />
              {fleet.capacity} passengers
            </span>
          ) : null}
          {fleet.luggage_capacity ? (
            <span className="inline-flex items-center gap-1.5">
              <FaSuitcaseRolling />
              {fleet.luggage_capacity} luggage
            </span>
          ) : null}
        </div>

        {fleet.amenities?.filter((a) => a?.text).length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {fleet.amenities
              .filter((amenity) => amenity?.text)
              .map((amenity, index) => (
                <span
                  key={`${fleet.name}-amenity-${index}`}
                  className="rounded-full border border-primary/30 px-2.5 py-0.5 text-[0.72rem] text-primary"
                >
                  {amenity.text}
                </span>
              ))}
          </div>
        ) : null}
      </div>
    </article>
  );

  if (locale && fleet.slug) {
    return (
      <Link href={localePath(locale, `/fleet/${fleet.slug}`)} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
