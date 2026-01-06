/**
 * post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
    async exceptTopRecommended(ctx) {
        const { posts, meta } = await strapi.service('api::post.post').exceptTopRecommended(ctx);
        ctx.body = { data: posts, meta: meta, query: ctx.request.query };
        // ctx.body = { data: [], meta: {
        //     ttt:"111"
        // }, query: ctx.request.query };
    },
    async topRecommended(ctx) {
        const posts = await strapi.service('api::post.post').topRecommended(ctx);
        ctx.body = { data: posts, };
    },
    async getNews5(ctx) {
        const posts = await strapi.service('api::post.post').getNews5(ctx);
        ctx.body = { data: posts, };
    },
    async incrementPreviewCount(ctx) {

        const updatedPost = await strapi.service('api::post.post').incrementPreviewCount(ctx);

        ctx.body = { data: updatedPost };
    },
}));
