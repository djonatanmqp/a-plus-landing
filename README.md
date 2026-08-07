# A-Plus Pavers & Grass | Institutional Site & Admin Panel

![Astro](https://img.shields.io/badge/Astro-v4.15.0-252525?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.4.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-v10.12.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-v20.14.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Este repositório contém a solução digital completa para a **A-Plus Pavers & Grass LLC.**, localizada em Orlando, Flórida. O projeto integra um site institucional de alta performance com foco em conversão e um painel administrativo exclusivo para gestão de conteúdo.

## 🏗 Visão Geral da Solução

O projeto foi desenhado para unir performance extrema no frontend com autonomia operacional para o cliente final:

* **Site Institucional**: Apresentação dos serviços (Pavers, Grass, Driveways, Patios, Pergolas e Pools), galeria de fotos dinâmicas, FAQ e depoimentos de clientes, otimizado para SEO local em Orlando.
* **Painel Administrativo**: Interface segura onde o cliente pode gerenciar serviços, FAQs, galerias e depoimentos.
* **Persistência de Mídia via GitHub API**: As mídias e uploads realizados pelo painel são comitados automaticamente no repositório GitHub via API REST (`@octokit/rest`), garantindo que o armazenamento permaneça versionado e integrado ao build.

## 🛠 Tecnologias Utilizadas

* **Framework:** [Astro](https://astro.build/) (SSR / Hybrid rendering para suporte às rotas de API do painel).
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Classes utilitárias e design responsivo).
* **Autenticação e Serviços:** [Firebase Admin / Server](https://firebase.google.com/) (Gerenciamento de autenticação e sessão no painel admin).
* **Armazenamento de Mídia:** GitHub REST API (Upload automático de imagens diretamente para a pasta `/public`).
* **Ícones:** [unplugin-icons](https://github.com/antfu/unplugin-icons) (Material Design Icons).
* **Linguagens:** TypeScript e Astro Core.

## 📂 Estrutura do Projeto

```text
/
├── public/                  # Ativos estáticos públicos
│   ├── assets/              # Assets organizados por entidade
│   │   ├── content/         # Mídias dinâmicas (testimonials)
│   │   ├── services/        # Imagens dedicadas por serviço (driveways, lawn, etc)
│   │   ├── company.json     # Informações gerais da empresa
│   │   ├── faq.json         # Perguntas frequentes
│   │   └── services.json    # Dados dos serviços
│   ├── favicon.ico
│   ├── logo.png
│   └── robots.txt
├── src/                     # Código-fonte da aplicação
│   ├── components/          # Componentes de interface (Header, Footer, ZoomModal, etc.)
│   ├── layouts/             # Estrutura base de renderização (Layout.astro)
│   ├── lib/                 # Integrações de backend (github-storage.ts, firebase-admin.ts, admin.ts)
│   ├── pages/               # Roteamento e APIs
│   │   ├── admin/           # Dashboard e Endpoints de API (/admin/api/*)
│   │   ├── services/        # Páginas dinâmicas de serviços ([id].astro)
│   │   ├── admin.astro      # Página de login/gerenciamento
│   │   ├── index.astro      # Homepage
│   │   └── sitemap.xml.ts   # Geração dinâmica do Sitemap
│   ├── styles/              # CSS global e integrações Tailwind
│   └── types/               # Tipagens TypeScript (icons.d.ts)
├── .env.example             # Exemplo de variáveis de ambiente necessárias
├── astro.config.mjs         # Configurações do Astro
└── package.json
```

## ⚙️ Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Configurações do GitHub para upload pelo Admin
GITHUB_TOKEN=ghp_SeuTokenAqui
GITHUB_OWNER=SeuUsuario
GITHUB_REPO=NomeDoRepositorio
GITHUB_BRANCH=main

# Configurações do Firebase
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=seu-client-email
FIREBASE_PRIVATE_KEY="sua-chave-privada"
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

2. A autenticação utiliza Firebase Auth e cookies de sessão gerenciados via Server-Side Rendering (SSR).

3. Ao cadastrar ou atualizar imagens no painel, elas são automaticamente enviadas para o repositório no GitHub via `github-storage.ts`. Para visualizar os arquivos atualizados em seu ambiente local de desenvolvimento, execute um `git pull origin main`.

## 👀 Mais informações

Caso precise de assistência técnica ou documentação sobre os componentes, consulte a [documentação oficial do Astro](https://docs.astro.build).

---

*Desenvolvido para A-Plus Pavers & Grass LLC. - Orlando, FL.*