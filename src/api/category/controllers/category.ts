import { factories } from '@strapi/strapi';

const controller = factories.createCoreController('api::category.category', ({ strapi }) => ({
  async findAllWithPostCount(ctx) {
    const data = await strapi.service('api::category.category').findAllWithPostCount(ctx);
    ctx.body = { data };
  },
}));

export default controller;