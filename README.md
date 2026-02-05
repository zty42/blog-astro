# Digital Disk — Astro Blog

一个基于 Astro 的静态博客，支持 Markdown/MDX、标签、归档、RSS、SEO，以及浅/深色主题切换。

## 功能特性

- Astro 静态站点生成
- Markdown / MDX 内容支持
- 标签与归档页
- RSS 输出
- 结构化数据（JSON-LD）
- Tailwind CSS + Typography
- 深浅色主题切换

## 运行环境

- Node.js 18.x 或更高
- npm 或 yarn

## 快速开始

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```
默认访问地址：`http://localhost:4321`

### 构建与预览
```bash
npm run build
npm run preview
```

## 项目结构

- `src/pages/` 页面路由
- `src/content/blog/` 博客内容（Markdown/MDX）
- `src/components/` 通用组件
- `src/layouts/` 页面布局
- `src/styles/` 全局样式
- `public/` 静态资源

## 内容规范

文章内容存放在 `src/content/blog/`，frontmatter 示例：

```yaml
---
title: "标题"
date: "2025-03-28"
tags: [notes, weekly]
---
```

- `date` 使用 `YYYY-MM-DD` 格式
- `tags` 为可选

## 路由说明

- 首页：`/`
- 归档：`/archive`
- 标签列表：`/tags`
- 标签详情：`/tags/<tag>`
- 文章详情：`/posts/<slug>`

## 脚本

- `npm run dev` 本地开发
- `npm run build` 构建静态站点
- `npm run preview` 本地预览构建结果

## 许可证

MIT
