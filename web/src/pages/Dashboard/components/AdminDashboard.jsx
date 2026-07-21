import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminMetrics } from '../../../api/dashboard';
import { getRequests } from '../../../api/requests';
import { StatCard, fmt, Ic } from './DashboardHelpers';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getAdminMetrics();
      setMetrics(response.data);
      // carregar solicitações recentes
      setReqLoading(true);
      try {
        const r = await getRequests();
        setRequests(r.data || []);
      } catch (e) {
        // ignore
      } finally {
        setReqLoading(false);
      }
    } catch (err) {
      setError('Erro ao carregar dados do administrador.');
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
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Tudo que um administrador precisa para gerir a plataforma.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="building" label="Total de propriedades" value={metrics.properties.total || 0} color="var(--gold)" />
        <StatCard icon="tag" label="Anúncios pendentes" value={metrics.properties.pending || 0} color="var(--amber)" />
        <StatCard icon="bell" label="Leads novos" value={metrics.leads.new || 0} color="var(--green)" />
        <StatCard icon="chart" label="Receita vendida" value={fmt(metrics.sales.totalRevenue || 0)} color="var(--blue)" />
      </div>

      <div style={{ display: 'grid', gap: 20, marginBottom: 32 }}>
        <section style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Ações rápidas</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Acesso direto às principais áreas de gestão.</p>
            </div>
          </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
            <button className="btn-gold" style={{ width: '100%', padding: 16, textAlign: 'left' }} onClick={() => navigate('/users')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Ic name="users" size={18} color="white" /><strong>Gerenciar usuários</strong></div>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Criar, editar e controlar acessos.</p>
            </button>
            <button className="btn-secondary" style={{ width: '100%', padding: 16, textAlign: 'left' }} onClick={() => navigate('/properties')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Ic name="building" size={18} color="var(--blue)" /><strong>Revisar anúncios</strong></div>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--muted)' }}>Aprovar ou rejeitar imóveis pendentes.</p>
            </button>
            <div className="card" style={{ padding: 16, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Ic name="chart" size={18} color="var(--green)" /><strong>Visão rápida</strong></div>
              <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--muted)' }}>Total de admins: {metrics.users.admins || 0}</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>Vendedores: {metrics.users.sellers || 0}</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>Compradores: {metrics.users.buyers || 0}</p>
            </div>

            <div className="card" style={{ padding: 16, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Ic name="bell" size={18} color="var(--amber)" /><strong>Solicitações</strong></div>
              <p style={{ margin: '10px 0 8px', fontSize: 13, color: 'var(--muted)' }}>{reqLoading ? 'Carregando...' : `${requests.length} solicitações`}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 90, overflow: 'auto' }}>
                {requests.slice(0,3).map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.cpfCnpj}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
                {requests.length === 0 && !reqLoading && <div style={{ color: 'var(--muted)' }}>Nenhuma solicitação</div>}
              </div>
              <div style={{ marginTop: 10, textAlign: 'right' }}>
                <button onClick={() => navigate('/admin/requests')} className="btn-secondary" style={{ padding: '6px 10px' }}>Ver todas</button>
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Resumo de performance</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Principais informações para decisões administrativas.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)' }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Anúncios ativos</p>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{metrics.properties.active || 0}</p>
            </div>
            <div style={{ padding: 16, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)' }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Vendas concluídas</p>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{metrics.properties.sold || 0}</p>
            </div>
            <div style={{ padding: 16, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)' }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Leads fechados</p>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{metrics.leads.closed || 0}</p>
            </div>
            <div style={{ padding: 16, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)' }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Propriedades pendentes</p>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{metrics.properties.pending || 0}</p>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Top vendedores</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Os maiores geradores de vendas.</p>
            </div>
          </div>

          {metrics.sales.topSellers?.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
              {metrics.sales.topSellers.map((seller) => (
                <li key={seller.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 14, border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{seller.name || seller.email}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{seller.email}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>{fmt(Number(seller.revenue) || 0)}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{seller.soldProperties || 0} vendas</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--muted)' }}>Sem dados de vendas ainda.</p>
          )}
        </section>
      </div>
    </div>
  );
}
