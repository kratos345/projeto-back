# ⚡ SETUP RÁPIDO - Projeto Beck

## 🎯 4 PASSOS RÁPIDOS

### **Passo 1️⃣: Criar Banco de Dados**

Abra MySQL e execute este comando (ou copie o arquivo `backend/database.sql`):

```sql
CREATE DATABASE IF NOT EXISTS meu_projeto_db;
USE meu_projeto_db;
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'vendedor', 'user') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO Users (name, email, password, role) VALUES 
('Admin', 'admin@example.com', '$2a$10$YIjlrKxI2/p0/dD.q1J2l.0LPXjvwcpAr7e.6Ufkz0aEJZ2S8L8d2', 'admin');
```

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

Edite `.env` com suas credenciais do MySQL:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=meu_projeto_db
JWT_SECRET=qualquer_chave_secreta
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
- `backend/database.sql` - Script SQL
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

1. **"Access Denied"** → Verifique usuário/senha MySQL
2. **"Cannot find module"** → Execute `npm install`
3. **"Connection refused"** → Backend não está rodando
4. **Banco não sincroniza** → Confira credenciais `.env`

---

## 📚 Próximos Passos (Opcional)

- Adicionar mais tabelas (Produtos, Pedidos, etc)
- Criar página de perfil de usuário
- Implementar edição de perfil
- Adicionar filtros na listagem de usuários
- Deploy na nuvem (Vercel, Heroku, AWS)

---

**Pronto para começar? 🚀**
