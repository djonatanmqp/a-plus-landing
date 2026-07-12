# A-Plus Pavers & Grass | Institutional Site & Admin Panel

![Astro](https://img.shields.io/badge/Astro-v4.15.0-252525?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.4.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![unplugin-icons](https://img.shields.io/badge/unplugin--icons-v0.19.0-646CFF?style=for-the-badge&logo=unplugin&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v20.14.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Este repositório contém a solução digital completa para a **A-Plus Pavers & Grass LLC.**, localizada em Orlando, Flórida. O projeto integra um site institucional de alta performance com foco em conversão e um painel administrativo exclusivo para gestão de conteúdo sem a necessidade de um banco de dados relacional.

## 🏗 Visão Geral da Solução

O projeto foi desenhado para unir performance extrema no frontend com autonomia operacional para o cliente final:

* **Site Institucional**: Apresentação dos serviços (Pavers, Grass, Driveways), galeria de fotos e depoimentos de clientes, otimizado para SEO local em Orlando.
* **Painel Administrativo**: Interface segura onde o cliente pode atualizar galerias de fotos e adicionar novos depoimentos (com sistema de *upload* de fotos "Antes & Depois") sem depender de um banco de dados, utilizando arquivos estáticos e JSON para persistência.

## 🛠 Tecnologias Utilizadas

* **Framework:** [Astro](https://astro.build/) (Renderização estática e performance baseada em ilhas).
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Classes utilitárias e responsividade).
* **Gestão de Dados:** Sistema baseado em File System local (Node.js) com Markdown e JSON.
* **Auditoria Visual:** [Puppeteer](https://pptr.dev/) (Geração automatizada de capturas em PDF).
* **Ícones:** [unplugin-icons](https://github.com/antfu/unplugin-icons) (Material Design Icons).
* **Linguagens:** TypeScript e Astro Core.

## 📂 Estrutura do Projeto

```text
/
├── preview/                 # PDFs de auditoria visual e capturas (Puppeteer)
├── public/                  # Ativos estáticos públicos
│   ├── services/            # Assets organizados por serviço
│   │   ├── driveways/       # Imagens dedicadas
│   │   ├── lawn/            # Imagens dedicadas
│   │   ├── others/          # Imagens complementares
│   │   ├── patios/          # Imagens dedicadas
│   │   ├── pergolas/        # Imagens dedicadas
│   │   └── pools/           # Imagens dedicadas
│   └── uploads/             # Uploads dinâmicos via painel
│       └── testimonials/    # Fotos (before.jpg / after.jpg)
├── src/                     # Código-fonte compilado
│   ├── components/          # UI components reutilizáveis
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ZoomModal.astro  # Componente centralizado de visualização
│   │   └── ...              # Outros componentes (Gallery, etc)
│   ├── content/             # Coleções Markdown (depoimentos)
│   ├── data/                # Configuração estrutural (services.json, company.json)
│   ├── layouts/             # Estruturas base de renderização
│   │   └── Layout.astro     # Layout principal que injeta ZoomModal
│   ├── lib/                 # Utilitários back-end (Auth, JWT, fs)
│   ├── pages/               # Sistema de roteamento
│   │   ├── admin/           # Painel administrativo
│   │   └── services/        # Rotas públicas de serviços
│   │       └── [id].astro   # Página individual dinâmica
│   ├── scripts/             # Scripts globais de front-end
│   │   └── zoom.js          # Lógica centralizada de zoom (opcional)
│   ├── styles/              # Integrações Tailwind e CSS global
│   └── types/               # Definições de tipagem TS
├── gerar-pdf.js             # Script do Puppeteer
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
| `node gerar-pdf.js` | Executa a varredura do Puppeteer e gera os relatórios em `/preview` |

⚠️ **Nota para a Auditoria:** Antes de rodar node gerar-pdf.js, certifique-se de que o servidor local do Astro está de fato rodando em background através do comando `npm run dev`.

## 🚀 Como acessar o painel

1. O painel encontra-se acessível de forma padrão na rota `/admin`.
2. A validação de identidade e controle de privilégios é realizada via rotas HTTP Server-Side e cookies criptografados gerenciados em `src/lib/admin.ts`.
3. Certifique-se de configurar as credenciais administrativas e o nome do token (`SESSION_COOKIE_NAME`) antes do deploy definitivo de produção.

## 👀 Mais informações

Caso precise de assistência técnica ou documentação sobre os componentes, consulte a [documentação oficial do Astro](https://docs.astro.build).

---

*Desenvolvido para A-Plus Pavers & Grass LLC. - Orlando, FL.*