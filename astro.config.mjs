// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { ViteToml } from 'vite-plugin-toml';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: "https://indearborn.com",
  output: 'server',
  integrations: [
    vue(),
    mdx(),
    icon(),
    sitemap()
  ],
  vite: {
    plugins: [tailwindcss(), ViteToml()],
    build: {
      target: 'es2022' // Cloudflare recommends modern ES
    }
  },
  adapter: cloudflare({
    mode: 'directory',
    runtime: {
      bindings: {
        // Add any KV/DO bindings here if needed later
      }
    }
  })
});