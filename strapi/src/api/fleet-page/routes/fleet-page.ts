import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::fleet-page.fleet-page', {
  config: {
    find: {
      auth: false,
      middlewares: ['api::fleet-page.fleet-page-populate'],
    },
  },
});
