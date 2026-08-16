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
    host: '0.0.0.0', // Aceita conexões externas no container
    port: PORT
  },
  
  vite: {
    // ESSA SEÇÃO ABAIXO RESOLVE O BLOQUEIO DE HOST DO VITE:
    server: {
      allowedHosts: [
        'ev8pof7pz3.preview.c37.airoapp.ai', // Permite o seu host temporário específico
        '.airoapp.ai'                        // Permite qualquer subdomínio da plataforma, caso mude
      ]
    },
    plugins: [
      tailwindcss(),
      icons({ compiler: 'astro' })
    ]
  }
});