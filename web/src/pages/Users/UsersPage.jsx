import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getUsers, deleteUser, updateUser } from '../../api/users'
import { registerRequest } from '../../api/auth'
import { useFetch } from '../../hooks/useFetch'
import '../../styles/admin.css'

const ROLE_LABELS = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
  user: 'Usuário'
}

const STATUS_LABELS = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  bloqueado: 'Bloqueado'
}

export default function UsersPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [list, setList] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('todos')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [message, setMessage] = useState('')
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user', cpfCnpj: '' })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Deseja realmente remover este usuário?')
    if (!confirmed) return

    try {
      await deleteUser(id)
      setList((prev) => (prev || users).filter((u) => u.id !== id))
      setMessage('Usuário removido com sucesso.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erro ao remover usuário.')
    }
  }

  const { data: users, loading, error, reload } = useFetch(getUsers)

  const handleToggleBlock = async (targetUser) => {
    if (currentUser?.id === targetUser.id) {
      setMessage('Você não pode bloquear ou desbloquear seu próprio usuário.')
      return
    }

    const nextStatus = targetUser.status === 'bloqueado' ? 'ativo' : 'bloqueado'
    const action = nextStatus === 'ativo' ? 'desbloquear' : 'bloquear'
    const confirmed = window.confirm(`Deseja ${action} o usuário ${targetUser.name}?`)
    if (!confirmed) return

    try {
      await updateUser(targetUser.id, { status: nextStatus })
      setList((prev) => (prev || users).map((u) => u.id === targetUser.id ? { ...u, status: nextStatus } : u))
      setMessage(`Usuário ${action}do com sucesso.`)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erro ao atualizar status do usuário.')
    }
  }

  const handleRefresh = async () => {
    setList(null)
    setSearch('')
    setRoleFilter('todos')
    setStatusFilter('todos')
    setMessage('')

    try {
      await reload()
    } catch (err) {
      setMessage('Não foi possível atualizar a lista de usuários.')
    }
  }

  const handleNewChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value })
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreateSuccess('')

    // Validações
    if (!newUser.name.trim()) {
      setCreateError('❌ Nome é obrigatório.')
      setTimeout(() => setCreateError(''), 4000)
      return
    }
    
    if (!newUser.email.trim()) {
      setCreateError('❌ E-mail é obrigatório.')
      setTimeout(() => setCreateError(''), 4000)
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      setCreateError('❌ E-mail inválido.')
      setTimeout(() => setCreateError(''), 4000)
      return
    }

    // Verificar se email já existe
    const emailExists = usersList.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())
    if (emailExists) {
      setCreateError('❌ Este e-mail já está cadastrado.')
      setTimeout(() => setCreateError(''), 4000)
      return
    }

    if (!newUser.password) {
      setCreateError('❌ Senha é obrigatória.')
      setTimeout(() => setCreateError(''), 4000)
      return
    }

    // Validar requisitos da senha
    const passwordErrors = []
    if (newUser.password.length < 8) passwordErrors.push('mínimo 8 caracteres')
    if (!/[A-Z]/.test(newUser.password)) passwordErrors.push('letra maiúscula')
    if (!/[a-z]/.test(newUser.password)) passwordErrors.push('letra minúscula')
    if (!/[0-9]/.test(newUser.password)) passwordErrors.push('número')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newUser.password)) passwordErrors.push('caractere especial')

    if (passwordErrors.length > 0) {
      setCreateError(`❌ A senha deve conter: ${passwordErrors.join(', ')}.`)
      setTimeout(() => setCreateError(''), 4000)
      return
    }

    if (!newUser.confirmPassword) {
      setCreateError('❌ Confirmação de senha é obrigatória.')
      setTimeout(() => setCreateError(''), 4000)
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      setCreateError('❌ As senhas não coincidem.')
      setTimeout(() => setCreateError(''), 4000)
      return
    }

    // Validar CPF/CNPJ se preenchido
    if (newUser.cpfCnpj.trim()) {
      const cpfCnpjClean = newUser.cpfCnpj.replace(/\D/g, '')
      if (cpfCnpjClean.length < 11) {
        setCreateError('❌ CPF/CNPJ deve ter pelo menos 11 dígitos.')
        setTimeout(() => setCreateError(''), 4000)
        return
      }
      if (cpfCnpjClean.length > 14) {
        setCreateError('❌ CPF/CNPJ inválido.')
        setTimeout(() => setCreateError(''), 4000)
        return
      }
    }

    setCreateLoading(true)

    try {
      const data = await registerRequest(newUser)
      setCreateSuccess('✅ Usuário criado com sucesso!')
      setNewUser({ name: '', email: '', password: '', confirmPassword: '', role: 'user', cpfCnpj: '' })
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setCreateSuccess(''), 3000)
      
      setList((prev) => {
        const current = prev || users || []
        return [data.user, ...current]
      })
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Erro ao criar usuário.'
      setCreateError(`❌ ${message}`)
      setTimeout(() => setCreateError(''), 4000)
    } finally {
      setCreateLoading(false)
    }
  }

  const usersList = list || users || []

  const filteredRows = useMemo(() => {
    return usersList.filter((u) => {
      const searchValue = search.toLowerCase()
      const matchSearch =
        u.name.toLowerCase().includes(searchValue) ||
        u.email.toLowerCase().includes(searchValue) ||
        u.id.toString().includes(searchValue)

      const matchRole = roleFilter === 'todos' || u.role === roleFilter
      const matchStatus = statusFilter === 'todos' || u.status === statusFilter

      return matchSearch && matchRole && matchStatus
    })
  }, [usersList, search, roleFilter, statusFilter])

  return (
    <div className="page admin-page">
      <header className="top-bar">
        <div>
          <h2>Gerenciar Usuários</h2>
          <p>Edite, bloqueie ou remova usuários com segurança.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/')}>Voltar</button>
      </header>

      <div className="card" style={{ marginBottom: 18, borderLeft: '4px solid var(--gold)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>➕ Criar novo usuário</h3>
            <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Preencha os dados abaixo para criar uma nova conta.</p>
          </div>
        </div>

        {createError && <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: 12, borderRadius: 8, marginBottom: 12 }}>{createError}</div>}
        {createSuccess && <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: 12, borderRadius: 8, marginBottom: 12 }}>{createSuccess}</div>}

        <form onSubmit={handleCreateUser} style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Nome completo *</label>
              <input
                name="name"
                value={newUser.name}
                onChange={handleNewChange}
                placeholder="Ex: João Silva"
                className="inp"
                disabled={createLoading}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>E-mail *</label>
              <input
                name="email"
                value={newUser.email}
                onChange={handleNewChange}
                placeholder="Ex: joao@email.com"
                type="email"
                className="inp"
                disabled={createLoading}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Senha (8+ caracteres, maiúscula, número, especial) *</label>
              <input
                name="password"
                value={newUser.password}
                onChange={handleNewChange}
                placeholder="••••••••"
                type="password"
                className="inp"
                disabled={createLoading}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Confirmar Senha *</label>
              <input
                name="confirmPassword"
                value={newUser.confirmPassword}
                onChange={handleNewChange}
                placeholder="••••••••"
                type="password"
                className="inp"
                disabled={createLoading}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Tipo de conta *</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleNewChange}
                className="inp"
                disabled={createLoading}
                style={{ padding: '10px 10px' }}
              >
                <option value="user">👤 Usuário padrão</option>
                <option value="vendedor">🏠 Vendedor de imóveis</option>
                <option value="admin">🔐 Administrador</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>CPF/CNPJ (opcional)</label>
              <input
                name="cpfCnpj"
                value={newUser.cpfCnpj}
                onChange={handleNewChange}
                placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-90"
                className="inp"
                disabled={createLoading}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={createLoading}
              style={{ width: '100%', minHeight: 44, fontWeight: 600 }}
            >
              {createLoading ? '⏳ Criando...' : '✅ Criar usuário'}
            </button>
          </div>
        </form>
      </div>

      <main>
        <div className="admin-filters" style={{ alignItems: 'center', marginBottom: 16 }}>
          <input
            type="search"
            placeholder="Buscar por nome, email ou ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-select"
            style={{ width: 260 }}
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="filter-select">
            <option value="todos">Todos os papéis</option>
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
            <option value="user">Usuário</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
          <button type="button" className="btn-secondary" onClick={handleRefresh} style={{ marginLeft: 0 }}>
            Atualizar
          </button>
        </div>

        {message && <p style={{ color: '#1d4ed8', marginBottom: 16 }}>{message}</p>}
        {loading && <p>Carregando...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && filteredRows.length === 0 && <p>Nenhum usuário encontrado.</p>}

        {!loading && filteredRows.length > 0 && (
          <table className="table-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Papel</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{ROLE_LABELS[u.role] || u.role}</td>
                  <td>{STATUS_LABELS[u.status] || u.status}</td>
                  <td>
                    <div className="user-actions">
                      {u.role === 'admin' ? (
                        <span className="admin-action-symbol">🔒 Admin protegido</span>
                      ) : (
                        <>
                          <button className="btn-secondary" onClick={() => navigate(`/users/edit/${u.id}`)}>Editar</button>
                          <button className="btn-secondary" onClick={() => handleToggleBlock(u)}>
                            {u.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(u.id)}
                            disabled={currentUser?.id === u.id}
                          >
                            Remover
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}
