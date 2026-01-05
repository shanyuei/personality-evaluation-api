"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const controller = strapi_1.factories.createCoreController('api::category.category', ({ strapi }) => ({
    async findAllWithPostCount(ctx) {
        const data = await strapi.service('api::category.category').findAllWithPostCount(ctx);
        ctx.body = { data };
    },
}));
exports.default = controller;
