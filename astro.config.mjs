// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkImgattr from 'remark-imgattr';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
const ztyLightTheme = JSON.parse(
  readFileSync(new URL('./src/shiki/zty-light.json', import.meta.url), 'utf-8'),
);
const ztyDarkTheme = JSON.parse(
  readFileSync(new URL('./src/shiki/zty-dark.json', import.meta.url), 'utf-8'),
);

export default defineConfig({
  site: 'https://zty.im',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkImgattr],
    shikiConfig: {
      themes: {
        light: ztyLightTheme,
        dark: ztyDarkTheme,
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
