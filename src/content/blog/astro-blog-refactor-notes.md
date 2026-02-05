---
title: "让 CodeX 帮我重新优化了一下博客 UI"
date: "2026-02-05"
tags: [astro, tailwindcss]
---

这篇文章记录一次“从能用到顺手”的博客改造过程：把内容模型统一、把 UI/UX 的小毛刺磨平、把主题色落成可维护的设计 token，再补齐一些写作/维护的小工具。

## 目标

- 内容侧：日期类型统一、列表/归档/标签页行为一致、RSS 链接正确。
- 体验侧：深浅色切换稳定、hover 统一、标题层级更清晰、移动端列表更顺眼。
- 视觉侧：用一套 Light/Dark 主题变量驱动全站，减少“到处写颜色”。
- 工具侧：`npm run new` 一键生成文章模板。

## 内容与数据模型

### 1) 修正 RSS 路径

站内文章路由是 `/posts/<slug>/`，因此 RSS item 也需要指向这个路径（避免订阅器里点开 404）。

### 2) 统一日期类型与格式

内容集合的 `date` 改为强制转换成 `Date`，这样页面里排序/分组不会到处 `new Date()`：

```ts
// src/content.config.ts
date: z.coerce.date(),
```

同时把现有文章 frontmatter 日期统一为 `YYYY-MM-DD`，避免归档分组时对 `YYYY/MM/DD` 这种格式产生隐式依赖。

## UI / UX 调整

### 1) 列表项在移动端更好读

列表页（首页/归档/标签）的小屏布局改为「标题在上、时间在下」；大屏保持「时间在前、标题在后」。

### 2) 主题切换按钮（Dark/Light）

主题切换的关键点是：不要依赖全局唯一 id 去找按钮（因为响应式布局可能出现多个实例），而是让每个组件实例绑定自己的事件，避免“窄屏可用、宽屏失效”。

### 3) Hover 统一成可复用样式

全站链接 hover 统一为：

- hover 才出现下划线
- 下划线偏移 `underline-offset` 拉开距离
- `decoration-color` 使用主色（primary）
- 加 `transition` 避免主题切换时的闪烁

核心样式是一个工具类：

```css
.link-hover {
  text-underline-offset: 4px;
  text-decoration-color: var(--color-primary, #eb5600);
  transition-property: color, text-decoration-color;
  transition-duration: 200ms;
  transition-timing-function: ease;
}
.link-hover:hover,
.link-hover:focus-visible {
  text-decoration-line: underline;
}
```

## 主题色（Design Tokens）

把 Light/Dark 两套主题色落到 `src/styles/global.css` 的 CSS 变量中，然后通过 Tailwind v4 的 `@theme inline` 映射成语义化颜色：

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  /* ... */
}
```

这样页面里就可以用 `bg-background`、`text-foreground`、`text-muted-foreground`、`border-border` 这类语义类名，主题切换只需要改变量，不用到处改组件。

另外也顺手清理了“定义了但项目里没用到”的变量，避免主题文件越堆越乱。

## 文章内排版（Prose）

文章内容由 Tailwind Typography 的 `prose` 提供基础排版，再按站点风格调整：

- H1–H6 的字号重新设定，层级更稳定
- 每一级标题加一个 `#` 伪元素装饰，并使用主色（primary）

装饰的核心规则类似：

```css
.prose :is(h1, h2, h3, h4, h5, h6)::before {
  content: "#";
  margin-right: 0.5rem;
  color: var(--color-primary, #eb5600);
  font-weight: 600;
  opacity: 0.9;
}
```

## 视觉资产：Logo / 字体 / 小图标

- Logo：把一份 SVG 做成 `currentColor` 的内联组件，这样自动适配 Light/Dark（不需要为两套主题各存一份图）。
- 标题字体：在 `public/` 放入字体文件，通过 `@font-face` 引入，并用于站点标题。
- “Browse archive” 的右侧小图标：用一个轻量的 SVG 组件替代 emoji，保证风格一致、暗黑模式也不会突兀。

## 写作效率：npm run new

新增一个 `npm run new` 命令，用来生成文章模板到 `src/content/blog/`。

```bash
npm run new
```

为了不引入额外依赖，脚本对中文标题采取“显式 slug”策略：当标题无法自动 slugify 时，会提示你输入 slug，避免生成一堆不可读的文件名。

## 结语

这次改造最大的收益不是“加了很多功能”，而是把主题、排版和内容模型的边界理顺：以后想换色、换排版、换列表样式，都能在更少的地方改动，并且不容易引入回归。

