import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';
import SearchPage from '../Search/SearchPage';

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

  // Navbar comum para todos os usuários
  const navbar = (
    <header className="top-bar">
      <h2>Dashboard - {user.role === 'admin' ? 'Administrador' : user.role === 'vendedor' ? 'Vendedor' : 'Comprador'}</h2>
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

  // Usuário comum vê a página de busca de imóveis
  return (
    <div className="page">
      {navbar}
      <SearchPage />
    </div>
  );
}
