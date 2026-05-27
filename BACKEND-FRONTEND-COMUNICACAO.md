# 🔗 Backend e Frontend Precisam Se Conhecer

## 📌 O Problema

Tanto o **backend** quanto o **frontend** precisam saber onde um está para se comunicarem.

```
┌──────────────┐                    ┌──────────────┐
│   FRONTEND   │                    │   BACKEND    │
│ :5173        │                    │   :3001      │
└──────────────┘                    └──────────────┘
       │                                   │
       └───────────────────────────────────┘
              Precisam se conhecer!
```

---

## 🛠️ Como Funciona

### **Frontend Precisa Saber:**
- Onde o Backend está (IP + Porta)
- Exemplo: `http://localhost:3001`

### **Backend Precisa Saber:**
- Onde o Frontend está (para CORS)
- Exemplo: `http://localhost:5173`

---

## 📋 Configuração Correta (Máquina Local)

### **Backend `.env`**
```env
PORT=3001                          # Porta onde backend roda
HOST=0.0.0.0                       # Aceita conexões de qualquer lugar
CLIENT_URL=http://localhost:5173   # Onde o frontend está (CORS)
```

### **Frontend `.env`**
```env
VITE_API_URL=http://localhost:3001  # Onde o backend está
```

---

## 🌐 Configuração para Múltiplas Máquinas

### Cenário: Backend em PC1, Frontend em PC2

**PC1 (Backend) - IP: 192.168.1.100**

Arquivo: `backend/.env`
```env
PORT=3001
HOST=0.0.0.0
CLIENT_URL=http://192.168.1.101:5173  # ← URL do PC2
```

**PC2 (Frontend) - IP: 192.168.1.101**

Arquivo: `frontend/.env`
```env
VITE_API_URL=http://192.168.1.100:3001  # ← URL do PC1
```

---

## 📱 Configuração para Android/Termux

**PC (Backend) - IP: 192.168.1.100**

Arquivo: `backend/.env`
```env
PORT=3001
HOST=0.0.0.0
CLIENT_URL=http://192.168.1.100:5173   # Frontend local OU
CLIENT_URL=*                             # Ou aceita qualquer origem (dev only)
```

**Frontend (rodando no PC)**

Arquivo: `frontend/.env`
```env
VITE_API_URL=http://192.168.1.100:3001
```

**Navegador do Android**
```
http://192.168.1.100:5173
```

---

## 🔍 Fluxo de Requisição

```
1. Usuário acessa: http://localhost:5173
                           ↓
2. Frontend carrega (página com botões)
                           ↓
3. Usuário clica em "Login"
                           ↓
4. Frontend lê VITE_API_URL do .env: "http://localhost:3001"
                           ↓
5. Frontend envia: POST http://localhost:3001/api/login
                           ↓
6. Backend recebe em porta 3001
                           ↓
7. Backend verifica CORS: A requisição veio de http://localhost:5173?
   ✅ SIM! (está em CLIENT_URL)
                           ↓
8. Backend processa e responde
                           ↓
9. Frontend recebe resposta e mostra resultado
```

---

## ✅ Checklist de Configuração

### Backend
- [ ] `PORT` definido (padrão: 3001)
- [ ] `HOST=0.0.0.0` (para aceitar conexões externas)
- [ ] `CLIENT_URL` apontando para o frontend
- [ ] Backend rodando: `npm run dev`

### Frontend
- [ ] `VITE_API_URL` apontando para o backend
- [ ] Frontend rodando: `npm run dev`
- [ ] Não há `/api` no final de `VITE_API_URL` (a rota já tem)

### Rede/Sistema
- [ ] Backend respondendo: `curl http://localhost:3001/health`
- [ ] Frontend acessível: `http://localhost:5173`
- [ ] Porta 3001 não bloqueada pelo firewall
- [ ] Mesma rede WiFi (se em máquinas diferentes)

---

## 🐛 Troubleshooting

### Erro: "⚠️ Erro de conexão com backend em http://localhost:3001"

**Significa:**
- Frontend não conseguiu conectar no endereço que está em `VITE_API_URL`

**Causas possíveis:**

| Causa | Solução |
|-------|---------|
| Backend não está rodando | `npm run dev` na pasta backend |
| VITE_API_URL errado | Verifique `frontend/.env` - deve bater com `PORT` do backend |
| Porta bloqueada por firewall | Libere porta 3001 no Windows Defender |
| IP diferente | Verifique IPs com `ipconfig` (Windows) |

### Erro: "CORS bloqueou"

**Significa:**
- Backend recebeu requisição de uma origem não autorizada

**Causas possíveis:**

| Causa | Solução |
|-------|---------|
| CLIENT_URL incorreto | Edite `backend/.env` - deve ser a URL do frontend |
| Frontend em IP diferente | Atualize `CLIENT_URL` com o IP correto |

---

## 🚀 Teste Rápido

### 1. Terminal 1 (Backend)
```bash
cd backend
npm run dev
```

Você verá:
```
✅ Servidor rodando na porta 3001
📝 Acesse localmente: http://localhost:3001/api/
```

### 2. Terminal 2 (Frontend)
```bash
cd frontend
npm run dev
```

Você verá:
```
VITE v4.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 3. Verificar conexão
```bash
curl http://localhost:3001/health
# Resposta: {"status":"OK"}
```

### 4. No navegador
Abra: `http://localhost:5173`

Se não der erro, ✅ está funcionando!

---

## 📊 Diagrama Visual (Múltiplas Máquinas)

```
┌─────────────────────────────────────────────────────────┐
│                    REDE LOCAL                            │
│  192.168.1.0/24                                          │
│                                                          │
│  ┌──────────────────────┐    ┌──────────────────────┐   │
│  │   PC1 (Backend)      │    │  PC2 (Frontend)      │   │
│  │   IP: 192.168.1.100  │    │  IP: 192.168.1.101   │   │
│  │                      │    │                      │   │
│  │ .env:                │    │ .env:                │   │
│  │ PORT=3001            │    │ VITE_API_URL=        │   │
│  │ HOST=0.0.0.0         │    │ http://192.168.1.100:│   │
│  │ CLIENT_URL=          │    │ 3001                 │   │
│  │ http://192.168.1.101:│    │                      │   │
│  │ 5173                 │    │                      │   │
│  └──────────────────────┘    └──────────────────────┘   │
│           │                           │                  │
│           └───────────────────────────┘                  │
│           Comunicam via rede local                       │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Dicas de Ouro

✅ **Use `0.0.0.0` no backend** para aceitar de qualquer lugar
✅ **IPs devem bater** - se está em outra máquina, use o IP correto
✅ **Teste com `curl`** para confirmar conexão antes de fazer login
✅ **Logs do navegador** (F12 → Console) mostram qual URL está tentando
✅ **Rodou `npm install` após editar .env?** Às vezes precisa reiniciar

