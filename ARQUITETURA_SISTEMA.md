# 🏗️ ARQUITETURA DO SISTEMA IMOBILIÁRIO

## 📐 Estrutura Geral

```
SISTEMA IMOBILIÁRIO
│
├── 👥 FRONTEND (React)
│   ├── Pages
│   │   ├── Auth (LoginPage, RegisterPage)
│   │   ├── Dashboard (DashboardPage → AdminDashboard ou SellerDashboard)
│   │   ├── Properties (Criar, Editar, Listar)
│   │   ├── Leads (Gerenciar leads)
│   │   └── Users (Listagem)
│   ├── API Clients (axios)
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── leads.js
│   │   ├── favorites.js
│   │   ├── visits.js
│   │   └── dashboard.js
│   └── Context (AuthContext)
│
├── 🔗 API REST (Express.js)
│   ├── Routes
│   │   ├── /auth (register, login)
│   │   ├── /properties (CRUD, approve, reject)
│   │   ├── /leads (create, update status)
│   │   ├── /favorites (add, remove)
│   │   ├── /visits (schedule, update)
│   │   ├── /users (list, delete)
│   │   └── /dashboard (metrics)
│   ├── Controllers
│   │   ├── auth.controller.js
│   │   ├── property.controller.js
│   │   ├── lead.controller.js
│   │   ├── favorite.controller.js
│   │   ├── visit.controller.js
│   │   ├── user.controller.js
│   │   └── dashboard.controller.js
│   ├── Middlewares
│   │   ├── authMiddleware (JWT)
│   │   ├── roleMiddleware (admin, vendedor, user)
│   │   ├── validators (express-validator)
│   │   └── errorHandler
│   └── Models (Sequelize)
│       ├── User
│       ├── Property
│       ├── Lead
│       ├── Favorite
│       ├── Visit
│       └── Message
│
└── 🗄️ BANCO DE DADOS (MySQL)
    ├── Users
    ├── Properties
    ├── Leads
    ├── Favorites
    ├── Visits
    └── Messages
```

---

## 🔄 Fluxo de Autenticação

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ├─ REGISTER ───┐
       │              ├──→ Controllers/auth.controller.js
       └─ LOGIN ──────┤    ├─ Validar dados
                      │    ├─ Hash senha (bcrypt)
                      │    ├─ Criar/Validar usuário
                      │    └─ Gerar JWT token
                      │
                      └──→ localStorage (token + user)
                           │
                      ┌────┴────────────────┐
                      │                     │
                  ✅ LOGIN OK          ❌ ERRO
                      │                     │
                  Redirect "/"         Alert erro
```

---

## 🏠 Fluxo de Criação de Imóvel

```
┌──────────────┐
│  Vendedor    │
└──────┬───────┘
       │
       ├─ Preenche formulário
       │
       ├─ POST /properties ────────┐
       │                          │
       │                    Middleware:
       │                    ├─ authMiddleware
       │                    └─ roleMiddleware
       │
       │                    ✅ Property criado
       │                    Status: "pendente"
       │                    │
       ├──────────────────────┤
       │                      │
    Vendedor     Admin        │
    vê em        aprova       │
    "Pendentes"  /properties  │
                 /:id/approve │
                      │       │
                      └──────┤
                            │
                        Status: "ativo"
                        │
                    Visível para
                    compradores na busca
```

---

## 💬 Fluxo de Lead

```
┌──────────────┐
│   Comprador  │
└──────┬───────┘
       │
       ├─ Vê imóvel
       │
       ├─ POST /leads ────────────────┐
       │  {property_id, name, email}  │
       │                              │
       │                    CREATE Lead
       │                    Status: "novo"
       │
       └─────────────────────────────┘
                    │
                    │
           ┌────────┴────────┐
           │                 │
        VENDEDOR          ADMIN
        recebe            vê em
        notification      dashboard
           │                 │
        PUT /leads/:id/status
        {status: "contato_feito"}
           │
           ├─ "contato_feito"
           ├─ "visita_marcada"
           ├─ "proposta"
           └─ "fechado"
