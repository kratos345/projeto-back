# 🏗️ ROADMAP DO SISTEMA IMOBILIÁRIO

## 📊 Estrutura de Banco de Dados

### Tabelas Principais:

```
1. Users (já existe)
   - id, name, email, password, role (admin/vendedor/user)
   
2. Properties (NOVIDADE) - Imóveis
   - id, title, description, type, price
   - bedrooms, bathrooms, area, address
   - city, state, zipCode
   - seller_id (quem cadastrou)
   - status (ativo, vendido, pendente)
   - featured_image, images (galeria)
   - created_at, updated_at
   
3. Leads (NOVIDADE) - Interessados
   - id, property_id, buyer_id
   - name, email, phone
   - status (novo, contato_feito, visita_marcada, proposta, fechado)
   - notes
   - created_at, updated_at
   
4. Favorites (NOVIDADE) - Imóveis favoritados
   - id, user_id, property_id
   - created_at
   
5. Visits (NOVIDADE) - Visitas agendadas
   - id, property_id, lead_id
   - scheduled_date, status
   - notes
   
6. Messages (NOVIDADE) - Chat
   - id, sender_id, receiver_id, property_id
   - message, read
   - created_at
```

## 🎯 Fases de Implementação

### ✅ FASE 1: Estrutura Base
- [x] Autenticação com 3 roles
- [ ] Banco de dados expandido
- [ ] Modelos Sequelize completos

### 📊 FASE 2: Dashboards
- [ ] Dashboard Admin (métricas, gestão)
- [ ] Dashboard Vendedor (leads, imóveis)
- [ ] Página inicial Usuário (busca)

### 🏠 FASE 3: Gestão de Imóveis
- [ ] CRUD de imóveis (vendedor)
- [ ] Upload de imagens
- [ ] Filtros e busca

### 💬 FASE 4: Leads e CRM
- [ ] Gestão de leads
- [ ] Chat com corretor
- [ ] Funil de vendas

### 🔔 FASE 5: Funcionalidades Extras
- [ ] Notificações
- [ ] Relatórios
- [ ] Integração WhatsApp

## 📋 Próximos Passos:
1. Expandir database.sql com novas tabelas
2. Criar modelos no Sequelize
3. Implementar APIs (controllers + routes)
4. Criar componentes React para cada dashboard
