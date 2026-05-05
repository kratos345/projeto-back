# 📊 Documentação do Banco de Dados - PrimeVenda

## 🏗️ Estrutura Completa

### Tabelas Principais

#### 1. **Users** 👤
Armazena informações de todos os usuários (Admin, Vendedor, Usuário)

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| name | STRING(150) | ✅ | Nome completo |
| email | STRING(150) | ✅ | Unique |
| password | STRING | ✅ | Hash bcrypt |
| phone | STRING(20) | ❌ | Telefone |
| cpfCnpj | STRING(20) | ❌ | Unique |
| role | ENUM | ✅ | admin, vendedor, user |
| company | STRING(200) | ❌ | Nome da empresa/corretor |
| creci | STRING(50) | ❌ | CRECI do vendedor |
| website | STRING(200) | ❌ | Site/redes sociais |
| profileImage | STRING(500) | ❌ | URL da foto |
| status | ENUM | ✅ | ativo, inativo, bloqueado |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** email, cpfCnpj, role

---

#### 2. **Properties** 🏠
Imóveis anunciados no sistema

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| sellerId | INTEGER | ✅ | FK -> Users |
| title | STRING(250) | ✅ | Título do anúncio |
| description | TEXT | ❌ | Descrição completa |
| category | ENUM | ✅ | Casa, Apartamento, Cobertura, Terreno, Comercial, Galpão |
| price | DECIMAL(15,2) | ✅ | Preço |
| beds | INTEGER | ✅ | Quartos (padrão: 0) |
| baths | INTEGER | ✅ | Banheiros (padrão: 0) |
| area | DECIMAL(10,2) | ❌ | m² |
| street | STRING(200) | ✅ | Logradouro |
| number | STRING(20) | ✅ | Número |
| complement | STRING(150) | ❌ | Complemento |
| neighborhood | STRING(100) | ✅ | Bairro |
| city | STRING(100) | ✅ | Cidade |
| state | STRING(2) | ✅ | UF |
| zipCode | STRING(20) | ❌ | CEP |
| latitude | DECIMAL(10,8) | ❌ | Coordenada |
| longitude | DECIMAL(11,8) | ❌ | Coordenada |
| status | ENUM | ✅ | disponivel, negociando, vendido, arquivado |
| featured | BOOLEAN | ✅ | Destaque (padrão: false) |
| views | INTEGER | ✅ | Visualizações (padrão: 0) |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** sellerId, city, status, price, featured

---

#### 3. **Vehicles** 🚗
Veículos anunciados no sistema

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| sellerId | INTEGER | ✅ | FK -> Users |
| title | STRING(250) | ✅ | Título do anúncio |
| description | TEXT | ❌ | Descrição |
| category | ENUM | ✅ | Sedan, SUV, Hatch, Pickup, Esportivo, Moto, etc |
| brand | STRING(100) | ✅ | Marca |
| model | STRING(150) | ✅ | Modelo |
| year | INTEGER | ✅ | Ano |
| price | DECIMAL(15,2) | ✅ | Preço |
| mileage | INTEGER | ✅ | Quilometragem |
| color | STRING(50) | ❌ | Cor |
| transmission | ENUM | ✅ | Manual, Automático, CVT |
| fuel | ENUM | ✅ | Gasolina, Diesel, Flex, Elétrico, Híbrido |
| seats | INTEGER | ✅ | Assentos (padrão: 5) |
| doors | INTEGER | ✅ | Portas (padrão: 4) |
| licensePlate | STRING(20) | ❌ | Placa (Unique) |
| engine | STRING(50) | ❌ | Motor |
| power | INTEGER | ❌ | Potência (cv) |
| city | STRING(100) | ✅ | Cidade |
| state | STRING(2) | ✅ | UF |
| status | ENUM | ✅ | disponivel, negociando, vendido, arquivado |
| featured | BOOLEAN | ✅ | Destaque |
| views | INTEGER | ✅ | Visualizações |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** sellerId, city, status, price, featured, brand, year

---

