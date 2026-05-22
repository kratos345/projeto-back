import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties } from '../../../api/properties';
import { getAdminMetrics } from '../../../api/dashboard';
import { getUsers } from '../../../api/users';
import { StatCard, fmt, StatusBadge, Ic } from './DashboardHelpers';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [metricsRes, propsRes, usersRes] = await Promise.all([
        getAdminMetrics(),
        getProperties({ status: 'all' }),
        getUsers(),
      ]);

      setMetrics(metricsRes.data);
      setProperties(propsRes.data.slice(0, 5));
      setUsers(usersRes.data.slice(0, 5));
    } catch (err) {
      setError('Erro ao carregar dados do administrador');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="fade-up"><p>Carregando painel de admin...</p></div>;
  if (error) return <div className="fade-up"><p className="error">{error}</p></div>;

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 32 }}>
        <h2 className="playfair" style={{ fontSize: 24, marginBottom: 8 }}>Painel Administrativo</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Monitoramento de anúncios, usuários e leads.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="building" label="Propriedades" value={metrics.properties.total || 0} delta={metrics.properties.active ? 8 : 0} />
        <StatCard icon="users" label="Usuários" value={metrics.users.total || 0} delta={metrics.users.active ? 6 : 0} color="var(--blue)" />
        <StatCard icon="bell" label="Leads" value={metrics.leads.total || 0} delta={0} color="var(--green)" />
        <StatCard icon="chart" label="Anúncios ativos" value={metrics.properties.active || 0} delta={0} color="var(--amber)" />
      </div>

      <div style={{ display: 'grid', gap: 20, marginBottom: 32 }}>
        <section style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Últimos anúncios</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Veja os anúncios mais recentes cadastrados.</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate('/properties')}>Ver Todos</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {properties.map((property) => (
              <div key={property.id} style={{ display: 'flex', alignItems: 'center', gap: 16, border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
                <img src={property.image || 'https://via.placeholder.com/80'} alt={property.title} style={{ width: 80, height: 64, borderRadius: 12, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{property.title}</p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>{property.location}</p>
                </div>
                <StatusBadge status={property.status} />
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Usuários recentes</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Últimos usuários cadastrados na plataforma.</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate('/users')}>Ver Todos</button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {users.map((userItem) => (
              <li key={userItem.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, borderRadius: 14, border: '1px solid var(--border)' }}>
                <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gold-light)', display: 'grid', placeItems: 'center' }}><Ic name="user" size={18} color="var(--gold)" /></span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{userItem.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{userItem.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
