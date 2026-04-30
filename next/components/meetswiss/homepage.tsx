'use client';

import clsx from 'clsx';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { useEffect, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import {
  FaApple,
  FaArrowLeft,
  FaArrowRight,
  FaCarSide,
  FaClock,
  FaGooglePlay,
  FaLeaf,
  FaMoneyBillWave,
  FaPlus,
  FaShieldAlt,
  FaStar,
  FaSuitcaseRolling,
  FaTimes,
  FaUserFriends,
  FaUsers,
} from 'react-icons/fa';

import { StrapiImage } from '@/components/ui/strapi-image';
import { i18n } from '@/i18n.config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MeetswissHomepageContent = {
  hero: {
    eyebrow: string;
    slides: { image: string; heading: string; paragraph: string }[];
    formEmbedHtml?: string;
    button?: { text: string; url: string; target?: string };
  };
  fleets: {
    title: string;
    subtitle: string;
    passengers: number;
    luggage: number;
    image: string;
    slug: string;
  }[];
  services: { title: string; image: string; slug: string }[];
  news: { title: string; image: string; slug: string }[];
  testimonials: {
    name: string;
    role: string;
    review: string;
    avatar: string;
  }[];
  faqItems: { question: string; answer: string }[];
  partnerLogos: { src: string; alt: string }[];
  partnerHeading: string;
  partnerSubheading: string;
  whyChooseUs: {
    heading: string;
    subheading: string;
    cards: { icon: string; title: string; description: string }[];
  };
  stats: {
    heading: string;
    items: { value: string; label: string }[];
  };
  about: {
    heading: string;
    description: string;
    button?: { text: string; url: string; target?: string };
    images: string[];
  };
  cities: {
    heading: string;
    subheading: string;
    items: {
      title: string;
      slug: string;
      description: string;
      image: string;
    }[];
  };
  howItWorks: { title: string; steps: string[] };
};

const WHY_ICON_MAP: Record<string, React.ReactNode> = {
  shield: <FaShieldAlt />,
  money: <FaMoneyBillWave />,
  car: <FaCarSide />,
  clock: <FaClock />,
  star: <FaStar />,
  users: <FaUsers />,
  luggage: <FaSuitcaseRolling />,
  leaf: <FaLeaf />,
};

type HeroEmbedCache = {
  key: string;
  host: HTMLDivElement;
  parkingLot: HTMLDivElement;
};

declare global {
  interface Window {
    __MEETSWISS_HERO_EMBED_CACHE__?: HeroEmbedCache;
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Shared primitive components
// ---------------------------------------------------------------------------

/**
 * Gold CTA button — renders as <button> or <Link> depending on whether
 * `href` is provided.
 */
function GoldButton({
  href,
  target,
  onClick,
  type = 'button',
  children,
  className,
}: {
  href?: string;
  target?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  children: React.ReactNode;
  className?: string;
}) {
  const base = clsx(
    'inline-flex items-center justify-center rounded-full px-8 py-3',
    'bg-gradient-to-br from-[#be9135] via-[#d4a843] to-[#e8c976]',
    'font-extrabold tracking-wide text-[#17130b] no-underline',
    'transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
    'hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(212,168,67,0.5),0_14px_34px_rgba(212,168,67,0.28)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70',
    className
  );

  if (href) {
    return (
      <Link href={href} target={target} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base}>
      {children}
    </button>
  );
}

/**
 * Arrow button used in carousel controls.
 */
function ArrowButton({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      onClick={onClick}
      className={clsx(
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        'border border-amber-400/40 bg-black/60 text-[#f7f3e8]',
        'transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-px hover:border-amber-400/85',
        'hover:shadow-[0_0_0_1px_rgba(212,168,67,0.36),0_12px_25px_rgba(0,0,0,0.35)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70'
      )}
    >
      {direction === 'prev' ? <FaArrowLeft /> : <FaArrowRight />}
    </button>
  );
}

/**
 * Dot indicator for carousels.
 */
function DotButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Go to slide"
      onClick={onClick}
      className={clsx(
        'h-[0.72rem] rounded-full border-0 transition-[width,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        active ? 'w-[1.95rem] bg-amber-400' : 'w-[0.72rem] bg-white/35'
      )}
    />
  );
}

/**
 * Prev / Next arrows + dot row used across all carousels.
 */
