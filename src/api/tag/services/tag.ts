/**
 * tag service
 */

import { factories } from '@strapi/strapi';





const service = factories.createCoreService('api::tag.tag', ({ strapi }) => ({
    // 获取所有标签
    async findAllTags(ctx) {
        // 先获取总数
        const count = await strapi.documents('api::tag.tag').count({
            locale: ctx.request.query.locale,
        });
        // 再获取分页数据
        const tags = await strapi.documents('api::tag.tag').findMany({
            locale: ctx.request.query.locale,
            limit: count,
            start: 0,
        });
        return tags
    },
    // 获取关联文章最多的5个tags
    async findTop5Tags(ctx) {
        let locale = ctx.request.query.locale || 'zh-Hans';

        // 1. 查出所有 Tag（带上 posts id 列表）
        const tags = await strapi.documents('api::tag.tag').findMany({
            locale,
            populate: { posts: { fields: ['id'] } }, // 只要 id 即可
        });

        // 2. 统计每个 tag 的已发布 post 数量
        const counted = await Promise.all(
            tags.map(async (tag) => {
                const publishedCount = await strapi.documents('api::post.post').count({
                    locale,
                    filters: {
                        $and: [
                            { tags: { id: { $eq: tag.id } } }, // 属于当前 tag
                            { publishedAt: { $ne: null } },   // 已发布
                        ],
                    },
                });
                return { ...tag, postCount: publishedCount };
            })
        );

        // 3. 排序并取前 5
        const top5 = counted
            .sort((a, b) => b.postCount - a.postCount)
            .slice(0, 5)
            .map(({ postCount, ...tag }) => tag); // 去掉临时字段

        return top5
    },
}));

export default service;