#### 4. **PropertyImages** & **VehicleImages** 📸
Imagens dos anúncios

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| propertyId/vehicleId | INTEGER | ✅ | FK |
| url | STRING(500) | ✅ | URL da imagem |
| caption | STRING(200) | ❌ | Legenda |
| order | INTEGER | ✅ | Ordem (padrão: 0) |
| isFeatured | BOOLEAN | ✅ | Imagem principal |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** propertyId/vehicleId

---

#### 5. **Favorites** ❤️
Favoritos salvos pelos usuários

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| userId | INTEGER | ✅ | FK -> Users |
| propertyId | INTEGER | ❌ | FK -> Properties |
| vehicleId | INTEGER | ❌ | FK -> Vehicles |
| itemType | ENUM | ✅ | property, vehicle |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** userId, itemType

---

#### 6. **Leads** 📞
Contatos/interesse de compradores

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| propertyId | INTEGER | ❌ | FK -> Properties |
| vehicleId | INTEGER | ❌ | FK -> Vehicles |
| buyerId | INTEGER | ❌ | FK -> Users |
| sellerId | INTEGER | ✅ | FK -> Users |
| name | STRING(150) | ❌ | Nome |
| email | STRING(150) | ❌ | E-mail |
| phone | STRING(20) | ❌ | Telefone |
| status | ENUM | ✅ | novo, contatado, visita_agendada, proposta_enviada, negociando, fechado, perdido |
| notes | TEXT | ❌ | Notas |
| source | ENUM | ✅ | website, app, phone, whatsapp, email |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** sellerId, buyerId, status, propertyId, vehicleId

---

#### 7. **Visits** 📅
Agendamentos de visita

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| propertyId | INTEGER | ❌ | FK -> Properties |
| vehicleId | INTEGER | ❌ | FK -> Vehicles |
| leadId | INTEGER | ✅ | FK -> Leads |
| buyerId | INTEGER | ✅ | FK -> Users |
| sellerId | INTEGER | ✅ | FK -> Users |
| scheduledDate | DATE | ✅ | Data/hora agendada |
| status | ENUM | ✅ | agendada, realizada, cancelada, nao_compareceu |
| notes | TEXT | ❌ | Notas |
| feedbackScore | INTEGER | ❌ | Avaliação (1-5) |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** leadId, buyerId, sellerId, status, scheduledDate

---

#### 8. **Messages** 💬
Mensagens entre usuários

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| senderId | INTEGER | ✅ | FK -> Users |
| receiverId | INTEGER | ✅ | FK -> Users |
| propertyId | INTEGER | ❌ | FK -> Properties (contexto) |
| vehicleId | INTEGER | ❌ | FK -> Vehicles (contexto) |
| message | TEXT | ✅ | Conteúdo |
| isRead | BOOLEAN | ✅ | Lido (padrão: false) |
| readAt | DATE | ❌ | Data de leitura |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** senderId, receiverId, isRead, createdAt

---

#### 9. **Reviews** ⭐
Avaliações dos vendedores

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| reviewerId | INTEGER | ✅ | FK -> Users |
| sellerId | INTEGER | ✅ | FK -> Users |
| propertyId | INTEGER | ❌ | FK -> Properties |
| vehicleId | INTEGER | ❌ | FK -> Vehicles |
| rating | INTEGER | ✅ | Nota (1-5) |
| title | STRING(200) | ❌ | Título |
| comment | TEXT | ❌ | Comentário |
| isVerified | BOOLEAN | ✅ | Compra verificada |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** sellerId, reviewerId, rating

---

#### 10. **Notifications** 🔔
Notificações do sistema

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| userId | INTEGER | ✅ | FK -> Users |
| type | ENUM | ✅ | novo_lead, lead_atualizado, visita_agendada, mensagem_nova, etc |
| title | STRING(200) | ✅ | Título |
| message | TEXT | ✅ | Mensagem |
| relatedEntityId | INTEGER | ❌ | ID da entidade relacionada |
| relatedEntityType | ENUM | ❌ | property, vehicle, lead, visit, message |
| isRead | BOOLEAN | ✅ | Lida (padrão: false) |
| readAt | DATE | ❌ | Data de leitura |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** userId, isRead, createdAt

