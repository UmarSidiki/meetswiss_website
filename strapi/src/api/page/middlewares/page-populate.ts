/**
 * `page` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  localizations: true,
  dynamic_zone: {
    on: {
      'dynamic-zone.hero': {
        populate: {
          slides: {
            populate: {
              image: true,
            },
          },
          button: true,
        },
      },
      'dynamic-zone.testimonials': {
        populate: {
          testimonials: {
            populate: {
              user: {
                populate: {
                  image: true,
                },
              },
            },
          },
        },
      },
      'dynamic-zone.how-it-works': {
        populate: {
          steps: true,
        },
      },
      'dynamic-zone.brands': {
        populate: {
          logos: {
            populate: {
              image: true,
            },
          },
        },
      },
      'dynamic-zone.cta': {
        populate: {
          CTAs: true,
        },
      },
      'dynamic-zone.form-next-to-section': {
        populate: {
          form: {
            populate: {
              inputs: true,
            },
          },
          section: {
            populate: {
              users: {
                populate: {
                  image: true,
                },
              },
            },
          },
          social_media_icon_links: {
            populate: {
              image: true,
              link: true,
            },
          },
        },
      },
      'dynamic-zone.faq': {
        populate: {
          faqs: true,
        },
      },
      'dynamic-zone.why-choose-us': {
        populate: {
          cards: true,
        },
      },
      'dynamic-zone.stats': {
        populate: {
          items: true,
        },
      },
      'dynamic-zone.about': {
        populate: {
          button: true,
          images: true,
        },
      },
      'dynamic-zone.cities': {
        populate: {
          cities: {
            populate: {
              hero_image: true,
            },
          },
        },
      },
    },
  },
  seo: {
    populate: {
      metaImage: true,
      twitterImage: true,
    },
  },
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    ctx.query.populate = populate;
    await next();
  };
};
