// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import icons from 'unplugin-icons/vite';

// Detecta dinamicamente a porta que a GoDaddy está disponibilizando no container
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4321;

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  
  // Força as configurações de servidor tanto para o build final quanto para o modo "astro dev"
  server: {
    host: '0.0.0.0', // Substitui 127.0.0.1 para aceitar o tráfego do container
    port: PORT
  },
  
  // Isso garante que se o Vite/Astro tentar subir em modo dev, ele respeite a porta da GoDaddy
  preview: {
    host: '0.0.0.0',
    port: PORT
  },

  vite: {
    plugins: [
      tailwindcss(),
      icons({ compiler: 'astro' })
    ]
  }
});