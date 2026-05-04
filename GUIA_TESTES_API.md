# 🧪 GUIA DE TESTES DAS APIs

## 📍 Base URL
```
http://localhost:3001/api
```

---

## 🔐 1. AUTENTICAÇÃO

### Registrar novo usuário
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "message": "Usuário criado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user"
  }
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "123456"
}
```

**Resposta:** Mesmo formato acima

---

## 🏠 2. PROPRIEDADES (Imóveis)

### Listar todas (público - sem auth)
```bash
GET /properties
```

**Com filtros:**
```bash
GET /properties?city=São%20Paulo&type=apartamento&minPrice=400000&maxPrice=500000
```

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Apartamento centro",
    "description": "...",
    "type": "apartamento",
    "price": "450000.00",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": "120.00",
    "address": "Rua X",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "seller_id": 5,
    "status": "ativo",
    "views": 42,
    "createdAt": "2024-05-04T10:00:00.000Z"
  }
]
```

### Ver detalhes de um imóvel (incrementa views)
```bash
GET /properties/1
Authorization: Bearer {token}
```

### Criar novo imóvel (vendedor/admin)
```bash
POST /properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Apartamento 3 quartos",
  "description": "Apartamento espaçoso no centro",
  "type": "apartamento",
  "price": 450000,
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 120,
  "address": "Rua das Flores 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567"
}
```

### Meus imóveis (vendedor)
```bash
GET /properties/vendedor/minhas
Authorization: Bearer {token}
```

### Atualizar imóvel
```bash
PUT /properties/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Apartamento 3 quartos - NOVO PREÇO",
  "price": 420000
}
```

### Deletar imóvel
```bash
DELETE /properties/1
Authorization: Bearer {token}
```

### Aprovar imóvel (admin)
```bash
POST /properties/1/approve
Authorization: Bearer {admin-token}
```

### Rejeitar imóvel (admin)
```bash
POST /properties/1/reject
Authorization: Bearer {admin-token}
```

---

## 💬 3. LEADS

### Criar novo lead
```bash
POST /leads
Content-Type: application/json

{
  "property_id": 1,
  "name": "Maria Silva",
  "email": "maria@email.com",
  "phone": "11988887777"
}
```

### Meus leads (vendedor)
```bash
GET /leads/vendedor/meus
Authorization: Bearer {token}
```

### Métricas de leads (vendedor)
```bash
GET /leads/vendedor/metrics
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  { "status": "novo", "count": 5 },
  { "status": "contato_feito", "count": 3 },
  { "status": "visita_marcada", "count": 2 },
  { "status": "fechado", "count": 1 }
]
```

### Leads de uma propriedade
```bash
GET /leads/property/1
Authorization: Bearer {token}
```

### Atualizar status do lead
```bash
PUT /leads/1/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "visita_marcada",
  "notes": "Cliente confirmou para segunda"
}
```

---

## ❤️ 4. FAVORITOS

### Adicionar aos favoritos
```bash
POST /favorites
Authorization: Bearer {token}
Content-Type: application/json

{
  "property_id": 1
}
```

### Remover dos favoritos
```bash
DELETE /favorites/1
Authorization: Bearer {token}
```

### Meus favoritos
```bash
GET /favorites
Authorization: Bearer {token}
```

---

## 📅 5. VISITAS

### Agendar visita
```bash
POST /visits
Authorization: Bearer {token}
Content-Type: application/json

{
  "property_id": 1,
  "lead_id": 5,
  "scheduled_date": "2024-05-15T14:00:00",
  "notes": "Cliente prefere à tarde"
}
```

### Visitas de um lead
```bash
GET /visits/lead/5
Authorization: Bearer {token}
```

### Atualizar status da visita
```bash
PUT /visits/1/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "realizada"
}
```

---

## 📊 6. DASHBOARDS

### Dashboard Admin
```bash
GET /dashboard/admin/metrics
Authorization: Bearer {admin-token}
```

**Resposta:**
```json
{
  "properties": {
    "total": 15,
    "active": 10,
    "sold": 3,
    "pending": 2
  },
  "users": {
    "sellers": 5,
    "buyers": 100,
    "admins": 1
  },
  "leads": {
    "total": 45,
    "new": 12,
    "closed": 8
  },
  "topProperties": [
    { "id": 1, "title": "Apt Centro", "views": 234, "price": "450000" }
  ],
  "topSellers": [
    { "id": 5, "name": "João", "totalProperties": 5 }
  ]
}
```

### Dashboard Vendedor
```bash
GET /dashboard/seller/metrics
Authorization: Bearer {seller-token}
```

**Resposta:**
```json
{
  "properties": {
    "total": 5,
    "active": 4,
    "sold": 1
  },
  "leads": {
    "total": 15,
    "perStatus": [
      { "status": "novo", "count": 5 },
      { "status": "contato_feito", "count": 3 }
    ]
  },
  "stats": {
    "totalViews": 125
  }
}
```

---

## 🧬 Usando CURL (Terminal)

### Exemplo 1: Registrar e Login
```bash
# Registrar
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "email": "joao@test.com",
    "password": "123456"
  }'

# Login (pega o token)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@test.com",
    "password": "123456"
  }'
```

### Exemplo 2: Criar Imóvel
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token-aqui}" \
  -d '{
    "title": "Apartamento 3 quartos",
    "type": "apartamento",
    "price": 450000,
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 120,
    "address": "Rua X",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  }'
```

### Exemplo 3: Listar Imóveis Filtrados
```bash
curl "http://localhost:3001/api/properties?city=São%20Paulo&type=apartamento&minPrice=400000"
```

---

## 🐛 Código de Erros

| Status | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Created (criado com sucesso) |
| 400 | Bad Request (dados inválidos) |
| 401 | Unauthorized (token inválido/não enviado) |
| 403 | Forbidden (acesso negado por role) |
| 404 | Not Found (recurso não existe) |
| 500 | Internal Server Error |

---

## ✅ Checklist de Teste

- [ ] Criar conta como vendedor
- [ ] Login funciona
- [ ] Criar imóvel
- [ ] Listar imóveis
- [ ] Filtrar imóveis por cidade
- [ ] Ver detalhes de imóvel
- [ ] Criar lead
- [ ] Atualizar status de lead
- [ ] Dashboard Admin carrega
- [ ] Dashboard Vendedor carrega

Bom teste! 🎉
