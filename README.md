Prime Venda
===========

Prime Venda é uma plataforma de vendas de imóveis com backend em Node.js + Express + SQLite e frontend em React + Vite.

Sumário
-------
- [Visão geral](#visão-geral)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Execução](#execução)
- [Admin padrão](#admin-padrão)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Banco de dados](#banco-de-dados)
- [Observações](#observações)

Visão geral
-----------
Este repositório contém duas partes principais:

- `backend/`: API e lógica do servidor.
- `frontend/`: interface do usuário em React.

Requisitos
----------
- Node.js 18+ instalado
- npm

Instalação
----------

### 1) Backend

Abra um terminal na pasta `backend` e instale as dependências:

```bash
cd backend
npm install
```

Crie o arquivo `.env` a partir de `.env.example` ou use estes valores mínimos:

```env
PORT=3001
DB_STORAGE=./database.sqlite
JWT_SECRET=insira_um_valor_forte_aqui
JWT_EXPIRES=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=leonardoferreiratomas234@gmail.com
ADMIN_PASSWORD=321654
ADMIN_NAME=Administrador
```

### 2) Frontend

Abra outro terminal na pasta `frontend` e instale as dependências:

```bash
cd frontend
npm install
```

Execução
--------

Inicie o backend:

```bash
cd backend
npm run dev
```

Inicie o frontend:

```bash
cd frontend
npm run dev
```

Depois disso, abra o navegador em `http://localhost:5173`.

O frontend está configurado para enviar chamadas de API para o backend via proxy `/api` para `http://localhost:3001`.

Admin padrão
------------

O backend cria um usuário administrador automaticamente na primeira execução, usando as credenciais abaixo:

- Email: `leonardoferreiratomas234@gmail.com`
- Senha: `321654`

A senha é armazenada com hash usando `bcrypt` em `backend/src/config/seedDB.js`.

Estrutura do projeto
--------------------

Raiz do repositório:

- `backend/`
  - `src/`
    - `app.js` — configuração do Express
    - `server.js` — inicializa o servidor e chama `initDB`
    - `config/`
      - `database.js` — configuração do Sequelize e SQLite
      - `initDB.js` — associações e inicialização do DB
      - `seedDB.js` — cria o admin padrão e dados iniciais
    - `controllers/` — lógica de rotas
    - `models/` — modelos Sequelize (`User`, `Property`, etc.)
    - `routes/` — rotas da API
    - `middlewares/` — autenticação, validação e tratamento de erros
  - `database.sqlite` — arquivo de banco de dados SQLite

- `frontend/`
  - `src/`
    - `main.jsx` — boot do React
    - `api/` — chamadas ao backend via Axios
    - `pages/` — telas do app (Auth, Dashboard, Properties, etc.)
    - `components/` — componentes compartilhados
    - `styles/` — estilos do app
  - `index.html`

Banco de dados
--------------

- O banco de dados é armazenado em `backend/database.sqlite`.
- Não apague esse arquivo se quiser preservar dados e usuários.
- O backend executa `sequelize.sync({ alter: true })` no startup.
- Se ocorrer erro de sincronização, há um fallback para `sync({ force: true })`, que recria o banco.

Observações
-----------

- Defina `JWT_SECRET` para um valor forte em produção.
- Não comite `.env` com dados reais.
- Mantenha `package-lock.json` para consistência das dependências.
- Para backup, copie o arquivo `backend/database.sqlite`.

Comandos rápidos
---------------

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Pronto
-----

Este `README.md` é a referência principal do projeto. Se quiser, posso também gerar o arquivo `backend/.env` com o admin padrão e os valores necessários para iniciar o projeto imediatamente.

Diga qual opção prefere e eu aplico.
