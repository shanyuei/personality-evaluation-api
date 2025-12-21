export default {
  routes: [
    {
      method: 'GET',
      path: '/custom-categories/with-count', // 想叫什么随意
      handler: 'category.findAllWithPostCount',
      config: {
        auth: false, // 如需权限改成 true 或加 policy
      },
    },
  ],
};