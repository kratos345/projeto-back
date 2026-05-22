import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSellerMetrics } from '../../../api/dashboard';
import { getMyProperties } from '../../../api/properties';
import { StatCard, fmt, StatusBadge } from './DashboardHelpers';

export default function VendedorDashboard({ user }) {
  const [metrics, setMetrics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsRes, propsRes] = await Promise.all([
        getSellerMetrics(),
        getMyProperties()
      ]);
      setMetrics(metricsRes.data);
      setProperties(propsRes.data.slice(0, 5));
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="fade-up"><p>Carregando dados do vendedor...</p></div>;
  if (error) return <div className="fade-up"><p className="error">{error}</p></div>;

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 32 }}>
        <h2 className="playfair" style={{ fontSize: 24, marginBottom: 8 }}>Bem-vindo, {user?.name || 'Vendedor'}!</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Gerencie seus anúncios e acompanhe seu desempenho.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="tag" label="Anúncios totais" value={metrics.properties.total || 0} delta={metrics.properties.active ? 12 : 0} />
        <StatCard icon="users" label="Leads recebidos" value={metrics.leads.total || 0} delta={0} color="var(--blue)" />
        <StatCard icon="eye" label="Visualizações" value={metrics.stats.totalViews || 0} delta={0} color="var(--green)" />
        <StatCard icon="chart" label="Anúncios ativos" value={metrics.properties.active || 0} delta={0} color="var(--amber)" />
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button className="btn-gold" onClick={() => navigate('/properties/my', { state: { openNew: true } })}>➕ Novo Anúncio</button>
        <button className="btn-secondary" onClick={() => navigate('/properties/my')}>📋 Ver Todos os Anúncios</button>
        <button className="btn-secondary" onClick={() => navigate('/leads')}>💬 Ver Leads</button>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Seus Últimos Anúncios</h3>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Anúncio</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={property.image || 'https://via.placeholder.com/80'} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontWeight: 500, fontSize: 13 }}>{property.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--muted)' }}>{property.type}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{fmt(property.price)}</td>
                  <td><StatusBadge status={property.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => navigate('/properties/my', { state: { editId: property.id } })}>Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
