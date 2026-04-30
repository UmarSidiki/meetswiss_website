/**
 * `fleet-populate` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  localizations: true,
  image: true,
  amenities: true,
  services: {
    populate: {
      hero_image: true,
      localizations: true,
    },
  },
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    ctx.query.populate = populate;
    await next();
  };
};
