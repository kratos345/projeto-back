import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { user, signout } = useAuth()
  const navigate = useNavigate()
  const logout = () => { signout(); navigate('/login') }

  return (
    <div className="page">
      <header className="top-bar">
        <h2>Dashboard</h2>
        <div>
          <span>Ola, {user?.name}</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>
      <main>
        <p>Bem-vindo ao sistema!</p>
        <button onClick={() => navigate('/users')}>Ver usuarios</button>
      </main>
    </div>
  )
}
