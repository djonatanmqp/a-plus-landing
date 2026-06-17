# A-Plus Pavers & Grass | Institutional Site & Admin Panel

![Astro](https://img.shields.io/badge/Astro-v4.15.0-252525?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.4.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![unplugin-icons](https://img.shields.io/badge/unplugin--icons-v0.19.0-646CFF?style=for-the-badge&logo=unplugin&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v20.14.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Este repositório contém a solução digital completa para a **A-Plus Pavers & Grass**, localizada em Orlando, Flórida. O projeto integra um site institucional de alta performance com foco em conversão e um painel administrativo exclusivo para gestão de conteúdo sem banco de dados.

## 🏗 Visão Geral da Solução

O projeto foi desenhado para unir performance extrema no frontend com autonomia operacional para o cliente final:

* **Site Institucional**: Apresentação dos serviços (Pavers, Grass, Driveways), galeria de fotos e depoimentos de clientes, otimizado para SEO local em Orlando.
* **Painel Administrativo**: Interface segura onde o cliente pode atualizar galerias de fotos e adicionar novos depoimentos (com sistema de *upload* de fotos "Antes & Depois") sem depender de um banco de dados, utilizando arquivos estáticos e JSON para persistência.

## 🛠 Tecnologias Utilizadas

* **Framework:** [Astro](https://astro.build/) (Renderização estática e performance).
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Componentização e responsividade).
* **Gestão de Dados:** Sistema baseado em File System (Node.js) com Markdown e JSON.
* **Ícones:** [unplugin-icons](https://github.com/antfu/unplugin-icons) (Material Design & Simple Icons).
* **Linguagens:** TypeScript e Astro (JSX/TSX).

## 📂 Estrutura do Projeto

```text
/
├── public/                  # Ativos estáticos públicos acessíveis diretamente via URL
│   ├── services/            # Pastas de armazenamento de assets gerenciados por serviço (uploads)
│   │   ├── driveways/       # Imagens dedicadas para Driveways
│   │   ├── lawn/            # Imagens dedicadas para Artificial Lawn / Gramados
│   │   ├── others/          # Imagens para serviços secundários ou complementares
│   │   ├── patios/          # Imagens dedicadas para Patios & Walkways
│   │   ├── pergolas/        # Imagens dedicadas para Pergolas & Woodwork
│   │   └── pools/           # Imagens dedicadas para Pool Decks & Remodeling
│   └── uploads/             # Destino central de uploads gerados dinamicamente via painel
│       └── testimonials/    # Fotos organizadas por slugs (before.jpg e after.jpg) dos clientes
├── src/                     # Código-fonte da aplicação compilado pelo Astro
│   ├── components/          # UI components reutilizáveis (TestimonialCard, Gallery, Contact, Header, Footer)
│   ├── content/             # Coleções de dados locais baseados em Markdown (.md) para depoimentos
│   ├── data/                # Arquivos estáticos de configuração estrutural da aplicação (ex: services.json)
│   ├── layouts/             # Estruturas base de renderização HTML (Layout.astro) compartilhadas entre páginas
│   ├── lib/                 # Funções utilitárias do back-end (Auth, JWT, leitura/escrita de arquivos com fs/promises)
│   └── pages/               # Sistema de roteamento baseado em arquivos da aplicação (Páginas e API Endpoints)
│   │   ├── admin/           # Interface visual do painel de controle administrativo (/admin.astro)
│   │   │   └── api/         # Endpoints de API server-side (POST de login, logout, service e testimonial)
│   │   └── services/        # Rotas públicas de serviços, contendo a rota dinâmica [id].astro para páginas individuais
│   ├── styles/              # Configurações globais de estilização CSS e integrações do Tailwind CSS
│   └── types/               # Definições de tipagem global TypeScript para tipar serviços e depoimentos
└── package.json
```

## 🧞 Comandos de Desenvolvimento

Todos os comandos devem ser executados na raiz do projeto:

| Comando | Ação |
| :--- | :--- |
| `npm install` | Instala as dependências do projeto |
| `npm run dev` | Inicia o servidor local (`localhost:4321`) |
| `npm run build` | Compila o projeto para produção |
| `npm run preview` | Testa a versão de produção localmente |

## 🚀 Como acessar o painel

1. O painel administrativo encontra-se na rota `/admin`.
2. A autenticação é gerenciada internamente via `SESSION_COOKIE_NAME` configurada no arquivo `lib/admin.ts`.

## 👀 Mais informações

Caso precise de assistência técnica ou documentação sobre os componentes, consulte a [documentação oficial do Astro](https://docs.astro.build).

---

*Desenvolvido para A-Plus Pavers & Grass LLC. - Orlando, FL.*