import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::services-page.services-page', {
  config: {
    find: {
      auth: false,
      middlewares: ['api::services-page.services-page-populate'],
    },
  },
});
