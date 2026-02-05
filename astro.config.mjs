// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
const ztyLightTheme = JSON.parse(
  readFileSync(new URL('./src/shiki/zty-light.json', import.meta.url), 'utf-8'),
);
const ztyDarkTheme = JSON.parse(
  readFileSync(new URL('./src/shiki/zty-dark.json', import.meta.url), 'utf-8'),
);

export default defineConfig({
  site: 'https://zty.im',
  integrations: [mdx(), sitemap(), react()],
  markdown: {
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
