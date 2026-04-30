# 🧪 GUIA INTERATIVO DE TESTES - PASSO A PASSO

## 🎯 OBJETIVO

Verificar se o sistema de autenticação está **100% funcional** testando:
1. ✅ Registro de novo usuário
2. ✅ Login com novo usuário
3. ✅ Persistência de login (F5)
4. ✅ Logout

---

## 🚀 PASSO 1: INICIAR OS SERVIDORES

### Abra 2 terminais no VS Code

**Terminal 1:**
```bash
cd backend && npm run dev
```

Aguarde até ver:
```
✅ Banco de dados sincronizado com sucesso!
✅ Servidor rodando na porta 3001
```

**Terminal 2:**
```bash
cd frontend && npm run dev
```

Aguarde até ver:
```
➜ Local: http://localhost:5173/
```

---

## ✅ PASSO 2: TESTE DE REGISTRO

### No Browser: http://localhost:5173/

1. **Você verá a página de LOGIN**
   - Tem dois links: "Entrar" e "Criar uma aqui"
   - Clique em **"Criar uma aqui"**

2. **Formulário de Registro**
   - Nome Completo: `João Silva` (ou seu nome)
   - E-mail: `joao@teste.com` (use um e-mail único)
   - Senha: `123456`
   - Clique em **"✅ Cadastrar"**

3. **Esperado:**
   ```
   ✅ SEM erro na tela
   ✅ Redirecionado para Dashboard
   ✅ Ver nome "João Silva" no topo
   ✅ Ver e-mail "joao@teste.com"
   ✅ Ver role "user"
   ```

**Se deu erro:**
- [ ] Verifique se o backend está rodando (porta 3001)
- [ ] Verifique se não está usando um e-mail duplicado
- [ ] Tente em modo anônimo do navegador

---

## ✅ PASSO 3: TESTE DE PERSISTÊNCIA (PRINCIPAL!)

### No Dashboard que você está agora:

1. **Pressione F5 para recarregar a página**
   - Tecla: **F5** ou **Ctrl+R**

2. **Esperado (MUITO IMPORTANTE!):**
   ```
   ✅ NÃO foi redirecionado para login
   ✅ Continua no Dashboard
   ✅ Seu nome continua visível
   ✅ E-mail continua visível
   ✅ Role continua visível
   ```

3. **Se aconteceu o esperado:**
   - 🎉 **PARABÉNS! Sistema funcionando perfeitamente!**
   - Seu login foi salvo no localStorage
   - A sessão persiste ao recarregar

4. **Se foi para login:**
   - ❌ Isso significaria um problema
   - Mas você recebeu instruções de correção!

---

## ✅ PASSO 4: TESTE DE LOGOUT

### Ainda no Dashboard:

1. **Clique no botão "Sair"** no canto superior direito

2. **Esperado:**
   ```
   ✅ Redirecionado para a página de Login
   ✅ localStorage foi limpo
   ```

3. **Confirme que localStorage foi limpo:**
   - Abra DevTools: **F12**
   - Vá para **Application** (ou Storage)
   - Veja **localStorage**
   - Confirme que `token` e `user` foram removidos

---

## ✅ PASSO 5: TESTE DE LOGIN

### De volta na página de Login:

1. **Preencha com o novo usuário:**
   - E-mail: `joao@teste.com` (o que você criou)
   - Senha: `123456`
   - Clique em **"✅ Entrar"**

2. **Esperado:**
   ```
   ✅ SEM erro na tela
   ✅ Redirecionado para Dashboard
   ✅ Seus dados aparecem
   ```

3. **Confirme localStorage:**
   - Abra DevTools: **F12**
   - Vá para **Application** → **localStorage**
   - Confirme que `token` e `user` foram salvos

---

## ✅ PASSO 6: TESTE COM USUÁRIO PRÉ-CRIADO

### Fazer logout primeiro:

1. Clique em "Sair"
2. Você volta para login

### Login com admin:

1. **Preencha:**
   - E-mail: `admin@example.com`
   - Senha: `123456`
   - Clique em **"✅ Entrar"**

2. **Esperado:**
   ```
   ✅ Redirecionado para Dashboard
   ✅ Nome: "Admin"
   ✅ E-mail: "admin@example.com"
   ✅ Role: "admin" (⚠️ Note que é admin, não user!)
   ```

3. **Teste F5:**
   - Pressione F5
   - Deve continuar logado como Admin

