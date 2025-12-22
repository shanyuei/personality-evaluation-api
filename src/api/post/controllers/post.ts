/**
 * post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
    async exceptTopRecommended(ctx) {
        const { posts, meta } = await strapi.service('api::post.post').exceptTopRecommended(ctx);
        ctx.body = { data: posts, meta: meta, query: ctx.request.query };
    },
    async findTop5Tags(ctx) {
        const posts = await strapi.service('api::post.post').findTop5Tags(ctx);
        ctx.body = { data: posts, };
    },

    async findTop5ByPreviewCount(ctx) {
        const posts = await strapi.service('api::post.post').findTop5ByPreviewCount(ctx);
        ctx.body = { data: posts };
    },
}));
