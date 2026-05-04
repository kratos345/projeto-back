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

## 🎯 Funcionalidades Implementadas

### ✅ **Sistema de Níveis de Acesso**
- **👤 Comprador**: Busca imóveis, visualiza anúncios, cria leads de interesse
- **🏠 Vendedor**: Cria/edita imóveis, gerencia leads, acessa área de vendas
- **⚙️ Administrador**: Gerencia usuários, aprova imóveis, visualiza relatórios

### ✅ **Dashboard Personalizado por Perfil**
- **Compradores**: Página de busca de imóveis com filtros avançados
- **Vendedores**: Dashboard com métricas de vendas, imóveis e leads
- **Administradores**: Painel completo com estatísticas do sistema

### ✅ **Área de Vendas Completa**
- 📊 **Visão Geral**: Métricas de performance, imóveis ativos, leads
- 🏠 **Gerenciar Imóveis**: CRUD completo de propriedades
- 💬 **Gerenciar Leads**: Controle de status e acompanhamento
- 📈 **Análises**: Imóveis mais visualizados, conversões

### ✅ **Sistema de Busca Avançada**
- 🔍 Filtros por cidade, tipo, preço, quartos
- 📱 Interface responsiva
- 🏡 Cards de imóveis com todas as informações
- 💖 Sistema de favoritos (em desenvolvimento)

### ✅ **Controle de Acesso Baseado em Roles**
- Rotas protegidas por nível de acesso
- Navegação automática baseada no perfil
- Segurança aprimorada

---

## 🧪 Testar Diferentes Perfis

### **1. Criar Conta de Administrador**
```bash
# No frontend, criar conta com role "admin"
Nome: Admin Teste
Email: admin@teste.com
Senha: 123456
Tipo: ⚙️ Administrador - Gerenciar sistema
```

### **2. Criar Conta de Vendedor**
```bash
Nome: Vendedor Teste
Email: vendedor@teste.com
Senha: 123456
Tipo: 🏠 Vendedor - Anunciar imóveis
```

### **3. Criar Conta de Comprador**
```bash
Nome: Comprador Teste
Email: comprador@teste.com
Senha: 123456
Tipo: 👤 Comprador - Buscar imóveis
```

### **4. Testar Funcionalidades**

#### **Para Administradores:**
- ✅ Dashboard com métricas completas
- ✅ Gerenciamento de usuários
- ✅ Aprovação de imóveis
- ✅ Relatórios do sistema

#### **Para Vendedores:**
- ✅ Área de vendas completa
- ✅ CRUD de imóveis
- ✅ Gerenciamento de leads
- ✅ Métricas de performance

#### **Para Compradores:**
- ✅ Busca avançada de imóveis
- ✅ Filtros por diversos critérios
- ✅ Visualização de detalhes
- ✅ Sistema de interesse (leads)

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