---

## 🔍 VERIFICAR CONSOLE DO NAVEGADOR

### DevTools: F12 → Console

**Digite no console:**

```javascript
// Ver token
localStorage.getItem('token')
// Deve retornar: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Ver usuário
JSON.parse(localStorage.getItem('user'))
// Deve retornar:
// {
//   id: 1,
//   name: "Admin",
//   email: "admin@example.com",
//   role: "admin"
// }
```

---

## 📊 CHECKLIST DE TESTES

Marque conforme você vai testando:

- [ ] Backend iniciou com "Servidor rodando na porta 3001"
- [ ] Frontend iniciou com "Local: http://localhost:5173/"
- [ ] Consegui criar novo usuário (Registro)
- [ ] Fui redirecionado para Dashboard
- [ ] Meus dados aparecem no Dashboard
- [ ] Pressionar F5 não deslogou (PERSISTÊNCIA!)
- [ ] Consegui fazer logout
- [ ] localStorage foi limpo após logout
- [ ] Consegui fazer login com novo usuário
- [ ] localStorage tem token e user após login
- [ ] Consegui fazer login com admin@example.com
- [ ] Admin tem role: "admin"
- [ ] Tudo funcionando como esperado

**Se todos os itens estão marcados = ✅ SUCESSO!**

---

## ⚠️ PROBLEMAS COMUNS

### "Erro ao cadastrar"

**Causa 1: Backend não está rodando**
- Verifique Terminal 1
- Deve mostrar "✅ Servidor rodando na porta 3001"
- Se não, execute: `cd backend && npm run dev`

**Causa 2: E-mail já existe**
- Use um e-mail diferente
- Ex: `joao999@teste.com`

**Causa 3: Senha muito curta**
- Mínimo 6 caracteres
- Use: `123456`

### "Erro ao tentar fazer login"

**Causa 1: E-mail não encontrado**
- Certifique-se que o usuário foi criado
- Verifique o e-mail correto

**Causa 2: Senha incorreta**
- Certifique-se que digitou correto
- Use a mesma senha do registro

**Causa 3: Backend não responde**
- Verifique se backend está rodando
- Tente em http://localhost:3001/health

### "Deslogou ao recarregar a página"

**Isso NÃO deve acontecer!**
- Significa que localStorage não está sendo usado
- Mas o sistema foi corrigido para isso
- Limpe o cache do navegador:
  1. F12
  2. Clique direito em "Recarregar"
  3. Selecione "Esvaziar cache e recarregar"

---

## 🎓 O QUE ESTÁ SENDO TESTADO

| Teste | Verifica | Resultado |
|-------|----------|-----------|
| Registro | Criação de usuário | ✅ Deve criar |
| Registro | Geração de token | ✅ Deve ter token |
| Registro | Redirecionamento | ✅ Deve ir a dashboard |
| Persistência | localStorage | ✅ Deve salvar |
| Persistência | F5 não desloga | ✅ Deve permanecer |
| Login | Validação email/senha | ✅ Deve validar |
| Login | Geração de token | ✅ Deve ter token |
| Login | localStorage | ✅ Deve salvar |
| Logout | Limpeza de localStorage | ✅ Deve limpar |
| Logout | Redirecionamento | ✅ Deve ir a login |

---

## 🎯 RESULTADO ESPERADO

Se todos os testes passarem:

```
🎉 PARABÉNS! 🎉

Seu sistema de autenticação está:
✅ Criando usuários
✅ Gerando tokens
✅ Persistindo login
✅ Fazendo logout
✅ Recarregando sem perder sessão

PRONTO PARA PRODUÇÃO! 🚀
```

---

## 📞 PRÓXIMAS AÇÕES

Se tudo passou:
1. ✅ Leia `ANALISE_ESTRUTURA.md` para entender a arquitetura
2. ✅ Leia `FIXES_APPLIED.md` para ver o que foi corrigido
3. ✅ Implemente as melhorias futuras
4. ✅ Faça deploy em produção (com HTTPS)

Se teve problema:
1. ⚠️ Leia a seção "PROBLEMAS COMUNS"
2. ⚠️ Consulte `TESTE_RAPIDO.md`
3. ⚠️ Consulte `COMO_RODAR.md`

---

**Boa sorte nos testes!** 🚀

Quando terminar, você terá confirmado que o sistema funciona 100%! 🎉
