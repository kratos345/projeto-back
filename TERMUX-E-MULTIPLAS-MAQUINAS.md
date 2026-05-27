# 🔧 Configuração para Diferentes Ambientes (Máquinas + Termux/Android)

## 📱 Terminux/Android - Como Funciona?

**Termux** é um emulador de terminal para Android. Você pode:
- Rodar o backend em um PC
- Acessar via navegador do Android
- Usar Termux para scripts/ferramentas

---

## 🖥️ Cenário 1: Tudo Local (1 PC)

### Backend `.env`:
```env
HOST=0.0.0.0
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`:
```env
VITE_API_URL=http://localhost:3001
```

### Para Termux/Android:
No navegador do celular, acesse:
```
http://192.168.1.100:5173
```
(substitua o IP pelo IP do seu PC na rede)

---

## 🌐 Cenário 2: Backend em PC1, Frontend Browser do Android

**PC1 (Backend) - IP: 192.168.1.100:**

### Backend `.env`:
```env
HOST=0.0.0.0
PORT=3001
NODE_ENV=development
CLIENT_URL=http://192.168.1.*:*
```

**Android - Via navegador:**
Abra: `http://192.168.1.100:3001`

> ⚠️ **Nota:** O backend expõe uma API, não uma UI. Para UI, precisa do frontend.

---

## 🔌 Cenário 3: Backend PC1, Frontend PC2, Acessar de Android

**PC1 (Backend) - IP: 192.168.1.100:**
```env
HOST=0.0.0.0
PORT=3001
NODE_ENV=development
CLIENT_URL=http://192.168.1.101:5173
```

**PC2 (Frontend) - IP: 192.168.1.101:**
```env
VITE_API_URL=http://192.168.1.100:3001
```

**Android - Via navegador:**
Acesse PC2: `http://192.168.1.101:5173`

---

## ✅ Verificar Conectividade

### Testar se Backend está acessível:

**Do PC:**
```powershell
curl http://localhost:3001/health
# Resposta: {"status":"OK"}
```

**De outra máquina:**
```powershell
curl http://192.168.1.100:3001/health
```

**Do Android (Termux ou navegador):**
```bash
# No Termux
curl http://192.168.1.100:3001/health

# Ou acesse direto no navegador:
http://192.168.1.100:3001/health
```

---

## 🔴 Se der erro "Ocorreu um erro..."

### 1. Verifique logs do Frontend
Abra console do navegador: `F12` → Aba "Console"
- Procure por `❌ [API Error]`
- Verá exatamente qual é o problema

### 2. Verificar configuração
```javascript
// Veja qual API_URL está sendo usada:
// No console do navegador, digite:
console.log(__API_URL__)  // Ou
import.meta.env.VITE_API_URL
```

### 3. Problemas comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `❌ [API] Network Error` | Backend não está respondendo | Verifique se backend está rodando: `npm run dev` no backend |
| `⚠️ Erro de conexão` | URL incorreta no `.env` | Edite `frontend/.env` com o IP correto |
| `CORS bloqueou` | Frontend URL não autorizada | Edite `backend/.env` - `CLIENT_URL` |
| Erro 500 | Backend quebrou | Veja logs do backend no terminal |

---

## 📍 Descobrir IP do PC

### Windows:
```powershell
ipconfig
# Procure por "IPv4 Address:" na seção da sua rede
# Exemplo: 192.168.1.100
```

### Linux/Mac:
```bash
ifconfig
# ou
ip addr show
```

### Android:
Configurações → Sobre do telefone → Endereço IP

---

## 🚀 Checklist de Funcionamento

- [ ] Backend rodando (`npm run dev` na pasta backend)
- [ ] Frontend rodando (`npm run dev` na pasta frontend)
- [ ] `.env` configurado em ambas as pastas
- [ ] IP correto no `.env` do frontend
- [ ] Backend `.env` tem `HOST=0.0.0.0`
- [ ] Firewall do PC permite porta 3001 (Windows Defender)
- [ ] Celular está na mesma rede WiFi

---

## 🛡️ Segurança

⚠️ **NUNCA faça isso em produção:**
```env
CLIENT_URL=*  # ❌ Permite qualquer origem
HOST=0.0.0.0  # ⚠️ Apenas desenvolvimento
```

Em produção, sempre especifique domínios/IPs conhecidos.

---

## 📚 Referência Rápida

```bash
# Frontend com IP remoto
VITE_API_URL=http://192.168.1.100:3001

# Backend aceitando conexões de fora
HOST=0.0.0.0

# CORS configurado no backend
CLIENT_URL=http://192.168.1.101:5173
```

