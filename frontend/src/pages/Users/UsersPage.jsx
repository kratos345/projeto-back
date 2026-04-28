import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, deleteUser } from '../../api/users'
import { useFetch } from '../../hooks/useFetch'

export default function UsersPage() {
  const navigate = useNavigate()
  const { data: users, loading, error } = useFetch(getUsers)
  const [list, setList] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Remover usuario?')) return
    await deleteUser(id)
    setList((list || users).filter((u) => u.id !== id))
  }

  const rows = list || users || []

  return (
    <div className="page">
      <header className="top-bar">
        <h2>Usuarios</h2>
        <button onClick={() => navigate('/')}>Voltar</button>
      </header>
      <main>
        {loading && <p>Carregando...</p>}
        {error   && <p className="error">{error}</p>}
        {!loading && (
          <table>
            <thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Papel</th><th>Acoes</th></tr></thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                  <td><button onClick={() => handleDelete(u.id)}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}
