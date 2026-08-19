# A-Plus Pavers & Grass | Institutional Site & Admin Panel

![Astro](https://img.shields.io/badge/Astro-v4.15.0-252525?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.4.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-v2.0-3FCF8E?style=for-the-badge&logo=supabase&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-v20.14.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Este repositório contém a solução digital completa para a **A-Plus Pavers & Grass LLC.**, localizada em Orlando, Flórida. O projeto integra um site institucional de alta performance com foco em conversão e um painel administrativo exclusivo para gestão de conteúdo.

## 🏗 Visão Geral da Solução

O projeto foi desenhado para unir performance extrema no frontend com autonomia operacional para o cliente final:

* **Site Institucional**: Apresentação dos serviços (Pavers, Grass, Driveways, Patios, Pergolas e Pools), galeria de fotos dinâmicas, FAQ e depoimentos de clientes, otimizado para SEO local em Orlando.
* **Painel Administrativo**: Interface segura modularizada e separada por abas/arquivos, onde o cliente gerencia serviços, FAQs, galerias e depoimentos com suporte completo a CRUD.
* **Persistência de Dados e Mídia**: Gerenciamento integrado com **Supabase** (Banco de Dados PostgreSQL) e **Supabase Storage** para upload e armazenamento otimizado de imagens.

## 🛠 Tecnologias Utilizadas

* **Framework:** [Astro](https://astro.build/) (SSR / Hybrid rendering para suporte às rotas de API do painel).
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Classes utilitárias e design responsivo).
* **Banco de Dados e Armazenamento:** [Supabase](https://supabase.com/) (PostgreSQL e Supabase Storage para arquivos).
* **Autenticação:** Sistema de sessão seguro baseado em tokens e cookies SSR.
* **Ícones:** [unplugin-icons](https://github.com/antfu/unplugin-icons) (Material Design Icons).
* **Linguagens:** TypeScript e Astro Core.

## 📂 Estrutura do Projeto

```text
/
├── public/                  # Ativos estáticos públicos
│   ├── favicon.ico
│   ├── logo.png
│   └── robots.txt
├── src/                     # Código-fonte da aplicação
│   ├── components/          # Componentes de interface (incluindo abas do Admin separadas por arquivo)
│   ├── layouts/             # Estrutura base de renderização (Layout.astro)
│   ├── lib/                 # Integrações de backend (supabase.js, admin.ts)
│   ├── pages/               # Roteamento e APIs
│   │   ├── admin/           # Dashboard e Endpoints de API (/admin/api/*)
│   │   ├── services/        # Páginas dinâmicas de serviços ([id].astro)
│   │   ├── admin.astro      # Página de login/gerenciamento
│   │   ├── index.astro      # Homepage
│   │   └── sitemap.xml.ts   # Geração dinâmica do Sitemap
│   ├── styles/              # CSS global e integrações Tailwind
│   └── types/               # Tipagens TypeScript (Supabase Types)
├── .env.example             # Exemplo de variáveis de ambiente necessárias
├── astro.config.mjs         # Configurações do Astro
└── package.json
```

## ⚙️ Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Configurações do Supabase
PUBLIC_SUPABASE_URL=sua_supabase_url
PUBLIC_SUPABASE_ANON_KEY=sua_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

## 🧞 Comandos de Desenvolvimento

Todos os comandos devem ser executados na raiz do projeto:

| Comando | Ação |
| :--- | :--- |
| `npm install` | Instala as dependências do projeto |
| `npm run dev` | Inicia o servidor local (`localhost:4321`) |
| `npm run build` | Compila o projeto para produção |
| `npm run preview` | Testa a versão de produção localmente |
| `node gerar-pdf.js` | Executa a varredura do Puppeteer e gera os relatórios em `/preview` |

⚠️ **Nota para a Auditoria:** Antes de rodar node gerar-pdf.js, certifique-se de que o servidor local do Astro está de fato rodando em background através do comando `npm run dev`.

## 🚀 Painel Administrativo

1. O painel está acessível na rota `/admin`.

2. A autenticação valida a sessão via cookies seguros no servidor.

3. As operações de cadastro, edição e exclusão (incluindo gerenciamento de mídias no Storage e campos detalhados como localização e datas em depoimentos) refletem diretamente nas tabelas do Supabase.

## 👀 Mais informações

Caso precise de assistência técnica ou documentação sobre os componentes, consulte a [documentação oficial do Astro](https://docs.astro.build).

---

*Desenvolvido para A-Plus Pavers & Grass LLC. - Orlando, FL.*