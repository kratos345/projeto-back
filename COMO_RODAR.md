# 🚀 Como Rodar o Projeto Corrigido

## 📋 Pré-requisitos

- Node.js 16+
- MySQL 5.7+ (ou MariaDB)
- npm ou yarn

---

## 🛠️ Passo 1: Configurar Banco de Dados

### Windows/Mac/Linux:

1. Abra o MySQL:
```bash
mysql -u root -p
```

2. Crie o banco de dados:
```sql
CREATE DATABASE meu_banco;
```

3. Saia do MySQL:
```sql
EXIT;
```

---

## 📦 Passo 2: Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env (já existe, mas verifique)
# Abra o arquivo .env e configure:
# DB_NAME=meu_banco
# DB_USER=root
# DB_PASSWORD=sua_senha
# JWT_SECRET=sua_chave_secreta_muito_forte
# CLIENT_URL=http://localhost:5173

# Rodar em desenvolvimento
npm run dev
```

**Esperado:**
```
✅ Banco de dados sincronizado com sucesso!
✅ 3 usuários de teste criados com sucesso!
✅ Servidor rodando na porta 3001
```

---

## ⚛️ Passo 3: Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

**Esperado:**
```
VITE v5.0.0 ready in XXX ms

➜ Local: http://localhost:5173/
```

---

## 🧪 Passo 4: Testar o Login

### Opção A: Usar Usuários de Teste

1. Abra http://localhost:5173/login
2. Digite: `admin@example.com` / `123456`
3. Clique em "Entrar"
4. Você deve ser redirecionado para o Dashboard ✅

### Opção B: Criar Nova Conta

1. Clique em "Criar uma aqui" no login
2. Preencha:
   - Nome: Seu nome
   - E-mail: seu@email.com
   - Senha: mínimo 6 caracteres
3. Clique em "Cadastrar"
4. Você será redirecionado para o Dashboard ✅

### Opção C: Testar Persistência

1. Faça login em uma conta
2. Recarregue a página (F5 ou Ctrl+R)
3. Você deve permanecer logado! ✅

---

## ✅ Verificar se Tudo Funciona

### Backend - Teste de Health Check:
```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"OK"}
```

### Backend - Teste de Registro:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@test.com","password":"123456"}'
```

### Backend - Teste de Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
# Deve retornar um token JWT
```

---

## 🐛 Solução de Problemas

### "Erro ao criar a conta"
- ✅ Verifique se o backend está rodando (porta 3001)
- ✅ Verifique se o banco de dados existe
- ✅ Verifique se não há outro usuário com o mesmo email

### "Erro ao tentar fazer login"
- ✅ Verifique se a senha está correta
- ✅ Verifique se o e-mail existe no banco
- ✅ Use um dos e-mails de teste se criado um novo

### "Banco de dados não sincroniza"
- ✅ Verifique se MySQL está rodando
- ✅ Verifique credenciais no .env
- ✅ Delete `.env` e recrie com valores corretos

### "Frontend não conecta ao backend"
- ✅ Backend está rodando em http://localhost:3001 ?
- ✅ CLIENT_URL no backend .env inclui http://localhost:5173 ?
- ✅ Verifique o CORS

---

## 📊 Estrutura de Pastas

```
meu-projeto/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env ⚡ (configure aqui)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── contexts/
    │   ├── pages/
    │   ├── components/
    │   └── routes/
    └── package.json
```

---

## 🎯 Resultado Final

- ✅ Registro funciona e retorna token
- ✅ Login funciona e persiste
- ✅ Recarregar página não desloga
- ✅ Dashboard só acessível logado
- ✅ Código limpo sem duplicatas

**Bom desenvolvimento!** 🚀
