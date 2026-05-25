# 🚀 Guia de Setup - Projeto Beck

## 📋 Pré-requisitos

- Node.js v16+
- npm
- Visual Studio Code (opcional)

> ✅ O projeto agora usa SQLite local e não depende de XAMPP ou MySQL externo.

---

## 📂 Estrutura do Projeto

```
meu-projeto/
├── backend/           # API Express + Sequelize
│   ├── src/
│   │   ├── config/    # Configurações (banco, inicialização)
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js  # Entry point
│   ├── database.sqlite   # SQLite local gerado automaticamente
│   └── package.json
│
└── frontend/          # React + Vite
    ├── src/
    │   ├── api/       # Chamadas HTTP
    │   ├── contexts/  # Context API
    │   ├── pages/
    │   ├── components/
    │   ├── hooks/
    │   ├── styles/
    │   └── main.jsx
    └── package.json
```

---

## ⚙️ Passo 1: Banco de Dados SQLite Local

O backend usa SQLite local e cria automaticamente o arquivo `backend/database.sqlite` na primeira execução.

### O que você precisa fazer

- Não é necessário instalar ou configurar MySQL/XAMPP.
- O arquivo de banco de dados é gerado automaticamente pelo backend.

### Se quiser limpar o banco e começar do zero

- Apague o arquivo `backend/database.sqlite`
- Reinicie o backend com `npm run dev`

---

## 🔐 Usuários Padrão de Teste

| Email | Senha | Papel |
|-------|-------|-------|
| admin@example.com | 123456 | admin |
| vendedor@example.com | 123456 | vendedor |
| usuario@example.com | 123456 | user |

---

## 📝 Passo 2: Configurar Backend

### 2.1 Criar arquivo `.env`

```bash
cd backend
cp .env.example .env
```

### 2.2 Editar `.env` para rodar com SQLite local

```bash
# Database
DB_STORAGE=./database.sqlite

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_123
JWT_EXPIRES=7d

# Server
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 2.3 Instalar dependências

```bash
npm install
```

---

## 🎨 Passo 3: Configurar Frontend

### 3.1 Instalar dependências

```bash
cd frontend
npm install
```

---

## ▶️ Passo 4: Executar Aplicação

Abra **2 terminais** diferentes:

### Terminal 1 - Backend (API)

```bash
cd backend
npm run dev
```

**Saída esperada:**
```
✅ Banco de dados sincronizado com sucesso!
✅ Servidor rodando na porta 3001
📝 Acesse: http://localhost:3001/api/
```

### Terminal 2 - Frontend (React)

```bash
cd frontend
npm run dev
```

**Saída esperada:**
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## 🌐 Acessar Aplicação

Abra seu navegador e acesse:

```
http://localhost:5173
```

---

## 📡 Testar Endpoints da API

### 1️⃣ Fazer Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

### 2️⃣ Ver Saúde da API

```bash
curl http://localhost:3001/api/health
```

---

## ✨ Melhorias Implementadas

### Backend ✅
- ✅ Sincronização automática de banco de dados
- ✅ Validação de entrada (express-validator)
- ✅ Tratamento de erros centralizado
- ✅ Middleware de autenticação JWT
- ✅ Suporte a CORS
- ✅ Logging com Morgan

### Frontend ✅
- ✅ CSS moderna e responsiva
- ✅ Componentes React funcionais
- ✅ Context API para autenticação
- ✅ React Router v6
- ✅ Axios com interceptadores
- ✅ Vite para build rápido

---

## 🐛 Troubleshooting

### Erro: "ER_ACCESS_DENIED_FOR_USER"
- Verifique usuário e senha no `.env`
- Este erro não deve ocorrer em SQLite local, mas confira se não há configuração remanescente de MySQL

### Erro: "ECONNREFUSED"
- Backend não está rodando
- Verifique se está na porta 3001

### Erro: "Module not found"
- Execute `npm install` no diretório correto

### Banco não sincroniza
- Verifique se o MySQL está acessível
- Confira as credenciais do `.env`

---

## 📚 Scripts Disponíveis

### Backend
```bash
npm run dev     # Inicia com nodemon (desenvolvimento)
npm start       # Inicia modo produção
```

### Frontend
```bash
npm run dev     # Inicia dev server
npm run build   # Cria bundle de produção
npm run preview # Visualiza build
```

---

## 🎯 Fluxo da Aplicação

```
1. Usuário acessa http://localhost:5173
2. Sistema verifica autenticação (localStorage)
3. Se não autenticado → Redireciona para /login
4. Após login bem-sucedido:
   - Token salvo em localStorage
   - Usuário salvo em Context API
   - Redirecionado para dashboard
5. Dashboard mostra dados do usuário
6. Botão "Ver usuarios" acessa a lista completa
```

---

## 🔒 Segurança

- ✅ Senhas hash com bcryptjs
- ✅ JWT para autenticação
- ✅ CORS configurado
- ✅ Variáveis sensíveis em `.env`
- ✅ Validação de entrada

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no terminal
2. Confirme que o backend está rodando
3. Valide as variáveis no `.env`
4. Limpe cache (Ctrl+Shift+Del no navegador)

---

**Boa sorte! 🚀**
