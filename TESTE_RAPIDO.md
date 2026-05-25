# 🧪 Guia Rápido de Teste - VS Code

## 🚀 INICIAR O PROJETO EM 60 SEGUNDOS

### Terminal 1: Backend
```bash
# Abra um novo terminal
# Ctrl + ` (ou clique em Terminal > New Terminal)

cd backend
npm run dev
```

Você deve ver:
```
✅ Banco de dados sincronizado com sucesso!
✅ 3 usuários de teste criados com sucesso!
✅ Servidor rodando na porta 3001
```

### Terminal 2: Frontend
```bash
# Abra outro terminal
# Clique em + ao lado do terminal anterior

cd frontend
npm run dev
```

Você deve ver:
```
➜ Local: http://localhost:5173/
```

---

## 🧪 TESTAR LOGIN COM USUÁRIO PADRÃO

1. Abra http://localhost:5173 no navegador
2. Clique em "Entrar" ou vá para http://localhost:5173/login
3. Preencha:
   - **E-mail**: `admin@example.com`
   - **Senha**: `123456`
4. Clique em "✅ Entrar"

### Esperado:
- ✅ Sem mensagem de erro
- ✅ Redirecionado para o Dashboard
- ✅ Ver nome do usuário ("Admin")

---

## 🧪 TESTAR REGISTRO COM NOVA CONTA

1. Clique em "Criar uma aqui"
2. Preencha:
   - **Nome Completo**: `João Silva`
   - **E-mail**: `joao@teste.com`
   - **Senha**: `123456`
3. Clique em "✅ Cadastrar"

### Esperado:
- ✅ Sem mensagem de erro
- ✅ Redirecionado para o Dashboard
- ✅ Ver nome do usuário ("João Silva")

---

## 🧪 TESTAR PERSISTÊNCIA (MAIS IMPORTANTE!)

### Passo 1: Fazer login
- E-mail: `admin@example.com`
- Senha: `123456`
- Clique em "Entrar"

### Passo 2: Recarregar a página
- Pressione **F5** ou **Ctrl+R**

### Esperado:
- ✅ NÃO foi redirecionado para login
- ✅ Continua no Dashboard
- ✅ Dados do usuário ainda visíveis
- ✅ **ISSO SIGNIFICA QUE O PRINCIPAL PROBLEMA FOI FIXADO!** 🎉

---

## 🧪 TESTAR LOGOUT

1. Clique no botão de logout (se existir)
2. Recarregue a página (F5)

### Esperado:
- ✅ Redirecionado para login
- ✅ localStorage foi limpo

---

## 🐛 SE DER ERRO: "Erro ao cadastrar"

**Possíveis causas:**

### Erro 1: Backend não está rodando
- [ ] Terminal 1 (backend) está aberto?
- [ ] Mostra "✅ Servidor rodando na porta 3001"?
- [ ] Se não, inicie com `npm run dev`

### Erro 2: Banco de dados não conecta
- [ ] O backend está rodando?
- [ ] O arquivo `backend/database.sqlite` foi gerado?
- [ ] Credenciais corretas no `.env`?
- [ ] Reinicie o backend para regenerar o banco se necessário

### Erro 3: E-mail já existe
- [ ] Erro diz "Email já existe"?
- [ ] Use outro e-mail (ex: joao123@teste.com)

### Erro 4: Senha muito curta
- [ ] Deve ter mínimo 6 caracteres

---

## 🐛 SE DER ERRO: "Erro no login"

### Erro 1: Usuário não encontrado
- [ ] E-mail correto?
- [ ] Verifique: `admin@example.com` (não `Admin@example.com`)

### Erro 2: Senha incorreta
- [ ] Senha correta?
- [ ] Use: `123456`

### Erro 3: Backend não responde
- [ ] Backend está rodando?
- [ ] Porta 3001 está aberta?
- [ ] Firewall bloqueando?

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### No Browser (Console)

Abra o Console (F12 → Console):

```javascript
// Ver token salvo
localStorage.getItem('token')

// Ver usuário salvo
JSON.parse(localStorage.getItem('user'))

// Deve retornar:
{
  id: 1,
  name: "Admin",
  email: "admin@example.com",
  role: "admin"
}
```

### No Backend (Postman/cURL)

**Testar registro:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria",
    "email": "maria@teste.com",
    "password": "123456"
  }'
```

**Testar login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "123456"
  }'
```

---

## ✅ CHECKLIST FINAL

- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 5173
- [ ] Consegue fazer login com `admin@example.com / 123456`
- [ ] Consegue criar nova conta
- [ ] Consegue recarregar a página e continua logado
- [ ] LocalStorage tem token e user
- [ ] Redirecionado para login ao fazer logout

**Se tudo passou = PROJETO CORRIGIDO!** 🎉

---

## 💡 DICAS EXTRAS

### Ver Logs do Backend em Tempo Real
- Terminal com backend aberto já mostra logs
- Cada requisição é logada com morgan

### Limpar Cache do Browser
Se tiver problemas:
1. Abra DevTools (F12)
2. Clique direito em "Recarregar"
3. Selecione "Esvaziar cache e recarregar com cache desabilitado"

### Resetar Banco de Dados
Se quiser recomeçar do zero:
```sql
DROP DATABASE meu_banco;
CREATE DATABASE meu_banco;
```

Depois reinicie o backend (vai criar as tabelas novamente).

---

## 🎯 PRÓXIMO PASSO APÓS CONFIRMAR FUNCIONAMENTO

1. Leia o arquivo `ANALISE_ESTRUTURA.md` para entender a arquitetura
2. Leia o arquivo `FIXES_APPLIED.md` para ver o que foi mudado
3. Implemente as melhorias futuras sugeridas
4. Faça deploy em produção com HTTPS

**Boa sorte!** 🚀
