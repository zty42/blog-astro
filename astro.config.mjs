// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://zty.im',
  integrations: [mdx(), sitemap(), react()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'dracula',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