function CarouselControls({
  onPrev,
  onNext,
  count,
  active,
  onDot,
}: {
  onPrev: () => void;
  onNext: () => void;
  count: number;
  active: number;
  onDot: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 max-[760px]:flex-wrap">
      <div className="flex items-center gap-2">
        <ArrowButton direction="prev" onClick={onPrev} />
        <ArrowButton direction="next" onClick={onNext} />
      </div>
      <div className="flex items-center gap-[0.45rem]">
        {Array.from({ length: count }, (_, i) => (
          <DotButton key={i} active={i === active} onClick={() => onDot(i)} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Leaf SVG mark
// ---------------------------------------------------------------------------

function LeafMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M20 4C12.5 4 5.9 8.2 4 14.5C3.1 17.6 3.5 20.3 3.5 20.3C3.5 20.3 6.2 20.7 9.3 19.8C15.7 17.9 20 11.5 20 4Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M8 16.5C10.4 13.8 13 11.7 16.6 9.4"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Hero form embed (preserves iframe across re-renders)
// ---------------------------------------------------------------------------

function getOrCreateHeroEmbedCache(): HeroEmbedCache {
  if (window.__MEETSWISS_HERO_EMBED_CACHE__)
    return window.__MEETSWISS_HERO_EMBED_CACHE__;

  const parkingLot = document.createElement('div');
  Object.assign(parkingLot.style, {
    position: 'fixed',
    left: '-9999px',
    top: '-9999px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    opacity: '0',
    pointerEvents: 'none',
  });

  const host = document.createElement('div');
  host.style.width = '100%';
  parkingLot.appendChild(host);
  document.body.appendChild(parkingLot);

  window.__MEETSWISS_HERO_EMBED_CACHE__ = { key: '', host, parkingLot };
  return window.__MEETSWISS_HERO_EMBED_CACHE__;
}

function HeroFormEmbed({ embedHtml }: { embedHtml?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const normalized = embedHtml?.trim() ?? '';
  const hasEmbed = Boolean(normalized);
  const hasIframe = /<iframe[\s>]/i.test(normalized);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !hasEmbed) return;

    const cache = getOrCreateHeroEmbedCache();
    const { host, parkingLot } = cache;

    if (cache.key !== normalized) {
      cache.key = normalized;
      host.innerHTML = normalized;

      if (hasIframe) {
        host.querySelectorAll('script').forEach((s) => s.remove());
      } else {
        host.querySelectorAll('script').forEach((old) => {
          const fresh = document.createElement('script');
          Array.from(old.attributes).forEach((a) =>
            fresh.setAttribute(a.name, a.value)
          );
          fresh.text = old.text;
          old.parentNode?.replaceChild(fresh, old);
        });
      }
    }

    if (host.parentNode !== mount) {
      mount.innerHTML = '';
      mount.appendChild(host);
    }

    return () => {
      if (host.parentNode !== parkingLot) parkingLot.appendChild(host);
    };
  }, [hasEmbed, hasIframe, normalized]);

  if (!hasEmbed) {
    return (
      <div className="grid min-h-[22rem] place-items-center rounded-[0.95rem] bg-black/45 p-5 text-center text-[#d6cab2]">
        <p className="m-0 max-w-[34ch] text-[0.95rem] leading-[1.55]">
          Add form embed HTML/script in Strapi Hero to display your booking
          form.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="rounded-[0.95rem] [&_iframe]:block [&_iframe]:min-h-[22rem] [&_iframe]:w-full [&_iframe]:rounded-[0.95rem] [&_iframe]:border-0"
    />
  );
}

// ---------------------------------------------------------------------------
// Section layout helpers
// ---------------------------------------------------------------------------

function Container({
  children,
  narrow,
}: {
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div
      className={clsx(
        'mx-auto w-full px-[clamp(1rem,3vw,2.5rem)]',
        narrow ? 'max-w-[980px]' : 'max-w-[1240px]'
      )}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  children,
  centered,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <h2
      className={clsx(
        'm-0 text-[clamp(1.75rem,3.1vw,3rem)] leading-[1.1] tracking-[0.01em]',
        '[font-family:var(--font-luxury,Bodoni_Moda,Times_New_Roman,serif)]',
        centered && 'text-center'
      )}
    >
      {children}
    </h2>
  );
}

// Vertical gold accent line on the left
function AccentSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={clsx(
        'relative bg-[#0a0a0a] py-[clamp(3rem,7vw,5.5rem)]',
        "before:pointer-events-none before:absolute before:bottom-10 before:left-[clamp(0.35rem,1vw,0.95rem)] before:top-10 before:w-[2px] before:content-['']",
        'before:bg-[linear-gradient(to_bottom,rgba(212,168,67,0),rgba(212,168,67,0.82),rgba(212,168,67,0))]',
        className
      )}
    >
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Fleet card
// ---------------------------------------------------------------------------

function FleetCard({
  vehicle,
  href,
}: {
  vehicle: MeetswissHomepageContent['fleets'][0];
  href: string;
}) {
  return (
    <Link href={href} className="block text-inherit no-underline">
      <article
        className={clsx(
          'overflow-hidden rounded-2xl border border-amber-400/25',
          'bg-gradient-to-br from-[#181818] to-[#111]',
          'transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'hover:-translate-y-1 hover:border-amber-400/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.33)]'
        )}
      >
        <div className="px-4 pb-[0.55rem] pt-[0.95rem]">
          <h3 className="m-0 text-[1.03rem]">{vehicle.title}</h3>
        </div>
        <div
          className="min-h-44 bg-cover bg-center"
          style={{ backgroundImage: `url(${vehicle.image})` }}
        />
        <div className="px-4 pb-4 pt-[0.85rem]">
          <p className="m-0 text-[#cfc4ab]">{vehicle.subtitle}</p>
          <div className="mt-[0.72rem] flex flex-wrap items-center justify-between gap-2 text-[0.87rem] text-[#efe7d6]">
            <span className="inline-flex items-center gap-1.5">
              <FaUserFriends /> Passengers: {vehicle.passengers}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaSuitcaseRolling /> Luggage: {vehicle.luggage}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Service card
// ---------------------------------------------------------------------------

function ServiceCard({
  service,
  href,
}: {
  service: MeetswissHomepageContent['services'][0];
  href: string;
}) {
  return (
    <Link href={href} className="block text-inherit no-underline">
      <article
        className={clsx(
          'relative min-h-[17rem] overflow-hidden rounded-2xl border border-amber-400/25',
          'bg-gradient-to-br from-[#181818] to-[#111]',
          'transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'hover:-translate-y-1 hover:border-amber-400/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.33)]',
          'max-[760px]:min-h-[15.5rem]'
        )}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(10,10,10,0.8), rgba(10,10,10,0.2)), url(${service.image})`,
          }}
        />
        {service.title && (
          <p className="relative z-10 m-0 flex min-h-[17rem] items-end p-4 font-bold max-[760px]:min-h-[15.5rem]">
            {service.title}
          </p>
        )}
      </article>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// City card
// ---------------------------------------------------------------------------

function CityCard({
  city,
  href,
}: {
  city: MeetswissHomepageContent['cities']['items'][0];
  href: string;
}) {
  return (
    <Link href={href} className="block text-inherit no-underline">
      <article
        className={clsx(
          'group overflow-hidden rounded-2xl border border-amber-400/25 bg-[#111]',
          'transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'hover:-translate-y-1 hover:border-amber-400/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.33)]'
        )}
      >
        <div className="relative min-h-[11.5rem]">
          {city.image ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: `url(${city.image})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b1b] to-[#0a0a0a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="p-4">
          <h3 className="m-0 text-[1.05rem]">{city.title}</h3>
          {city.description && (
            <p className="mt-2 text-[0.93rem] leading-[1.65] text-[#c8bfa8]">
              {city.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Why-choose-us card
// ---------------------------------------------------------------------------

function WhyCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={clsx(
        'rounded-2xl border border-amber-400/30 bg-[#111] p-[1.15rem]',
        'transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1 hover:border-amber-400/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.33)]'
      )}
    >
      <span className="text-xl text-amber-400">{icon}</span>
      <h3 className="mt-[0.7rem] text-[1.1rem]">{title}</h3>
      <p className="mt-[0.64rem] leading-[1.62] text-[#d6ccb7]">{children}</p>
    </article>
  );
}

// ---------------------------------------------------------------------------
// FAQ item
// ---------------------------------------------------------------------------

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[0.82rem] border border-amber-400/35 bg-[#101010]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-[0.7rem] border-0 bg-transparent px-4 py-[0.92rem] text-left text-[#f5f0e4]"
      >
        <span>{question}</span>
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-400/40 text-amber-400">
          {open ? <FaTimes /> : <FaPlus />}
        </span>
      </button>
      <div
        className={clsx(
          'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [&>div]:overflow-hidden',
          open ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'
        )}
      >
        <div>
          <p className="m-0 px-4 pb-[0.95rem] leading-[1.62] text-[#c7ba9d]">
            {answer}
          </p>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Inline carousel track — shared by fleet and services
// ---------------------------------------------------------------------------

function CarouselTrack({
  children,
  index,
  perView,
}: {
  children: React.ReactNode;
  index: number;
  perView: number;
}) {
  return (
    <div
      className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [&>*]:min-w-0 [&>*]:px-[0.55rem] max-[760px]:[&>*]:px-[0.35rem]"
      style={{
        transform: `translateX(calc(-${index} * (100% / ${perView})))`,
        ['--per-view' as string]: String(perView),
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rotate helper
// ---------------------------------------------------------------------------

function rotate(current: number, dir: 'next' | 'prev', max: number) {
  if (max <= 0) return 0;
  if (dir === 'next') return current >= max ? 0 : current + 1;
  return current <= 0 ? max : current - 1;
}

// ---------------------------------------------------------------------------
// Phone mockup used in app section
// ---------------------------------------------------------------------------

function PhoneMockup({ rotate }: { rotate: 'left' | 'right' }) {
  return (
    <div
      className={clsx(
        'absolute aspect-[10/19] w-[min(44vw,11.8rem)] rounded-[1.7rem] p-[0.58rem]',
        'max-[760px]:w-[min(42vw,9.2rem)] max-[760px]:rounded-[1.4rem] max-[760px]:p-[0.5rem]',
        'border border-amber-800/30 bg-gradient-to-br from-[#f9efe1] via-[#f5d9aa] to-[#ecd08f]',
        'shadow-[0_22px_45px_rgba(61,45,14,0.2)]',
        rotate === 'left'
          ? 'left-4 top-16 -rotate-[10deg] max-[760px]:left-1/2 max-[760px]:top-10 max-[760px]:-translate-x-[58%]'
          : 'right-[1.4rem] top-4 rotate-[13deg] max-[760px]:right-1/2 max-[760px]:top-2 max-[760px]:translate-x-[58%]'
      )}
    >
      <div className="h-full w-full rounded-[1.2rem] bg-gradient-to-b from-[#fff8ef] to-[#f2e2c7] p-[0.78rem]">
        <div className="h-[0.6rem] rounded-full bg-amber-400/45" />
        <div className="mt-[0.44rem] h-[0.6rem] w-[62%] rounded-full bg-amber-400/45" />
        <div
          className={clsx(
            'mt-4 h-[62%] rounded-[0.82rem]',
            rotate === 'left'
              ? 'bg-gradient-to-br from-[#1f2834] to-[#56708f]'
              : 'bg-gradient-to-br from-[#121212] to-[#463418]'
          )}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function MeetswissHomepage({
  locale,
  content,
}: {
  locale: string;
  content: MeetswissHomepageContent;
}) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [fleetIndex, setFleetIndex] = useState(0);
  const [servicesIndex, setServicesIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [newsIndex, setNewsIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const {
    hero,
    fleets,
    services,
    testimonials,
    news,
    faqItems,
    partnerLogos,
    partnerHeading,
    partnerSubheading,
    whyChooseUs,
    stats,
    about,
    cities,
    howItWorks,
  } = content;

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handle = () => setIsDesktop(mq.matches);
    handle();
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  const fleetPerView = isDesktop ? 3 : 1;
  const servicesPerView = isDesktop ? 3 : 1;
  const fleetMax = Math.max(0, fleets.length - fleetPerView);
  const servicesMax = Math.max(0, services.length - servicesPerView);

  useEffect(() => {
    setFleetIndex((p) => Math.min(p, fleetMax));
  }, [fleetMax]);
  useEffect(() => {
    setServicesIndex((p) => Math.min(p, servicesMax));
  }, [servicesMax]);

  const basePath = locale === i18n.defaultLocale ? '' : `/${locale}`;

  const currentHero = hero.slides[heroIndex];
  const cityParagraphs = cities.subheading
    ? cities.subheading
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="bg-[#0a0a0a] text-[#f7f3e8] [font-family:var(--font-sans,Manrope,Segoe_UI,Helvetica,Arial,sans-serif)] motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="relative flex min-h-screen items-end overflow-hidden max-[760px]:overflow-visible"
        id="home"
      >
        {/* Sliding backgrounds */}
        <div className="absolute inset-0">
          {hero.slides.map((slide, i) => (
            <div
              key={slide.image}
              className={clsx(
                'absolute inset-0 bg-cover bg-center bg-no-repeat transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                i === heroIndex
                  ? 'scale-100 opacity-100'
                  : 'scale-[1.03] opacity-0'
              )}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,8,8,0.85)_0%,rgba(10,10,10,0.45)_40%,rgba(10,10,10,0.7)_100%),linear-gradient(to_top,rgba(10,10,10,0.7)_0%,rgba(10,10,10,0.05)_60%)]" />
        </div>

        <div className="relative z-30 mx-auto w-full max-w-[1240px] px-[clamp(1rem,3vw,2.5rem)] pb-[clamp(5.75rem,12vw,7rem)] pt-[clamp(9rem,17vw,11.5rem)] max-[760px]:pb-[4.6rem] max-[760px]:pt-[8.4rem]">
          <div className="grid items-end gap-[clamp(1rem,3vw,2.6rem)] [grid-template-columns:minmax(0,1fr)_minmax(20rem,30rem)] max-lg:grid-cols-1 max-lg:items-start max-lg:gap-5">
            {/* Copy */}
            <div className="max-w-[min(44rem,100%)] max-lg:max-w-[min(36rem,100%)]">
              <p className="m-0 text-xs uppercase tracking-[0.34em] text-[#c7beaa]">
                {hero.eyebrow}
              </p>
              <h1 className="m-[0.9rem_0_0] max-w-[16ch] text-[clamp(2.1rem,5vw,4.4rem)] leading-[1.05] tracking-[0.01em] text-balance [font-family:var(--font-luxury,Bodoni_Moda,Times_New_Roman,serif)] max-[760px]:max-w-[20ch]">
                {currentHero?.heading}
              </h1>

              {currentHero?.paragraph && (
                <p className="m-[1rem_0_0] max-w-[48ch] text-[clamp(0.95rem,1.4vw,1.1rem)] leading-[1.7] text-[#e6decb] text-pretty">
                  {currentHero.paragraph}
                </p>
              )}

              {hero.button && (
                <GoldButton
                  href={hero.button.url}
                  target={hero.button.target}
                  className="mt-[1.3rem] text-[0.95rem]"
                >
                  {hero.button.text}
                </GoldButton>
              )}

              {hero.slides.length > 1 && (
                <div className="relative z-30 mt-[clamp(1rem,2.8vw,1.8rem)] w-[min(24rem,100%)]">
                  <CarouselControls
                    onPrev={() =>
                      setHeroIndex((c) =>
                        rotate(c, 'prev', hero.slides.length - 1)
                      )
                    }
                    onNext={() =>
                      setHeroIndex((c) =>
                        rotate(c, 'next', hero.slides.length - 1)
                      )
                    }
                    count={hero.slides.length}
                    active={heroIndex}
                    onDot={setHeroIndex}
                  />
                </div>
              )}
            </div>

            {/* Form embed */}
            <div className="relative z-40 max-lg:max-w-[min(36rem,100%)] max-[760px]:translate-y-5 max-[760px]:-mb-5">
              <HeroFormEmbed embedHtml={hero.formEmbedHtml} />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PARTNERS                                                             */}
      {/* ------------------------------------------------------------------ */}
      {partnerLogos.length > 0 && (
        <section
          className="bg-[#0e0e0e] py-[clamp(2.4rem,5vw,4.2rem)]"
          id="booking"
        >
          <Container>
            <div className="mb-[1.5rem] max-w-[46rem]">
              {(partnerHeading || partnerSubheading) && (
                <>
                  {partnerHeading && (
                    <SectionTitle>{partnerHeading}</SectionTitle>
                  )}
                  {partnerSubheading && (
                    <p className="mt-3 text-[1rem] leading-[1.7] text-[#e2dbc9]">
                      {partnerSubheading}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="relative overflow-hidden rounded-[1.3rem] border border-amber-400/20 bg-[#0b0b0b] py-[1.25rem]">
              {!partnerHeading && !partnerSubheading && (
                <h2 className="sr-only">Trusted partners</h2>
              )}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0b0b0b] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0b0b0b] to-transparent" />
              <Marquee
                speed={24}
                gradient={false}
                pauseOnHover
                autoFill
                play={!prefersReducedMotion}
              >
                {partnerLogos.map((logo, index) => (
                  <div
                    key={`${logo.src}-${index}`}
                    className="mx-7 flex h-12 items-center"
                  >
                    <StrapiImage
                      src={logo.src}
                      alt={logo.alt}
                      width={200}
                      height={80}
                      className="h-10 w-auto object-contain opacity-80 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0"
                      draggable={false}
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* FLEET                                                                */}
      {/* ------------------------------------------------------------------ */}
      {fleets.length > 0 && (
        <AccentSection id="fleet">
          <Container>
            <div className="flex items-center justify-between gap-4 max-[760px]:flex-wrap">
              <SectionTitle>Our Fleet</SectionTitle>
              <Link
                href={`${basePath}/fleet`}
                className="inline-flex items-center gap-2 font-bold text-amber-400 no-underline hover:underline hover:decoration-1 hover:underline-offset-[0.26rem]"
              >
                More Fleet <FaArrowRight />
              </Link>
            </div>

            <div className="mt-[1.35rem] overflow-hidden">
              <CarouselTrack index={fleetIndex} perView={fleetPerView}>
                {fleets.map((v) => (
                  <div
                    key={v.slug}
                    style={{ flex: `0 0 calc(100% / ${fleetPerView})` }}
                  >
                    <FleetCard
                      vehicle={v}
                      href={`${basePath}/fleet/${v.slug}`}
                    />
                  </div>
                ))}
              </CarouselTrack>
            </div>

            <div className="mt-4">
              <CarouselControls
                onPrev={() => setFleetIndex((c) => rotate(c, 'prev', fleetMax))}
                onNext={() => setFleetIndex((c) => rotate(c, 'next', fleetMax))}
                count={fleetMax + 1}
                active={fleetIndex}
                onDot={setFleetIndex}
              />
            </div>
          </Container>
        </AccentSection>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* HOW IT WORKS                                                         */}
      {/* ------------------------------------------------------------------ */}
      {howItWorks.steps.length > 0 && (
        <section
          className={clsx(
            'relative overflow-hidden bg-[#070707] py-[clamp(3rem,7vw,5.4rem)]',
            "after:pointer-events-none after:absolute after:inset-0 after:content-['']",
            'after:bg-[linear-gradient(138deg,rgba(0,0,0,0)_56%,rgba(43,60,45,0.46)_56%,rgba(43,60,45,0.46)_68%,rgba(74,33,39,0.52)_68%,rgba(74,33,39,0.52)_80%,rgba(0,0,0,0)_80%)]'
          )}
          id="how-it-works"
        >
          <Container>
            <div className="relative z-10 grid items-center gap-[clamp(1rem,3vw,2.4rem)] [grid-template-columns:1.05fr_0.95fr] max-lg:grid-cols-1">
              <div>
                <SectionTitle>{howItWorks.title}</SectionTitle>
                <ol className="mt-[1.2rem] grid list-none gap-4 p-0">
                  {howItWorks.steps.map((step, i) => (
                    <li
                      key={`${step}-${i}`}
                      className="flex items-start gap-[0.9rem] leading-[1.6] text-[#ddd2bd]"
                    >
                      <strong className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[#201a0f]">
                        {i + 1}.
                      </strong>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[1.1rem] border border-amber-400/40 bg-[#0f0f0f] p-[0.8rem]">
                <div
                  className="min-h-[clamp(15rem,34vw,24rem)] rounded-[0.9rem] bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(212,168,67,0.2)]"
                  style={{
                    backgroundImage:
                      'url(https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&w=1500&q=80)',
                  }}
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* WHY CHOOSE US                                                        */}
      {/* ------------------------------------------------------------------ */}
      {whyChooseUs.cards.length > 0 && (
        <section className="bg-[#0a0a0a] py-[clamp(3rem,7vw,5.5rem)]">
          <Container>
            {whyChooseUs.heading && (
              <SectionTitle centered>{whyChooseUs.heading}</SectionTitle>
            )}
            {whyChooseUs.subheading && (
              <p className="mx-auto mt-3 max-w-[60ch] text-center leading-[1.7] text-[#cdc2a8]">
                {whyChooseUs.subheading}
              </p>
            )}
            <div
              className={clsx(
                'mt-6 grid gap-4 max-lg:grid-cols-1',
                whyChooseUs.cards.length === 2
                  ? 'grid-cols-2'
                  : whyChooseUs.cards.length >= 4
                    ? 'grid-cols-4 max-md:grid-cols-2'
                    : 'grid-cols-3'
              )}
            >
              {whyChooseUs.cards.map((card, i) => (
                <WhyCard
                  key={`${card.title}-${i}`}
                  icon={WHY_ICON_MAP[card.icon] || WHY_ICON_MAP.shield}
                  title={card.title}
                >
                  {card.description}
                </WhyCard>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STATS                                                                */}
      {/* ------------------------------------------------------------------ */}
      {stats.items.length > 0 && (
        <section className="bg-[#f5efe0] py-[clamp(2.4rem,6vw,4rem)] text-[#17130d]">
          <Container>
            <div className="grid items-center gap-[1.2rem] [grid-template-columns:minmax(0,1fr)_auto] max-lg:grid-cols-1">
              {stats.heading && (
                <h2 className="m-0 max-w-[20ch] text-[clamp(1.8rem,4vw,3rem)] tracking-[0.01em] [font-family:var(--font-luxury,Bodoni_Moda,Times_New_Roman,serif)]">
                  {stats.heading}
                </h2>
              )}
              <div
                className={clsx(
                  'grid gap-[clamp(1rem,3vw,2.3rem)] text-right max-lg:text-left',
                  stats.items.length === 2
                    ? 'grid-cols-2'
                    : stats.items.length >= 4
                      ? 'grid-cols-4'
                      : 'grid-cols-3'
                )}
              >
                {stats.items.map((s, i) => (
                  <div key={`${s.label}-${i}`}>
                    <strong className="block text-[clamp(1.8rem,4vw,3.25rem)] leading-none">
                      {s.value}
                    </strong>
                    <span className="text-[0.95rem] text-[#5b4d36]">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CITIES                                                              */}
      {/* ------------------------------------------------------------------ */}
      {(cities.items.length > 0 ||
        cities.heading ||
        cityParagraphs.length > 0) && (
        <section
          className="bg-[#0b0b0b] py-[clamp(3rem,7vw,5.5rem)]"
          id="cities"
        >
          <Container>
            <div className="flex items-center justify-between gap-4 max-[760px]:flex-wrap">
              {cities.heading && <SectionTitle>{cities.heading}</SectionTitle>}
              {cities.items.length > 0 && (
                <Link
                  href={`${basePath}/transfers`}
                  className="inline-flex items-center gap-2 font-bold text-amber-400 no-underline hover:underline hover:decoration-1 hover:underline-offset-[0.26rem]"
                >
                  View all destinations <FaArrowRight />
                </Link>
              )}
            </div>

            {cityParagraphs.length > 0 && (
              <div className="mt-3 grid max-w-[60ch] gap-3 text-[#e2dbc9]">
                {cityParagraphs.map((paragraph, index) => (
                  <p
                    key={`${paragraph.slice(0, 16)}-${index}`}
                    className="m-0 leading-[1.7]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {cities.items.length > 0 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cities.items.slice(0, 6).map((city) => (
                  <CityCard
                    key={city.slug}
                    city={city}
                    href={`${basePath}/transfers/${city.slug}`}
                  />
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SERVICES                                                             */}
      {/* ------------------------------------------------------------------ */}
      {services.length > 0 && (
        <AccentSection id="services">
          <Container>
            <div className="flex items-center justify-between gap-4 max-[760px]:flex-wrap">
              <SectionTitle>Our Services</SectionTitle>
              <Link
                href={`${basePath}/services`}
                className="inline-flex items-center gap-2 font-bold text-amber-400 no-underline hover:underline hover:decoration-1 hover:underline-offset-[0.26rem]"
              >
                Many Services <FaArrowRight />
              </Link>
            </div>

            <div className="mt-[1.35rem] overflow-hidden">
              <CarouselTrack index={servicesIndex} perView={servicesPerView}>
                {services.map((s) => (
                  <div
                    key={s.slug}
                    style={{ flex: `0 0 calc(100% / ${servicesPerView})` }}
                  >
                    <ServiceCard
                      service={s}
                      href={`${basePath}/services/${s.slug}`}
                    />
                  </div>
                ))}
              </CarouselTrack>
            </div>

            <div className="mt-4">
              <CarouselControls
                onPrev={() =>
                  setServicesIndex((c) => rotate(c, 'prev', servicesMax))
                }
                onNext={() =>
                  setServicesIndex((c) => rotate(c, 'next', servicesMax))
                }
                count={servicesMax + 1}
                active={servicesIndex}
                onDot={setServicesIndex}
              />
            </div>
          </Container>
        </AccentSection>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TESTIMONIALS                                                         */}
      {/* ------------------------------------------------------------------ */}
      {testimonials.length > 0 && (
        <section className="bg-[#0a0a0a] py-[clamp(3rem,7vw,5.5rem)]">
          <Container>
            <div className="grid items-stretch gap-[clamp(1rem,3vw,2.2rem)] [grid-template-columns:1.1fr_0.9fr] max-lg:grid-cols-1">
              {/* Review card */}
              <article
                className={clsx(
                  'rounded-2xl border border-amber-400/35 bg-[#111] p-[1.2rem]',
                  'transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  'hover:-translate-y-1 hover:border-amber-400/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.33)]'
                )}
              >
                <div className="flex items-center gap-[0.84rem]">
                  <div
                    className="h-[2.9rem] w-[2.9rem] rounded-full border border-amber-400/45 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${testimonials[testimonialIndex]?.avatar})`,
                    }}
                  />
                  <div>
                    <h3 className="m-0 text-[1.04rem]">
                      {testimonials[testimonialIndex]?.name}
                    </h3>
                    <span className="text-[0.9rem] text-[#b6a88a]">
                      {testimonials[testimonialIndex]?.role}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                <p className="mt-[0.95rem] leading-[1.68] text-[#e1d8c4]">
                  {testimonials[testimonialIndex]?.review}
                </p>

                <div className="mt-4">
                  <CarouselControls
                    onPrev={() =>
                      setTestimonialIndex((c) =>
                        rotate(c, 'prev', testimonials.length - 1)
                      )
                    }
                    onNext={() =>
                      setTestimonialIndex((c) =>
                        rotate(c, 'next', testimonials.length - 1)
                      )
                    }
                    count={testimonials.length}
                    active={testimonialIndex}
                    onDot={setTestimonialIndex}
                  />
                </div>
              </article>

              {/* Brand panel */}
              <div className="grid place-content-center gap-3 rounded-2xl border border-amber-400/25 bg-[radial-gradient(circle_at_20%_20%,rgba(212,168,67,0.2),rgba(8,8,8,0.95)_55%)] p-[1.3rem] text-center max-lg:min-h-40">
                <LeafMark className="mx-auto h-12 w-12 text-amber-400" />
                <p className="m-0 text-[clamp(1.75rem,4vw,3.2rem)] tracking-[0.01em] text-[#f7f2e4] [font-family:var(--font-luxury,Bodoni_Moda,Times_New_Roman,serif)]">
                  meetswiss transfers
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* BORN IN SWITZERLAND                                                  */}
      {/* ------------------------------------------------------------------ */}
      {(about.heading || about.description || about.images.length > 0) && (
        <section
          className="bg-[#d8d2c7] py-[clamp(3rem,7vw,5rem)] text-[#16120d]"
          id="transfers"
        >
          <Container>
            <div className="grid grid-cols-2 items-center gap-[clamp(1rem,3vw,2.2rem)] max-lg:grid-cols-1">
              {/* Photo collage */}
              {about.images.length > 0 && (
                <div className="grid grid-cols-2 gap-[0.65rem]">
                  {about.images.slice(0, 4).map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className={clsx(
                        'rounded-[0.95rem] bg-cover bg-center',
                        i === 0 && 'min-h-[15.5rem]',
                        (i === 1 || i === 2) && 'min-h-[10.8rem]',
                        i === 3 && 'col-span-2 min-h-[11rem]'
                      )}
                      style={{ backgroundImage: `url(${src})` }}
                    />
                  ))}
                </div>
              )}

              {/* Copy */}
              <div>
                {about.heading && <SectionTitle>{about.heading}</SectionTitle>}
                {about.description && (
                  <p className="mt-4 max-w-[52ch] leading-[1.7] text-[#363027]">
                    {about.description}
                  </p>
                )}
                {about.button && (
                  <GoldButton
                    href={about.button.url}
                    target={about.button.target}
                    className="mt-4 w-full max-w-[13rem]"
                  >
                    {about.button.text}
                  </GoldButton>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* NEWS                                                                 */}
      {/* ------------------------------------------------------------------ */}
      {news.length > 0 && (
        <section className="bg-[#0a0a0a] py-[clamp(3rem,7vw,5.5rem)]" id="blog">
          <Container>
            <div className="flex items-center justify-between gap-4 max-[760px]:flex-wrap">
              <SectionTitle>Latest From News</SectionTitle>
              <Link
                href={`${basePath}/blog`}
                className="inline-flex items-center gap-2 font-bold text-amber-400 no-underline hover:underline hover:decoration-1 hover:underline-offset-[0.26rem]"
              >
                More News <FaArrowRight />
              </Link>
            </div>

            <article
              className={clsx(
                'mt-6 grid overflow-hidden rounded-2xl border border-amber-400/30 bg-[#121212]',
                '[grid-template-columns:0.9fr_1.1fr] max-lg:grid-cols-1',
                'transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
                'hover:-translate-y-1 hover:border-amber-400/55 hover:shadow-[0_18px_36px_rgba(0,0,0,0.33)]'
              )}
            >
              <Link
                href={`${basePath}/blog/${news[newsIndex]?.slug}`}
                className="block"
              >
                <div className="relative min-h-[20rem]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${news[newsIndex]?.image})`,
                    }}
                  />
                  <span className="absolute left-[0.9rem] top-[0.9rem] rounded-full bg-amber-400 px-[0.72rem] py-[0.42rem] font-extrabold tracking-[0.05em] text-[#1a140b]">
                    24h
                  </span>
                </div>
              </Link>

              <div className="flex flex-col justify-between p-[1.1rem]">
                <Link
                  href={`${basePath}/blog/${news[newsIndex]?.slug}`}
                  className="block text-inherit no-underline"
                >
                  <p className="m-0 leading-[1.68] text-[#e3dac7]">
                    {news[newsIndex]?.title}
                  </p>
                </Link>
                <CarouselControls
                  onPrev={() =>
                    setNewsIndex((c) => rotate(c, 'prev', news.length - 1))
                  }
                  onNext={() =>
                    setNewsIndex((c) => rotate(c, 'next', news.length - 1))
                  }
                  count={news.length}
                  active={newsIndex}
                  onDot={setNewsIndex}
                />
              </div>
            </article>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* FAQ                                                                  */}
      {/* ------------------------------------------------------------------ */}
      {faqItems.length > 0 && (
        <section className="bg-[#070707] py-[clamp(3rem,7vw,5rem)]">
          <Container narrow>
            <SectionTitle centered>Frequently Asked Questions</SectionTitle>

            <div className="mt-[1.2rem] grid gap-[0.6rem]">
              {faqItems.map((item, i) => (
                <FaqItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq((c) => (c === i ? null : i))}
                />
              ))}
            </div>

            <div className="mt-[1.35rem] text-center">
              <GoldButton
                href={`${basePath}#booking`}
                className="w-full max-w-[13rem]"
              >
                Book Now
              </GoldButton>
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* APP DOWNLOAD                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-[#f5efe0] py-[clamp(3rem,7vw,5rem)] text-[#16130f]">
        <Container>
          <div className="grid grid-cols-2 items-center gap-[clamp(1rem,3vw,2.4rem)] max-lg:grid-cols-1">
            <div>
              <SectionTitle>Best Private Transfer Company</SectionTitle>
              <p className="mt-[0.95rem] leading-[1.7] text-[#3c3327]">
                Download our app to get the best private transfer service you
                can find around today.
              </p>
              <div className="mt-[1.2rem] flex flex-wrap gap-[0.62rem]">
                {[
                  { icon: <FaGooglePlay />, label: 'Google Play' },
                  { icon: <FaApple />, label: 'App Store' },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    className={clsx(
                      'inline-flex items-center gap-[0.45rem] rounded-full border border-[rgba(22,19,15,0.18)]',
                      'bg-[#fbf7ef] px-[0.95rem] py-[0.66rem] font-bold',
                      'transition-[border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      'hover:-translate-y-px hover:border-amber-400/75 hover:shadow-[0_12px_24px_rgba(170,127,34,0.18)]'
                    )}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone mockup cluster */}
            <div className="relative isolate min-h-[19rem] overflow-hidden max-lg:min-h-[17rem] max-[760px]:min-h-[16rem]">
              <PhoneMockup rotate="right" />
              <PhoneMockup rotate="left" />
              <div className="absolute bottom-[0.9rem] right-0 inline-flex items-center gap-[0.44rem] rounded-full border border-amber-400/45 bg-[#131313] px-[0.72rem] py-[0.45rem] text-[#f5efe0] max-[760px]:left-1/2 max-[760px]:right-auto max-[760px]:-translate-x-1/2">
                <LeafMark className="h-[1.2rem] w-[1.2rem] text-amber-400" />
                <span>Meetswiss App</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
