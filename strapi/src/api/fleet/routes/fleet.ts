/**
 * fleet router
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::fleet.fleet', {
  config: {
    find: {
      auth: false,
      middlewares: ['api::fleet.fleet-populate'],
    },
    findOne: {
      auth: false,
      middlewares: ['api::fleet.fleet-populate'],
    },
  },
});
