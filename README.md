A-Plus Pavers & Grass | Institutional Site & Admin Panel

![Astro](https://img.shields.io/badge/Astro-252525?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Este repositório contém a solução digital completa para a A-Plus Pavers & Grass, localizada em Orlando, Flórida. O projeto integra um site institucional de alta performance com foco em conversão e um painel administrativo exclusivo para gestão de conteúdo sem banco de dados.🏗 Visão Geral da SoluçãoO projeto foi desenhado para unir performance extrema no frontend com autonomia operacional para o cliente final:Site Institucional: Apresentação dos serviços (Pavers, Grass, Driveways), galeria de fotos e depoimentos de clientes, otimizado para SEO local em Orlando.Painel Administrativo: Interface segura onde o cliente pode atualizar galerias de fotos e adicionar novos depoimentos (com sistema de upload de fotos "Antes & Depois") sem depender de um banco de dados, utilizando arquivos estáticos e JSON para persistência.🛠 Tecnologias UtilizadasFramework: Astro (Renderização estática e performance).Estilização: Tailwind CSS (Componentização e responsividade).Gestão de Dados: Sistema baseado em File System (Node.js) com Markdown e JSON.Ícones: unplugin-icons (Material Design & Simple Icons).Linguagens: TypeScript e Astro (JSX/TSX).📂 Estrutura do ProjetoPlaintext/
├── public/              # Ativos estáticos e uploads de imagens
├── src/
│   ├── components/      # UI components (TestimonialCard, Gallery, Contact)
│   ├── content/         # Dados de depoimentos (.md)
│   ├── layouts/         # Estrutura base da página
│   ├── lib/             # Lógica de Auth e manipulação de arquivos
│   └── pages/           # Rotas institucionais e endpoints da API Admin
└── package.json
🧞 Comandos de DesenvolvimentoTodos os comandos devem ser executados na raiz do projeto:ComandoAçãonpm installInstala as dependências do projetonpm run devInicia o servidor local (localhost:4321)npm run buildCompila o projeto para produçãonpm run previewTesta a versão de produção localmente🚀 Como acessar o painelO painel administrativo encontra-se na rota /admin.A autenticação é gerenciada internamente via SESSION_COOKIE_NAME configurada no arquivo lib/admin.ts.👀 Mais informaçõesCaso precise de assistência técnica ou documentação sobre os componentes, consulte a documentação oficial do Astro.Desenvolvido para A-Plus Pavers & Grass - Orlando, FL.