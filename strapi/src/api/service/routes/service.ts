/**
 * service router
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::service.service', {
  config: {
    find: {
      auth: false,
      middlewares: ['api::service.service-populate'],
    },
    findOne: {
      auth: false,
      middlewares: ['api::service.service-populate'],
    },
  },
});
