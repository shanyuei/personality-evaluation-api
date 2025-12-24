/**
 * post service
 */

import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::post.post', ({ strapi }) => ({
    // 1. 取出最新 5 条「已发布 + 推荐 + 可以根据参数进行分类筛选和多语言筛选」的
    async topRecommended(ctx) {
        const locale = ctx.request.query.locale || 'zh-Hans';
        const { categoryId, categorySlug } = ctx.request.query;
        const filters: any = {
            recommend: true,
            category: {
                $or: [

                ]
            },
        };
        if (categoryId) {
            filters.category.$or.push({ id: Number(categoryId) });
        }
        if (categorySlug) {
            filters.category.$or.push({ slug: String(categorySlug).trim() });
        }
        let posts = await strapi.documents('api::post.post').findMany({
            locale,
            filters,
            status: 'published',
            sort: { publishedAt: 'desc' },
            limit: 5,
            populate: {
                cover: { fields: "*" },
                category: { fields: "*" },
                tags: { fields: "*" },
            },
        });
        return posts;
    },
    // 获取最新的五条数据 并且 要排除 推荐的文章
    async getNews5(ctx) {
        const locale = ctx.request.query.locale || 'zh-Hans';
        const recommendPosts = await this.topRecommended(ctx);
        const { categorySlug, categoryId } = ctx.request.query;
        const filters: any = {
            documentId: { $notIn: recommendPosts.map((p) => p.documentId) },
            category: {
                $or: [
                ]
            },
        };
        if (categoryId) {
            filters.category.$or.push({ id: Number(categoryId) });
        }
        if (categorySlug) {
            filters.category.$or.push({ slug: String(categorySlug).trim() });
        }
        const news5 = await strapi.documents('api::post.post').findMany({
            locale,
            filters,
            sort: { publishedAt: 'desc' },
            status: 'published',
            populate: {
                cover: { fields: "*" },
                category: { fields: "*" },
                tags: { fields: "*" },
            },
            limit: 5,
        });
        return news5;
    },

    /**
      * 获取除了最新的五条和 推荐的五条之外的数据，并且 根据 浏览总数排序
      * GET /api/posts/except-top-recommended
      */
    async exceptTopRecommended(ctx) {
        const locale = ctx.request.query.locale || 'zh-Hans';
        const { page = 1, pageSize = 20 } = ctx.request.query.pagination || {};
        const { categorySlug, categoryId, tagSlug } = ctx.request.query;
        const top5 = await this.topRecommended(ctx);
        const news5 = await this.getNews5(ctx);
        const excludedIds = [
            ...top5.map((p) => p.documentId),
            ...news5.map((p) => p.documentId),
        ];
        const filters: any = {
            documentId: { $notIn: excludedIds },
            category: {
                $or: [],
            },
            tags: {
                $or: [],
            },
        };
        if (categoryId) {
            filters.category.$or.push({ id: Number(categoryId) });
        }
        if (categorySlug) {
            filters.category.$or.push({ slug: String(categorySlug).trim() });
        }
        if (tagSlug) {
            filters.tags.$or.push({ slug: String(tagSlug).trim() });
        }
        
        const count = await strapi.documents('api::post.post').count({
            locale,
            filters,
        });
        console.log('count',count);
        console.log('filters',filters);
        const posts = await strapi.documents('api::post.post').findMany({
            locale,
            filters,
            sort: { previewCount: 'desc', publishedAt: 'desc' },
            status: 'published',
            populate: {
                cover: { fields: "*" },
                category: { fields: "*" },
                tags: { fields: "*" },
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


}));
