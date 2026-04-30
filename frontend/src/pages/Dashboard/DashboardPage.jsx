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
          <span>Olá, {user?.name}! (Role: {user?.role})</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>
      <main>
        <div style={{ padding: '2rem' }}>
          <h1>✅ Bem-vindo ao sistema!</h1>
          
          <div style={{ 
            background: '#f0f0f0', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <h3>📋 Suas Informações</h3>
            <p><strong>Nome:</strong> {user?.name}</p>
            <p><strong>E-mail:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>ID:</strong> {user?.id}</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              ℹ️ Você está autenticado e seu login foi salvo no localStorage
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <button 
              onClick={() => navigate('/users')}
              style={{ 
                padding: '0.75rem 1.5rem', 
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              👥 Ver Usuários
            </button>
          </div>

          <div style={{ 
            background: '#e8f5e9', 
            padding: '1rem', 
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            <h4>✨ Teste de Persistência:</h4>
            <p>1. Pressione F5 para recarregar a página</p>
            <p>2. Você deve permanecer logado</p>
            <p>3. Suas informações devem aparecer automaticamente</p>
            <p style={{ color: '#2e7d32' }}>✅ Se isso acontecer, o sistema está funcionando perfeitamente!</p>
          </div>
        </div>
      </main>
    </div>
  )
}