---

#### 11. **Transactions** 💰
Histórico de vendas completas

| Campo | Tipo | Requerido | Observações |
|-------|------|-----------|-------------|
| id | INTEGER | ✅ | Primary Key |
| buyerId | INTEGER | ✅ | FK -> Users |
| sellerId | INTEGER | ✅ | FK -> Users |
| propertyId | INTEGER | ❌ | FK -> Properties |
| vehicleId | INTEGER | ❌ | FK -> Vehicles |
| itemType | ENUM | ✅ | property, vehicle |
| itemTitle | STRING(250) | ✅ | Nome do item |
| finalPrice | DECIMAL(15,2) | ✅ | Preço final |
| originalPrice | DECIMAL(15,2) | ✅ | Preço original |
| discount | DECIMAL(15,2) | ✅ | Desconto (padrão: 0) |
| status | ENUM | ✅ | pendente, confirmada, entregue, cancelada |
| notes | TEXT | ❌ | Notas |
| completedAt | DATE | ❌ | Data de conclusão |
| createdAt | DATE | ✅ | Auto |
| updatedAt | DATE | ✅ | Auto |

**Índices:** buyerId, sellerId, status, completedAt

---

## 🔗 Relacionamentos

```
User (1) ──────→ (N) Property
User (1) ──────→ (N) Vehicle
User (1) ──────→ (N) Lead
User (1) ──────→ (N) Visit
User (1) ──────→ (N) Message
User (1) ──────→ (N) Review
User (1) ──────→ (N) Transaction
User (1) ──────→ (N) Notification

Property (1) ──────→ (N) PropertyImage
Property (1) ──────→ (N) Favorite
Property (1) ──────→ (N) Lead
Property (1) ──────→ (N) Visit
Property (1) ──────→ (N) Message
Property (1) ──────→ (N) Review
Property (1) ──────→ (N) Transaction

Vehicle (1) ──────→ (N) VehicleImage
Vehicle (1) ──────→ (N) Favorite
Vehicle (1) ──────→ (N) Lead
Vehicle (1) ──────→ (N) Visit
Vehicle (1) ──────→ (N) Message
Vehicle (1) ──────→ (N) Review
Vehicle (1) ──────→ (N) Transaction

Lead (1) ──────→ (N) Visit
Lead (1) ──────→ (N) Message
```

---

## 📝 Notas Importantes

- ✅ **Soft Deletes**: Não implementados (delete físico)
- ✅ **Cascata**: deletar usuário deleta seus anúncios, leads, etc
- ✅ **Índices**: Criados em campos de busca frequentes
- ✅ **Timestamps**: Toda tabela tem createdAt/updatedAt
- ✅ **Validações**: SQL + aplicação
- ✅ **Foreignkeys**: Com referências integridade referencial

---

## 🚀 Dados de Teste

Após executar `npm run dev` no backend, o sistema cria automaticamente:

### Usuários:
- **Admin**: admin@primevenda.com / 123456
- **Vendedor 1**: carlos@primevenda.com / 123456
- **Vendedor 2**: ana@primevenda.com / 123456
- **Vendedor 3**: roberto@primevenda.com / 123456
- **Usuário 1**: joao@email.com / 123456
- **Usuário 2**: maria@email.com / 123456

### Dados:
- ✅ 4 Imóveis (1 Casa, 1 Apartamento, 1 Cobertura, 1 Terreno)
- ✅ 3 Veículos (1 SUV, 1 Sedan, 1 Esportivo)
- ✅ 2 Favoritos
- ✅ 2 Leads
- ✅ 1 Review

---

## 📊 Estatísticas

| Recurso | Quantidade |
|---------|-----------|
| Tabelas | 11 |
| Campos | ~150 |
| Relacionamentos | ~30 |
| Índices | ~40 |
| Enum Types | ~20 |

