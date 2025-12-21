// src/api/post/content-types/post/lifeguards.js
export default ({ strapi }) => ({
  async afterCreate(event) {
    const { result } = event;
    if (!result) return;

    // 1. 补作者（示例）
    if (!result.author && result.createdBy) {
      await strapi.service('api::post.post').update(result.id, {
        data: { author: result.createdBy.id }
      });
    }

    // 2. 重算分类
    await recountCategories(result, null);
  },

  async afterUpdate(event) {
    const { result, params } = event;
    if (!result) return;

    const oldCats = result.category?.map(c => c.id) || [];
    const newCats = params.data?.category?.connect || [];
    const delCats = params.data?.category?.disconnect || [];
    const changed = [...new Set([...oldCats, ...newCats, ...delCats])];

    if (changed.length) await recountCategories(result, oldCats);
  },

  async afterDelete(event) {
    const { result } = event;
    if (!result) return;

    const oldCats = result.category?.map(c => c.id) || [];
    for (const catId of oldCats) await recountArticles(catId);
  }
});

/* 通用：重算指定分类已发布文章数 */
async function recountArticles(categoryId) {
  const count = await strapi.db.query('api::post.post').count({
    where: { category: categoryId, publishedAt: { $notNull: true } }
  });
  await strapi.service('api::category.category').update(categoryId, {
    data: { postCount: count }
  });
}

/* Post 专用：批量重算差异分类 */
async function recountCategories(result, oldCats) {
  const newCats = result.category?.map(c => c.id) || [];
  const toUpdate = [...new Set([...(oldCats || []), ...newCats])];
  for (const catId of toUpdate) await recountArticles(catId);
}