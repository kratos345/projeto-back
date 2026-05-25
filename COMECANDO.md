# 🚀 Guia de Execução - PrimeVenda

## ⚡ Quick Start

### 1️⃣ Backend (Node.js + SQLite local)

```bash
cd backend
npm install
npm run dev
```

**Resultado esperado:**
```
✅ Banco de dados sincronizado com sucesso!
🌱 Iniciando seed do banco de dados...
✅ Usuários criados com sucesso!
✅ Imóveis criados com sucesso!
✅ Veículos criados com sucesso!
✅ Imagens criadas com sucesso!
✅ Favoritos criados com sucesso!
✅ Leads criados com sucesso!
✅ Reviews criados com sucesso!

🎉 Seed concluído com sucesso!

📋 Usuários de teste:
  Admin: admin@primevenda.com / 123456
  Carlos (Vendedor): carlos@primevenda.com / 123456
  Ana (Vendedor): ana@primevenda.com / 123456
  Roberto (Vendedor): roberto@primevenda.com / 123456
  João (Usuário): joao@email.com / 123456
  Maria (Usuário): maria@email.com / 123456

✅ Servidor rodando na porta 3001
📝 Acesse: http://localhost:3001/api/
```

---

### 2️⃣ Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

**Resultado esperado:**
```
  VITE v5.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

## 🔑 Credenciais de Teste

| Email | Senha | Tipo |
|-------|-------|------|
| admin@primevenda.com | 123456 | Admin |
| carlos@primevenda.com | 123456 | Vendedor |
| ana@primevenda.com | 123456 | Vendedor |
| roberto@primevenda.com | 123456 | Vendedor |
| joao@email.com | 123456 | Usuário |
| maria@email.com | 123456 | Usuário |

---

## 🗂️ Estrutura de Arquivos

```
meu-projeto/
├── backend/
│   ├── src/
│   │   ├── app.js              # Configuração Express
│   │   ├── server.js           # Entrada principal
│   │   ├── config/
│   │   │   ├── database.js     # Config Sequelize
│   │   │   ├── initDB.js       # Sincronização + Associações
│   │   │   └── seedDB.js       # Dados de teste
│   │   ├── models/             # 11 modelos
│   │   ├── controllers/        # Lógica de negócio
│   │   ├── routes/             # Endpoints
│   │   ├── middlewares/        # Autenticação e validações
│   │   └── utils/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx            # Entrada React
│   │   ├── api/                # Clientes HTTP
│   │   ├── components/         # Componentes React
│   │   ├── contexts/           # Context API
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Páginas
│   │   ├── routes/             # React Router
│   │   └── styles/             # CSS
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── docs/
    ├── ESTRUTURA_BANCO_DADOS.md    # Schema completo
    ├── MELHORIAS.md                # Todas as melhorias
    └── (10+ outros documentos)

```

---

## 📊 Banco de Dados

### Tabelas Criadas (11)
1. **Users** - Usuários do sistema
2. **Properties** - Imóveis
3. **Vehicles** - Veículos
4. **PropertyImages** - Imagens de imóveis
5. **VehicleImages** - Imagens de veículos
6. **Favorites** - Favoritos
7. **Leads** - Contatos/interesse
8. **Visits** - Agendamentos
9. **Messages** - Chat entre usuários
10. **Reviews** - Avaliações
11. **Notifications** - Notificações
12. **Transactions** - Histórico de vendas

### Dados de Teste Criados
- ✅ 6 Usuários (1 admin, 3 vendedores, 2 usuários)
- ✅ 4 Imóveis diferentes
- ✅ 3 Veículos
- ✅ 2 Imagens
- ✅ 2 Favoritos
- ✅ 2 Leads
- ✅ 1 Review

---

## 🔄 Fluxo de Login

1. Usuário acessa http://localhost:5173/
2. Entra na tela de login com seletor de role
3. Escolhe: Usuário / Vendedor / Admin
4. Insere email e senha
5. Sistema valida no backend
6. JWT token é salvo
7. Redirecionamento automático para dashboard
8. Dashboard muda conforme role

---

## 📱 Roles e Funcionalidades

### 👤 Usuario (Comprador)
- Explorar imóveis e veículos
- Salvar favoritos
- Ver minhas compras
- Editar perfil

### 🏢 Vendedor
- Painel com estatísticas
- Meus anúncios
- Criar novo anúncio
- Gerenciar leads
- Configurações

### 🔐 Admin
- Dashboard com relatórios
- Gerenciar todos anúncios
- Gerenciar usuários
- Ver relatórios completos
- Configurações sistema

---

## 🛠️ Scripts Disponíveis

### Backend
```bash
npm run dev           # Inicia em desenvolvimento (nodemon)
npm start            # Inicia em produção
npm test             # Roda testes (se configurado)
```

### Frontend
```bash
npm run dev          # Inicia dev server (http://localhost:5173)
npm run build        # Build para produção
npm run preview      # Preview do build
```

---

## 🌐 API Endpoints (Exemplos)

### Auth
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Meu perfil

### Properties
- `GET /api/properties` - Listar imóveis
- `GET /api/properties/:id` - Detalhe
- `POST /api/properties` - Criar (vendedor)
- `PUT /api/properties/:id` - Editar
- `DELETE /api/properties/:id` - Deletar

### Vehicles
- `GET /api/vehicles` - Listar veículos
- `GET /api/vehicles/:id` - Detalhe
- `POST /api/vehicles` - Criar
- `PUT /api/vehicles/:id` - Editar
- `DELETE /api/vehicles/:id` - Deletar

### Leads
- `GET /api/leads` - Meus leads
- `POST /api/leads` - Criar lead
- `PUT /api/leads/:id` - Atualizar status

### Favorites
- `GET /api/favorites` - Meus favoritos
- `POST /api/favorites` - Adicionar
- `DELETE /api/favorites/:id` - Remover

### Messages
- `GET /api/messages/:userId` - Chat
- `POST /api/messages` - Enviar mensagem

### Reviews
- `GET /api/reviews/:sellerId` - Reviews do vendedor
- `POST /api/reviews` - Criar review

---

## 🐛 Troubleshooting

### Backend não conecta ao banco
```
❌ Erro: ER_ACCESS_DENIED_FOR_USER
✅ Solução: Verificar credenciais em backend/src/config/database.js
```

### Port já em uso
```
Backend: Mudar em backend/src/server.js (porta 3001)
Frontend: Muda automaticamente se 5173 está ocupada
```

### Esquecer de instalar dependências
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 📚 Documentação Completa

Veja os arquivos na raiz do projeto:
- `ESTRUTURA_BANCO_DADOS.md` - Schema SQL detalhado
- `MELHORIAS.md` - Todas as mudanças implementadas
- `ROADMAP.md` - Próximos passos
- `README.md` - Documentação geral

---

## ✅ Checklist antes de começar

- [ ] Node.js 14+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Portas 3001 e 5173 disponíveis
- [ ] `backend/database.sqlite` pode ser gerado automaticamente na primeira execução
- [ ] Variáveis de ambiente no `.env` configuradas corretamente

---

## 🎯 Próximas Implementações Sugeridas

1. ✅ Validações avançadas nos controllers
2. ✅ Paginação na API
3. ✅ Upload de imagens para AWS S3
4. ✅ Sistema de pagamento
5. ✅ Notificações em tempo real (Socket.io)
6. ✅ Dashboard com gráficos
7. ✅ Mobile app (React Native)

---

**🎉 Tudo pronto! Execute e aproveite!**

