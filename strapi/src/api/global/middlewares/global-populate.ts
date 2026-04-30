/**
 * `global-populate` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  navbar: {
    populate: {
      left_navbar_items: true,
      right_navbar_items: true,
    },
  },
  footer: {
    populate: {
      footer_columns: {
        populate: {
          links: true,
        },
      },
      social_media_links: true,
    },
  },
  seo: {
    populate: {
      metaImage: true,
      twitterImage: true,
    },
  },
  defaultSocialImage: true,
  organizationLogo: true,
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    ctx.query.populate = populate;
    await next();
  };
};
