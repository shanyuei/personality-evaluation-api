"use strict";
/**
 * post controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::post.post', ({ strapi }) => ({
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
        var _a, _b, _c, _d, _e;
        // 1. 拼装 populate（白名单）
        const pop = ctx.query.populate || {};
        const populate = {
            ...pop,
            cover: (_a = pop.cover) !== null && _a !== void 0 ? _a : true,
            category: (_b = pop.category) !== null && _b !== void 0 ? _b : true,
            tags: (_c = pop.tags) !== null && _c !== void 0 ? _c : true,
            updatedBy: (_d = pop.updatedBy) !== null && _d !== void 0 ? _d : true,
            createdBy: (_e = pop.createdBy) !== null && _e !== void 0 ? _e : true,
        };
        // 2. 分页参数
        const { page = 1, pageSize = 25 } = ctx.query.pagination || {};
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
