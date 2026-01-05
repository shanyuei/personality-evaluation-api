"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/categories/with-count', // 想叫什么随意
            handler: 'category.findAllWithPostCount',
            config: {
                auth: false, // 如需权限改成 true 或加 policy
            },
        },
    ],
};
