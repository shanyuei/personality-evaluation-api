"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const service = strapi_1.factories.createCoreService('api::category.category', ({ strapi }) => ({
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
            status: 'published',
        });
        return categories;
    },
}));
exports.default = service;