```

---

## 📊 Modelo de Dados

### Users
```
id (PK)
name
email (UNIQUE)
password (hashed)
role (admin | vendedor | user)
createdAt
updatedAt
```

### Properties
```
id (PK)
title
description
type (casa | apartamento | terreno | comercial)
price
bedrooms
bathrooms
area
address
city
state
zipCode
seller_id (FK → Users)
status (ativo | vendido | pendente)
featured_image
views
createdAt
updatedAt
```

### Leads
```
id (PK)
property_id (FK → Properties)
buyer_id (FK → Users, nullable)
name
email
phone
status (novo | contato_feito | visita_marcada | proposta | fechado)
notes
createdAt
updatedAt
```

### Favorites
```
id (PK)
user_id (FK → Users)
property_id (FK → Properties)
createdAt
UNIQUE (user_id, property_id)
```

### Visits
```
id (PK)
property_id (FK → Properties)
lead_id (FK → Leads, nullable)
scheduled_date
status (agendada | realizada | cancelada)
notes
createdAt
updatedAt
```

### Messages
```
id (PK)
sender_id (FK → Users)
receiver_id (FK → Users)
property_id (FK → Properties, nullable)
message
is_read
createdAt
```

---

## 🔐 Segurança & Permissões

### Public Routes
- `GET /properties` - Listar imóveis
- `GET /properties/:id` - Ver detalhes
- `POST /leads` - Criar lead
- `POST /auth/register` - Registrar
- `POST /auth/login` - Login

### Admin Only
- `POST /properties/:id/approve` - Aprovar imóvel
- `POST /properties/:id/reject` - Rejeitar imóvel
- `GET /dashboard/admin/metrics` - Dashboard admin
- `DELETE /users/:id` - Deletar usuário

### Vendedor Only
- `POST /properties` - Criar imóvel
- `GET /properties/vendedor/minhas` - Meus imóveis
- `PUT /properties/:id` - Atualizar (próprio)
- `GET /leads/vendedor/meus` - Meus leads
- `GET /dashboard/seller/metrics` - Dashboard

### Usuário (Comprador)
- `POST /favorites` - Adicionar favorito
- `GET /favorites` - Ver favoritos
- `GET /visits/lead/:id` - Ver visitas

---

## 🔗 Endpoints Por Categoria

### Auth
```
POST   /auth/register
POST   /auth/login
```

### Properties
```
GET    /properties
GET    /properties/:id
POST   /properties
GET    /properties/vendedor/minhas
PUT    /properties/:id
DELETE /properties/:id
POST   /properties/:id/approve
POST   /properties/:id/reject
```

### Leads
```
POST   /leads
GET    /leads/vendedor/meus
GET    /leads/vendedor/metrics
GET    /leads/property/:id
PUT    /leads/:id/status
```

### Favorites
```
POST   /favorites
DELETE /favorites/:property_id
GET    /favorites
```

### Visits
```
POST   /visits
GET    /visits/lead/:id
PUT    /visits/:id/status
```

### Dashboard
```
GET    /dashboard/admin/metrics
GET    /dashboard/seller/metrics
```

### Users
```
GET    /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
```

---

## 🚀 Stack Tecnológico

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL + Sequelize ORM
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator
- **HTTP**: CORS, Morgan (logging)

### Frontend
- **Framework**: React 18
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: Context API
- **CSS**: Vanilla CSS (modular)

### DevTools
- **Backend**: Nodemon
- **Frontend**: Vite
- **Database**: MySQL WorkBench

---

## 📈 Escalabilidade

### Otimizações Implementadas
- ✅ Índices no banco (email, seller_id, city, status)
- ✅ Connection pool (Sequelize)
- ✅ Paginação (preparado para implementar)
- ✅ Middleware de cache (preparado)

### Próximos Passos
- [ ] Implementar paginação
- [ ] Cache Redis para dashboards
- [ ] CDN para imagens
- [ ] Webhooks para notificações
- [ ] Queue para email/SMS
- [ ] Logging centralizado (ELK)

---

## 🎯 Fluxo do Usuário

### Admin
```
Login → Dashboard Admin → Ver métricas → Aprovar imóveis → Gerenciar vendedores
```

### Vendedor
```
Login → Dashboard Vendedor → Criar imóvel → Ver leads → Agendar visitas
```

### Comprador
```
Login → Buscar imóveis → Favoritar → Criar lead → Agendar visita
```

