// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import icons from 'unplugin-icons/vite';

// Verifica se estamos rodando na Vercel ou localmente
const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  // Se for Vercel, usa 'server', se for local, usa 'static' (padrão)
  output: isVercel ? 'server' : 'static',
  adapter: isVercel ? vercel({ webAnalytics: { enabled: true } }) : undefined,
  
  vite: {
    plugins: [
      tailwindcss(),
      icons({ compiler: 'astro' })
    ]
  }
});