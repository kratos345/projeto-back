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

- `api/`: API e lógica do servidor (Node.js + Express + SQLite)
- `web/`: interface do usuário em React + Vite

Requisitos
----------
- Node.js 18+ instalado
- npm

Instalação
----------

Na **raiz do projeto**, execute uma única vez:

```bash
npm run install:all
```

Isso instalará as dependências de:
- Raiz do projeto
- API (`api/`)
- Web (`web/`)

### Configuração do .env

Crie o arquivo `.env` na pasta `api/` a partir de `.env.example` ou use estes valores mínimos:

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

Execução
--------

### ⚡ Forma Recomendada (Uma Janela)

Na **raiz do projeto**, execute:

```bash
npm run dev
```

Isso inicia **simultaneamente**:
- ✅ **API** na porta `3001` (backend)
- ✅ **Web** na porta `5173` (frontend)

Depois abra o navegador em: **http://localhost:5173**

### 🖱️ Forma Alternativa (Com Clique)

Execute o arquivo `INICIAR.bat` (Windows):

```bash
.\INICIAR.bat
```

### 🌐 Acessar

Após iniciar, abra no seu navegador:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api/

O frontend está configurado para enviar chamadas de API para o backend via proxy `/api` para `http://localhost:3001`.

Admin padrão
------------

O backend cria um usuário administrador automaticamente na primeira execução, usando as credenciais abaixo:

- Email: `leonardoferreiratomas234@gmail.com`
- Senha: `321654`

A senha é armazenada com hash usando `bcrypt` em `api/src/config/seedDB.js`.

Estrutura do projeto
--------------------

Raiz do repositório:

```
meu-projeto/
├── api/                      ← Backend (Node.js + Express + SQLite)
│   ├── src/
│   │   ├── app.js            — configuração do Express
│   │   ├── server.js         — inicializa o servidor e chama `initDB`
│   │   ├── config/
│   │   │   ├── database.js   — configuração do Sequelize e SQLite
│   │   │   ├── initDB.js     — associações e inicialização do DB
│   │   │   └── seedDB.js     — cria o admin padrão e dados iniciais
│   │   ├── controllers/      — lógica de rotas
│   │   ├── models/           — modelos Sequelize (User, Property, etc.)
│   │   ├── routes/           — rotas da API
│   │   └── middlewares/      — autenticação, validação e tratamento de erros
│   └── database.sqlite       — arquivo de banco de dados SQLite
│
├── web/                      ← Frontend (React + Vite)
│   ├── src/
│   │   ├── main.jsx          — boot do React
│   │   ├── api/              — chamadas ao backend via Axios
│   │   ├── pages/            — telas do app (Auth, Dashboard, Properties, etc.)
│   │   ├── components/       — componentes compartilhados
│   │   ├── styles/           — estilos do app
│   │   └── contexts/         — contextos do React
│   ├── index.html
│   └── vite.config.js
│
├── package.json              ← Maestro (controla api/ e web/)
├── INICIAR.bat              ← Script para iniciar tudo (Windows)
├── COMECE-AQUI.md           ← Guia rápido
└── .git/
```

Banco de dados
--------------

- O banco de dados é armazenado em `api/database.sqlite`.
- Não apague esse arquivo se quiser preservar dados e usuários.
- O backend executa `sequelize.sync({ alter: true })` no startup.
- Se ocorrer erro de sincronização, há um fallback para `sync({ force: true })`, que recria o banco.

Observações
-----------

- Defina `JWT_SECRET` para um valor forte em produção.
- Não comite `.env` com dados reais.
- Mantenha `package-lock.json` para consistência das dependências.
- Para backup, copie o arquivo `api/database.sqlite`.

Comandos rápidos
---------------

**Primeira vez (setup completo):**

```bash
npm run install:all
npm run dev
```

**Próximas vezes:**

```bash
npm run dev
```

Ou clique em `INICIAR.bat` (Windows)

🚀 Para Outro Computador
------------------------

1. Copie a pasta inteira `meu-projeto/`
2. Abra terminal na raiz
3. Execute:
   ```bash
   npm run install:all
   npm run dev
   ```

**Pronto!** Sem erros de conexão ou configuração! ✨
