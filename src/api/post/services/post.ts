/**
 * post service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::post.post', ({ strapi }) => ({
    // 1. 取出最新 5 条「已发布 + 推荐」的 documentId
    async findTop5Tags(ctx) {
        let locale = ctx.request.query.locale || 'zh-Hans';

        // 1. 取出最新 5 条「已发布 + 推荐」的 documentId
        const top5 = await strapi.documents('api::post.post').findMany({
            locale,
            filters: {
                recommend: true,
                publishedAt: { $notNull: true },
            },
            sort: { publishedAt: 'desc' },
            limit: 5,
        });
        return top5;
    },
    /**
      * 获取「刨掉最新 5 条推荐」的文章列表
      * GET /api/posts/except-top-recommended
      */
    async exceptTopRecommended(ctx) {
        // const {
        //     locale = 'zh-Hans',
        //     pagination: {
        //         page = 1,
        //         pageSize = 20,
        //     }
        // } = ctx.query;
        let locale = ctx.request.query.locale || 'zh-Hans';
        let { page = 1, pageSize = 20 } = ctx.request.query.pagination || {};
        const top5 = await this.findTop5Tags(ctx);
        const excludedIds = top5.map((p) => p.documentId);

        // 2. 查「之外」的文章并分页
        const count = await strapi.documents('api::post.post').count({
            locale,
            filters: {
                // 如果 top5 不足 5 条，$notIn: [] 会被框架忽略，等价于无过滤
                documentId: { $notIn: excludedIds },
            },
            sort: { publishedAt: 'desc' },
            populate: {
                cover: { fields: ['url'] },
                category: { fields: ['name'] },
                tags: { fields: ['name', 'slug'] },
            },

        });
        const posts = await strapi.documents('api::post.post').findMany({
            locale,
            filters: {
                // 如果 top5 不足 5 条，$notIn: [] 会被框架忽略，等价于无过滤
                documentId: { $notIn: excludedIds },
            },
            sort: { publishedAt: 'desc' },
            populate: {
                cover: { fields: ['url'] },
                category: { fields: ['name'] },
                tags: { fields: ['name', 'slug'] },
            },
            limit: Number(pageSize),
            start: (Number(page) - 1) * Number(pageSize),
        });

        return {
            posts,
            meta: {
                limit: Number(pageSize),
                start: (Number(page) - 1) * Number(pageSize),
                total: count,
            },
        };
    },

    /**
      * 获取预览量前五的文章
      * GET /api/posts/top-preview-count
      */
    async findTop5ByPreviewCount(ctx) {
        let locale = ctx.request.query.locale || 'zh-Hans';
        const top5 = await strapi.documents('api::post.post').findMany({
            locale,
            filters: {
            },
            limit: 5,
            populate: {
                cover: { fields: ['url'] },
                category: { fields: ['name'] },
                tags: { fields: ['name', 'slug'] },
            },
        });

        return top5;
    },
}));
