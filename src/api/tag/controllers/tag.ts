/**
 * tag controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::tag.tag', ({ strapi }) => ({
  async findTop5Tags(ctx) {
    const top5 = await strapi.service('api::tag.tag').findTop5Tags(ctx);
    ctx.body = { data: top5 };
  },
}));
