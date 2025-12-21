## 目标修订
* 在原有多语言设计基础上，所有实体（Category/Tag/BlogPost）新增显式 `lang` 字段，用于标识该数据的语言。
* 保持与 i18n 的 `locale` 同步，避免 `lang` 与 `locale` 不一致。

## 语言字段与同步
* 为 Category、Tag、BlogPost 增加 `lang` 字段（枚举或字符串），枚举建议：`zh-CN`、`en`、`ja`（与 i18n locales 对齐）。
* 统一规则：`lang === locale`。
* 生命周期钩子：
  * `beforeCreate/BeforeUpdate`：若启用 i18n，则自动将实体的 `lang` 设为当前 `locale`；若传入的 `lang` 与 `locale` 不一致则报错。
  * `beforeFind`：支持按 `filters[lang]` 或 `locale` 查询，两者都传时优先校验一致性。
* 校验：`lang` 必填；必须落在允许的枚举值；与 `locale` 严格一致。

## 数据模型（包含 lang）
* Category：
  * name（本地化，必填）
  * slug（UID，全局唯一）
  * description（本地化，可选）
  * visibility（枚举：public/hidden，默认 public）
  * lang（枚举：`zh-CN`、`en`、`ja`，必填）
* Tag：
  * name（本地化，必填）
  * slug（UID，全局唯一）
  * description（本地化，可选）
  * lang（枚举，必填）
* BlogPost：
  * title（本地化，必填）
  * slug（UID，全局唯一）
  * summary（本地化，可选）
  * content（本地化，富文本/Markdown，必填）
  * coverImage（媒体，单图）
  * categories（多对多：Category[]，同语言）
  * tags（多对多：Tag[]，同语言）
  * relatedPosts（多对多自关联：BlogPost[]，同语言；需排除自身）
  * status（枚举：draft/published，默认 draft）
  * publishedAt（日期时间）
  * author（字符串或用户关系，按需）
  * seo（metaTitle、metaDescription、keywords[]）
  * readingTime（整数，自动或手填）
  * lang（枚举，必填，与 `locale` 同步）

## 多语言策略（更新）
* 仍启用 i18n 插件，配置 locales：`zh-CN`、`en`、`ja`。
* 每条内容的 `lang` 与 `locale` 保持一致；后台切换语言时自动同步 `lang`。
* 若不启用 i18n（可选方案），也可仅用 `lang` 字段进行分语言存储；但建议保留 i18n 以便管理与界面友好。

## 关联与约束（同语言）
* 选择分类/标签/相关文章时仅允许选择同 `lang` 的数据，避免跨语言混用。
* 可在组件层或生命周期钩子中拦截并校验（如 `beforeUpdate` 过滤或报错）。

## API 设计（包含 lang 过滤）
* REST 示例：
  * `GET /api/blog-posts?filters[lang][$eq]=zh-CN&populate=categories,tags,relatedPosts,coverImage`
  * `GET /api/categories?filters[lang][$eq]=en`
  * `POST /api/blog-posts`（受保护，`lang` 必填；后台将校验 `lang === locale`）
* 仍支持 `locale` 参数查询；当同时提供 `locale` 与 `lang` 时要求一致。

## 实施步骤（补充）
1. 初始化 Strapi 并连接数据库
2. 安装 i18n 插件，配置 locales
3. 定义 Category/Tag/BlogPost 内容类型，新增 `lang` 字段（枚举）
4. 布局更新：在列表与编辑页展示/编辑 `lang` 字段
5. 生命周期钩子：同步 `lang` 与 `locale`；限制跨语言关联
6. 权限配置：Public 仅 GET；编辑与发布权限按角色
7. 测试：多语言创建与查询、跨语言关联拦截、`lang/locale` 一致性校验

## 验收要点
* 后台切换语言时 `lang` 自动匹配，无不一致情况
* 同语言的数据能正常关联；跨语言关联被阻止
* REST/GraphQL 能按 `lang` 与 `locale` 查询，结果正确
* slug 唯一；发布与草稿流程正常

## 部署与环境
* `.env`：数据库、密钥、`HOST/PORT` 等
* Dev/Test/Prod 分环境部署与备份、监控
