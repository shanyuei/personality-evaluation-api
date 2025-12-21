// src/api/category/lifeguards.ts
export default ({ strapi }) => ({
  async beforeCreate(event) {
    console.log('>>> beforeCreate Category', event);
  },

  async afterCreate(event) {
    const { result } = event;
    // 统计文章数示例
    if (result.id) {
      await strapi.service('api::category.category').update(result.id, {
        data: { postCount: 0 },
      });
    }
  },

  async afterUpdate(event) {
    // 重算文章数
    const oldCats = event.result.category?.map(c => c.id) ?? [];
    const newCats = event.params.data?.category?.connect ?? [];
    const delCats = event.params.data?.category?.disconnect ?? [];
    const needUpdate = [...new Set([...oldCats, ...newCats, ...delCats])];
    for (const catId of needUpdate) {
      const count = await strapi.db.query('api::article.article').count({
        where: { category: catId, publishedAt: { $notNull: true } },
      });
      await strapi.service('api::category.category').update(catId, {
        data: { postCount: count },
      });
    }
  },
});