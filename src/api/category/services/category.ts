import { factories } from '@strapi/strapi';


const service = factories.createCoreService('api::category.category', ({ strapi }) => ({
    async findAllWithPostCount(ctx) {
        // 先获取总数
        const count = await strapi.documents('api::category.category').count({
            locale: ctx.request.query.locale,
        });
        // 再获取分页数据
        const categories = await strapi.documents('api::category.category').findMany({
            populate: { posts: { count: true } }, // v5 支持 count 聚合
            locale: ctx.request.query.locale,
            limit: count,
            start: 0,
        });
        return categories
    },
}));

export default service;