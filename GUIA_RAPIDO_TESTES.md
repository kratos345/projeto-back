# 🚀 GUIA RÁPIDO - TESTAR DASHBOARDS

## ⚡ Começar em 2 Minutos

### Terminal 1 - Backend (já está rodando)
```bash
✅ Backend em http://localhost:3001
✅ Banco sincronizado
✅ Pronto!
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Acesse: http://localhost:5173

---

## 🧪 Cenários de Teste

### Cenário 1: Testar como VENDEDOR

1. **Registre uma conta vendedor**
   - Clique em "Criar uma aqui"
   - Name: João Vendedor
   - Email: vendedor1@test.com
   - Password: 123456

2. **Você será redirecionado para o Dashboard Vendedor**
   - Veja o Seller Dashboard com:
     - Meus Imóveis (0 no início)
     - Meus Leads (0 no início)
     - Total de Visualizações (0)

3. **Crie um imóvel** (botão ➕ Novo Imóvel)
   - Title: Apartamento no Centro
   - Type: apartamento
   - Price: 450000
   - Bedrooms: 3
   - Bathrooms: 2
   - Area: 120
   - City: São Paulo
   - Clique em "Cadastrar"

4. **Volte para o dashboard**
   - Veja as métricas atualizadas:
     - "Meus Imóveis: 1"
     - Status será "pendente" até admin aprovar

---

### Cenário 2: Testar como ADMIN

1. **Registre uma conta como ADMIN**
   - Use curl para criar admin (vendedor_id = 2 para admin_id = 2):

   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin",
       "email": "admin@test.com",
       "password": "123456"
     }'
   ```

   **NÃO EXISTE ENDPOINT DE MUDAR ROLE VIA UI!**
   
   **Solução temporária:** Faça via SQL:
   ```sql
   UPDATE Users SET role='admin' WHERE email='admin@test.com';
   ```

2. **Faça logout e login como admin**
   - Será redirecionado para Admin Dashboard

3. **Veja as métricas globais**
   - Total de Imóveis
   - Total de Vendedores
   - Total de Leads
   - Top Imóveis mais visualizados
   - Top Vendedores

4. **Aprove o imóvel do vendedor**
   - Via API:
   ```bash
   curl -X POST http://localhost:3001/api/properties/1/approve \
     -H "Authorization: Bearer {admin-token}"
   ```

   Após approvar, o status do imóvel muda de "pendente" para "ativo"

---

### Cenário 3: Testar como COMPRADOR

1. **Registre uma segunda conta como vendedor**
   - Email: vendedor2@test.com
   - Crie um imóvel

2. **Registre uma conta como COMPRADOR**
   - Name: Maria Compradora
   - Email: compradora@test.com
   - Password: 123456
   - Role será "user" (comprador)

3. **Ao fazer login**
   - Verá página inicial simples com:
     - Bem-vindo
     - Botões para Favoritos e Perfil

4. **Crie um lead** (via API por enquanto)
   ```bash
   curl -X POST http://localhost:3001/api/leads \
     -H "Content-Type: application/json" \
     -d '{
       "property_id": 1,
       "name": "Maria",
       "email": "maria@test.com",
       "phone": "11999999999"
     }'
   ```

5. **Vendedor receberá o lead**
   - Em "Meus Leads" aparecerá novo lead
   - Status: "novo"

---

## 🧬 Testes via Terminal (cURL)

### 1. Registrar Vendedor
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Vendedor",
    "email": "joao@test.com",
    "password": "123456"
  }'
```

### 2. Login (pega o token)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@test.com",
    "password": "123456"
  }'
```

Copie o `token` da resposta

### 3. Criar Imóvel (use o token)
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Apartamento 3 quartos",
    "type": "apartamento",
    "price": 450000,
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 120,
    "address": "Rua das Flores",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  }'
```

### 4. Listar Imóveis
```bash
curl http://localhost:3001/api/properties
```

### 5. Dashboard Vendedor
```bash
curl http://localhost:3001/api/dashboard/seller/metrics \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## 📊 O que Esperar em Cada Dashboard

### VENDEDOR Dashboard
```
Você verá:
✅ Total de Imóveis (3, 2 ativos, 1 vendido)
✅ Meus Leads (15 total, 5 novos, 3 contato feito)
✅ Visualizações Totais (256)
✅ 4 botões de ação rápida
```

### ADMIN Dashboard
```
Você verá:
✅ Total de Imóveis (10, 7 ativos, 2 vendidos, 1 pendente)
✅ Usuários (3 vendedores, 100 compradores, 1 admin)
✅ Total de Leads (50, 15 novos, 10 fechados)
✅ Top 5 Imóveis mais visualizados
✅ Top 5 Vendedores
```

### COMPRADOR (User) Dashboard
```
Você verá:
✅ Mensagem de boas-vindas
✅ 2 botões (Favoritos e Perfil)
```

---

## ⚠️ Problemas Comuns

### Problema: "Erro ao carregar métricas"
**Solução**: Certifique-se que fez login e tem um token válido

### Problema: Dashboard branco
**Solução**: Abra o console (F12) e veja os erros

### Problema: "Cannot GET /properties/vendedor/minhas"
**Solução**: Essa rota requer autenticação. Faça login primeiro

### Problema: Não consegue criar imóvel
**Solução**: Verifique se é VENDEDOR (role: "vendedor") ou ADMIN

---

## 🎯 Checklist Final

- [ ] Backend rodando em http://localhost:3001 ✅
- [ ] Frontend rodando em http://localhost:5173 ✅
- [ ] Registrar como vendedor ✅
- [ ] Ver Seller Dashboard com métricas ✅
- [ ] Criar um imóvel ✅
- [ ] Ver métricas atualizar ✅
- [ ] Registrar como admin ✅
- [ ] Ver Admin Dashboard ✅
- [ ] Criar lead via API ✅
- [ ] Ver lead aparecer no Seller Dashboard ✅

---

## 🚀 Próximo Passo

Depois de testar tudo, implementaremos as **PÁGINAS CRUD**:
- PropertiesListPage (listar meus imóveis)
- PropertyFormPage (criar/editar)
- LeadsPage (gerenciar leads)
- Upload de imagens

**Tudo funcionando!** 🎉
