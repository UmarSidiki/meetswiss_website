/**
 * transfer router
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::transfer.transfer', {
  config: {
    find: {
      auth: false,
      middlewares: ['api::transfer.transfer-populate'],
    },
    findOne: {
      auth: false,
      middlewares: ['api::transfer.transfer-populate'],
    },
  },
});
