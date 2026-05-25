# ⚡ SETUP RÁPIDO - Projeto Beck

## 🎯 4 PASSOS RÁPIDOS

### **Passo 1️⃣: Usar SQLite local**

O backend já está preparado para SQLite. O arquivo `backend/database.sqlite` será criado automaticamente na primeira execução.

Não é mais necessário configurar MySQL, XAMPP ou MariaDB.

✅ **Usuário de teste:** `admin@example.com` / `123456`

---

### **Passo 2️⃣: Configurar Backend**

```bash
cd backend

# Copiar template de ambiente
cp .env.example .env

# Instalar dependências
npm install
```

Edite `.env` apenas se quiser customizar o caminho do arquivo SQLite:
```env
DB_STORAGE=./database.sqlite
JWT_SECRET=qualquer_chave_secreta
CLIENT_URL=http://localhost:5173
```

---

### **Passo 3️⃣: Configurar Frontend**

```bash
cd frontend

# Instalar dependências
npm install
```

---

### **Passo 4️⃣: Rodar Aplicação**

Abra **2 terminais**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Deve aparecer:
```
✅ Banco de dados sincronizado com sucesso!
✅ Servidor rodando na porta 3001
📝 Acesse: http://localhost:3001/api/
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Deve aparecer:
```
➜  Local:   http://localhost:5173/
```

---

## 🌐 Acessar Aplicação

Abra navegador: **http://localhost:5173**

---

## ✅ Melhorias Implementadas

| Item | Status |
|------|--------|
| 🎨 CSS moderno com gradientes | ✅ |
| 🗄️ Banco de dados automático | ✅ |
| 🔐 Autenticação JWT | ✅ |
| 👤 3 usuários de teste | ✅ |
| 📱 Design responsivo | ✅ |
| ⚡ Validação de input | ✅ |
| 🚀 Sincronização Sequelize | ✅ |

---

## 🧪 Usuários de Teste

```
Email: admin@example.com
Senha: 123456
Papel: admin
```

```
Email: vendedor@example.com
Senha: 123456
Papel: vendedor
```

```
Email: usuario@example.com
Senha: 123456
Papel: user
```

---

## 📁 Arquivos Criados/Modificados

### Novo banco de dados
- `backend/database.sqlite` - Banco SQLite local gerado automaticamente
- `backend/src/config/initDB.js` - Inicialização automática

### CSS Melhorado
- `frontend/src/styles/global.css` - CSS principal
- `frontend/src/styles/components.css` - Componentes reutilizáveis

### Frontend Atualizado
- `frontend/src/pages/Auth/LoginPage.jsx` - Login com design melhorado
- `frontend/src/pages/Auth/RegisterPage.jsx` - Registro com design melhorado
- `frontend/src/main.jsx` - Importa novo CSS

### Backend Atualizado
- `backend/src/server.js` - Sincroniza BD automaticamente
- `backend/.gitignore` - Completo

### Documentação
- `README.md` - Guia completo
- `.env.example` - Template de ambiente

---

## 🐛 Se der erro:

1. **"Cannot find module"** → Execute `npm install`
2. **"Connection refused"** → Backend não está rodando
3. **Banco não sincroniza** → Remova `backend/database.sqlite` e reinicie o backend para regenerar o banco

---

## 📚 Próximos Passos (Opcional)

- Adicionar mais tabelas (Produtos, Pedidos, etc)
- Criar página de perfil de usuário
- Implementar edição de perfil
- Adicionar filtros na listagem de usuários
- Deploy na nuvem (Vercel, Heroku, AWS)

---

**Pronto para começar? 🚀**
