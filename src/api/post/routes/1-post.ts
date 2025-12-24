export default {
    routes: [
        // 获取推荐的文章
        {
            method: 'GET',
            path: '/post/top-recommended',
            handler: 'post.topRecommended',
            config: {
                auth: false, // 如需权限改成 true 或加 policy
            },
        },
        // 增加预览次数
        {
            method: 'PUT',
            path: '/post/increment-preview',
            handler: 'post.incrementPreviewCount',
            config: {
                auth: false,
            },
        },
        // 获取最新的五条数据
        {
            method: 'GET',
            path: '/post/news-5',
            handler: 'post.getNews5',
            config: {
                auth: false, // 如需权限改成 true 或加 policy
            },
        },
        {
            method: 'GET',
            path: '/post/except-top-recommended-all', // 想叫什么随意
            handler: 'post.exceptTopRecommended',
            config: {
                auth: false, // 如需权限改成 true 或加 policy
            },
        },


    ],
};