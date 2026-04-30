import { factories } from '@strapi/strapi';

export default factories.createCoreRouter(
  'api::transfers-page.transfers-page',
  {
    config: {
      find: {
        auth: false,
        middlewares: ['api::transfers-page.transfers-page-populate'],
      },
    },
  }
);
