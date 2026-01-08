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


    async find(ctx) {
        // 1. 拼装 populate（白名单）
        const pop = (ctx.query.populate as any) || {};
        const populate = {
            ...pop,
            cover: pop.cover ?? true,
            category: pop.category ?? true,
            tags: pop.tags ?? true,
            updatedBy: pop.updatedBy ?? true,
            createdBy: pop.createdBy ?? true,
        };

        // 2. 分页参数
        const { page = 1, pageSize = 25 } = (ctx.query.pagination as any) || {};
        const start = (Number(page) - 1) * Number(pageSize);
        const limit = Number(pageSize);

        // 3. 查总数 + 当前页
        const [total, results] = await Promise.all([
            strapi.documents('api::post.post').count({ ...ctx.query, populate, status: 'published' }),
            strapi.documents('api::post.post').findMany({
                ...ctx.query,
                populate,
                status: 'published',
                limit,
                start,
            }),
        ]);

        // 4. 保持 REST 格式
        ctx.body = {
            data: results,
            meta: { pagination: { page, pageSize: limit, total } },
        };
    },
}));
