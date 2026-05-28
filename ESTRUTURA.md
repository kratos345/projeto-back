# 📁 Estrutura Final do Projeto

```
meu-projeto/
├── api/                  ← Backend (Node.js + Express)
├── web/                  ← Frontend (React + Vite)
├── package.json          ← Maestro do projeto (controla ambos)
├── INICIAR.bat          ← Clique aqui para iniciar tudo (Windows)
├── COMECE-AQUI.md       ← Guia rápido
└── .git/                ← Controle de versão
```

## 🎯 Estrutura Antiga (REMOVIDA)

```
❌ backend/    → ✅ Agora: api/
❌ frontend/   → ✅ Agora: web/
```

---

## ⚡ Como Usar

### Terminal (Recomendado)
Na **raiz do projeto**:
```bash
npm run dev
```

### Clique e Pronto
Execute `INICIAR.bat`

---

## 📋 Comandos Disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run install:all` | Instala dependências de tudo (primeira vez) |
| `npm run dev` | Inicia API + Web juntos |
| `npm run dev:api` | Inicia apenas API |
| `npm run dev:web` | Inicia apenas Web |
| `npm run build` | Compila API + Web |

---

## 🌐 Portas

| Serviço | Porta | URL |
|---------|-------|-----|
| **API** | 3001 | http://localhost:3001/api/ |
| **Web** | 5173 | http://localhost:5173 |

---

## 🚀 Para Outro Computador

1. Copie a pasta inteira `meu-projeto/`
2. Abra terminal na raiz
3. Execute:
   ```bash
   npm run install:all
   npm run dev
   ```

**Pronto!** Sem erros de conexão! ✨

---

## ✅ Vantagens dessa Estrutura

✅ Estrutura única e simples  
✅ Fácil copiar para outro computador  
✅ Evita erros de porta/conexão  
✅ Inicia tudo com um comando  
✅ Nomes claros: `api` e `web` (profissional)
