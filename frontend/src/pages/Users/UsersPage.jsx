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
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user', cpfCnpj: '' })
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

    if (!newUser.name || !newUser.email || !newUser.password) {
      setCreateError('Nome, email e senha são obrigatórios.')
      return
    }

    if (newUser.password.length < 6) {
      setCreateError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setCreateLoading(true)

    try {
      const data = await registerRequest(newUser)
      setCreateSuccess('Usuário criado com sucesso!')
      setNewUser({ name: '', email: '', password: '', role: 'user', cpfCnpj: '' })
      setList((prev) => {
        const current = prev || users || []
        return [data.user, ...current]
      })
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Erro ao criar usuário.'
      setCreateError(message)
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

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0 }}>Criar novo usuário</h3>
            <p style={{ margin: '6px 0 0', color: '#4b5563' }}>Somente administradores podem criar novos usuários.</p>
          </div>
        </div>

        {createError && <p style={{ color: '#dc2626', marginBottom: 12 }}>{createError}</p>}
        {createSuccess && <p style={{ color: '#16a34a', marginBottom: 12 }}>{createSuccess}</p>}

        <form onSubmit={handleCreateUser} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input
              name="name"
              value={newUser.name}
              onChange={handleNewChange}
              placeholder="Nome"
              className="inp"
              disabled={createLoading}
            />
            <input
              name="email"
              value={newUser.email}
              onChange={handleNewChange}
              placeholder="E-mail"
              type="email"
              className="inp"
              disabled={createLoading}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input
              name="password"
              value={newUser.password}
              onChange={handleNewChange}
              placeholder="Senha"
              type="password"
              className="inp"
              disabled={createLoading}
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleNewChange}
              className="inp"
              disabled={createLoading}
              style={{ padding: '12px 10px' }}
            >
              <option value="user">Usuário</option>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center' }}>
            <input
              name="cpfCnpj"
              value={newUser.cpfCnpj}
              onChange={handleNewChange}
              placeholder="CPF/CNPJ"
              className="inp"
              disabled={createLoading}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={createLoading}
              style={{ width: '100%', minHeight: 44 }}
            >
              {createLoading ? 'Criando...' : 'Criar usuário'}
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
