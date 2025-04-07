# Notion-Powered Static Blog

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

基于 Next.js App Router 和 Notion API 构建的高性能静态博客，Notion 作为内容管理系统，支持增量静态再生（ISR）和丰富的交互体验。

## 特性亮点

- 基于 Notion 的零成本内容管理
- 自动增量静态生成（ISR）
- 暗黑模式支持
- 响应式设计
- 可定制的 UI 组件（Shadcn UI）
- 流畅的动画交互（Motion）
- 内置 SEO 优化

## 技术栈

- ​**​ 框架 ​**​: Next.js 15 (App Router)
- ​**​ 数据层 ​**​: Notion API
- ​**​ 样式 ​**​: Tailwind CSS
- ​**​ 组件库 ​**​: Shadcn UI
- ​**​ 动画 ​**​: Motion

## Notion 配置

1. 复制[模板数据库](https://zephyrrr.notion.site/1be1f833110780d98383fc637676cee8?v=1be1f833110780839e62000c8c92f8e3&pvs=4)
2. 修改数据库权限为公开

3. 获取 Notion 数据库 ID：

   - 复制 URL 中 `?v=` 之前的部分（如：`1be1f833110780d98383fc637676cee8`）

4. 配置环境变量

```env
NOTION_PAGE_ID=你的数据库ID
```

## 本地开发

```bash
pnpm i && pnpm dev
```
