// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import icons from 'unplugin-icons/vite'; // Importe o plugin

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [
      tailwindcss(),
      icons({ compiler: 'astro' }) // Adicione aqui
    ]
  }
});