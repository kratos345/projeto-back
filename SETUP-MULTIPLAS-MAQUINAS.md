# 🚀 Configuração para Múltiplas Máquinas

Este guia explica como configurar a aplicação para funcionar em diferentes máquinas da rede sem erros de IP/conexão.

## ❌ Problema Original

Quando você trocava de máquina, recebia: **"Ocorreu um erro. Tente novamente mais tarde."**

**Causa:** URLs hardcoded com `localhost:3001` não funcionam em outras máquinas.

## ✅ Solução Implementada

Agora a aplicação usa **variáveis de ambiente** para configurar IPs e portas dinamicamente.

---

## 📋 Passo a Passo de Configuração

### 1️⃣ **BACKEND** - Arquivo `.env`

Copie o arquivo `.env.example` para `.env`:

```bash
cd backend
cp .env.example .env
```

Configure o arquivo `.env`:

```env
# Sua máquina local
HOST=0.0.0.0                          # Aceita conexões de qualquer interface
PORT=3001                             # Porta do backend
CLIENT_URL=http://localhost:5173      # URL do frontend

# Se estiver em OUTRA MÁQUINA, substitua localhost pelo IP:
# CLIENT_URL=http://192.168.1.100:5173
```

### 2️⃣ **FRONTEND** - Arquivo `.env`

Copie o arquivo `.env.example` para `.env`:

```bash
cd frontend
cp .env.example .env
```

Configure o arquivo `.env`:

```env
# URL do Backend
VITE_API_URL=http://localhost:3001

# Se o backend está em OUTRA MÁQUINA, use o IP:
# VITE_API_URL=http://192.168.1.100:3001
```

---

## 🌐 Exemplo: Máquinas Diferentes

### Cenário 1: Tudo Local (Uma Máquina)

**Backend `.env`:**
```env
HOST=0.0.0.0
PORT=3001
CLIENT_URL=http://localhost:5173
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3001
```

### Cenário 2: Backend em PC1, Frontend em PC2 (Rede Local)

**PC1 (Backend):**

Descubra o IP do PC1:
```powershell
ipconfig
```
Procure por `IPv4 Address:` (exemplo: `192.168.1.100`)

**Backend `.env`:**
```env
HOST=0.0.0.0
PORT=3001
CLIENT_URL=http://192.168.1.101:5173    # IP do PC2
```

**PC2 (Frontend):**

**Frontend `.env`:**
```env
VITE_API_URL=http://192.168.1.100:3001  # IP do PC1
```

---

## 🔍 Descobrir seu IP

### Windows:
```powershell
ipconfig
```
Procure por `IPv4 Address` na seção da rede que você está usando.

### Linux/Mac:
```bash
ifconfig
# ou
ip addr show
```

---

## 🔧 Iniciar a Aplicação

### Backend:
```bash
cd backend
npm install
npm run dev
```

Você verá:
```
✅ Servidor rodando na porta 3001
📝 Acesse localmente: http://localhost:3001/api/
🌐 Para outra máquina na rede, use o IP da máquina: http://[SEU_IP]:3001/api/
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🛡️ Segurança

⚠️ **Aviso:** Nunca deixe `CLIENT_URL=*` ou `HOST=0.0.0.0` em **PRODUÇÃO**!

Para produção, sempre especifique domínios/IPs conhecidos.

---

## ✔️ Verificar Conexão

### Backend está respondendo?

```powershell
curl http://localhost:3001/health
# Resposta esperada: {"status":"OK"}
```

### Com IP remoto:

```powershell
curl http://192.168.1.100:3001/health
```

---

## 🐛 Se ainda der erro "Ocorreu um erro..."

1. **Verifique o `.env` está correto** - Rodou `npm install` após editar?
2. **Backend está rodando?** - Veja porta 3001 com `netstat -an | findstr 3001`
3. **IP correto?** - Teste: `ping 192.168.1.100`
4. **Firewall?** - Abra a porta 3001 no firewall do Windows
5. **Restart?** - Reinicie o backend e frontend

---

## 📝 Resumo das Mudanças

✅ `frontend/vite.config.js` - Agora lê `VITE_API_URL` do `.env`
✅ `frontend/.env.example` - Novo arquivo com instruções
✅ `backend/src/server.js` - Host configurável via `HOST`
✅ `backend/src/app.js` - CORS mais flexível para redes locais
✅ `backend/.env.example` - Instruções melhoradas

