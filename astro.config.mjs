// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import icons from 'unplugin-icons/vite'; // Importe o plugin

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  
  // Adicione esta seção de servidor para resolver o erro EACCES da porta 4321
  server: {
    host: true, // Permite conexões externas (0.0.0.0) em vez de travar em 127.0.0.1
    port: process.env.PORT ? parseInt(process.env.PORT) : 4321 // Usa a porta dinâmica do servidor
  },

  vite: {
    plugins: [
      tailwindcss(),
      icons({ compiler: 'astro' }) // Adicione aqui
    ]
  }
});