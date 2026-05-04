import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';

export default function DashboardPage() {
  const { user, loading, signout } = useAuth();
  const navigate = useNavigate();
  const logout = () => { signout(); navigate('/login') };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Navbar comum
  const navbar = (
    <header className="top-bar">
      <h2>Dashboard</h2>
      <div>
        <span>Olá, {user?.name}! (Role: {user?.role})</span>
        <button onClick={logout}>Sair</button>
      </div>
    </header>
  );

  // Admin vê o dashboard Admin
  if (user.role === 'admin') {
    return (
      <>
        {navbar}
        <AdminDashboard />
      </>
    );
  }

  // Vendedor vê o dashboard Vendedor
  if (user.role === 'vendedor') {
    return (
      <>
        {navbar}
        <SellerDashboard />
      </>
    );
  }

  // Usuário comum vê página inicial de busca
  return (
    <div className="page">
      {navbar}
      <main style={{ padding: '2rem' }}>
        <h1>Bem-vindo, {user.name}! 👋</h1>
        <p>Esta é sua página inicial. Em breve aqui você poderá buscar imóveis!</p>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => navigate('/favorites')} style={{ marginRight: '0.5rem' }}>
            ❤️ Meus Favoritos
          </button>
          <button onClick={() => navigate('/profile')}>
            👤 Meu Perfil
          </button>
        </div>
      </main>
    </div>
  );
}
