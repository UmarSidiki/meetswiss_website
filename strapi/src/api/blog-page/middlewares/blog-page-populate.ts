/**
 * `blog-page-populate` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  localizations: true,
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
