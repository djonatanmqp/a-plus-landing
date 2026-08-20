// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import icons from 'unplugin-icons/vite';

// https://astro.build/config
export default defineConfig({
  // Vercel exige output 'server' ou 'hybrid'
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  
  vite: {
    plugins: [
      tailwindcss(),
      icons({ compiler: 'astro' })
    ]
  }
});