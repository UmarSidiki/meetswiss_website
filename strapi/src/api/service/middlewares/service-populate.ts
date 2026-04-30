/**
 * `service-populate` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  localizations: true,
  hero_image: true,
  fleets: {
    populate: {
      image: true,
    },
  },
  service_points: true,
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
