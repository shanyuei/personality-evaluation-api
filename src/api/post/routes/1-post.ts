export default {
    routes: [
        {
            method: 'GET',
            path: '/post/except-top-recommended-all', // 想叫什么随意
            handler: 'post.exceptTopRecommended',
            config: {
                auth: false, // 如需权限改成 true 或加 policy
            },
        },
        {
            method: 'GET',
            path: '/post/top-recommended', // 想叫什么随意
            handler: 'post.findTop5Tags',
            config: {
                auth: false, // 如需权限改成 true 或加 policy
            },
        },
        {
            method: 'GET',
            path: '/post/top-preview-count',
            handler: 'post.findTop5ByPreviewCount',
            config: {
              auth: false, // 如需权限改成 true 或加 policy
            },
        }
    ],
};