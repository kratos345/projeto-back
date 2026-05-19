import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getUsers, deleteUser, updateUser } from '../../api/users'
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
  const { data: users, loading, error } = useFetch(getUsers)
  const [list, setList] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('todos')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [message, setMessage] = useState('')

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

  const handleToggleBlock = async (targetUser) => {
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

  const handleRefresh = () => {
    setList(null)
    setSearch('')
    setRoleFilter('todos')
    setStatusFilter('todos')
    setMessage('')
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
    <div className="page">
      <header className="top-bar">
        <div>
          <h2>Gerenciar Usuários</h2>
          <p>Edite, bloqueie ou remova usuários com segurança.</p>
        </div>
        <button onClick={() => navigate('/')}>Voltar</button>
      </header>

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
          <button type="button" className="btn-approve" onClick={handleRefresh} style={{ marginLeft: 0 }}>
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
                    <button onClick={() => navigate(`/users/edit/${u.id}`)}>Editar</button>
                    <button
                      onClick={() => handleToggleBlock(u)}
                      style={{ marginLeft: 8 }}
                    >
                      {u.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={currentUser?.id === u.id}
                      style={{ marginLeft: 8, opacity: currentUser?.id === u.id ? 0.6 : 1 }}
                    >
                      Remover
                    </button>
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
