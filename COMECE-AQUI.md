# 🚀 Guia Rápido - Executar Projeto

## 📋 Primeira Vez (Setup Inicial)

Na **raiz do projeto**, execute uma única vez:

```bash
npm run install:all
```

Isso instalará as dependências de:
- Raiz do projeto
- API (backend)
- Web (frontend)

---

## ⚡ Executar Backend + Frontend Juntos

Na **raiz do projeto**, execute:

```bash
npm run dev
```

Isso iniciará **simultaneamente**:
- ✅ **API** (Backend) na porta `3001`
- ✅ **Web** (Frontend) na porta `5173`

Você verá os logs de ambos no terminal. Para parar tudo, pressione `Ctrl+C`.

---

## 🎯 Comandos Individuais (Opcional)

Se preferir executar separadamente:

```bash
# Apenas API (Backend)
npm run dev:api

# Apenas Web (Frontend)
npm run dev:web
```

---

## 📦 Para outro computador

1. Copie a pasta inteira do projeto
2. Abra o terminal na raiz
3. Execute:
   ```bash
   npm run install:all
   npm run dev
   ```

Pronto! Tudo funcionando sem erros de conexão! ✨
