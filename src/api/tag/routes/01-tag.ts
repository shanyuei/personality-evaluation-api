export default {
  routes: [
    {
      method: 'GET',
      path: '/tags/top-5', // 想叫什么随意
      handler: 'tag.findTop5Tags',
      config: {
        auth: false, // 如需权限改成 true 或加 policy
      },
    },
  ],
};