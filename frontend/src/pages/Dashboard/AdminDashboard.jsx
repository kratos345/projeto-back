import { useState, useEffect } from 'react';
import { getAdminMetrics } from '../../api/dashboard';
import '../../styles/dashboard.css';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await getAdminMetrics();
      setMetrics(response.data);
    } catch (err) {
      setError('Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page"><p>Carregando...</p></div>;
  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (!metrics) return <div className="page"><p>Sem dados</p></div>;

  return (
    <div className="page dashboard">
      <header className="top-bar">
        <h1>⚙️ Painel Administrativo</h1>
        <div>
          <button onClick={() => navigate('/users')}>👥 Gerenciar Usuários</button>
        </div>
      </header>

      <main>
        {/* SEÇÃO DE IMÓVEIS */}
        <section className="metrics-section">
          <h2>🏠 Imóveis</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{metrics.properties.total}</div>
              <div className="metric-label">Total de Imóveis</div>
            </div>
            <div className="metric-card highlight">
              <div className="metric-value" style={{ color: '#27ae60' }}>{metrics.properties.active}</div>
              <div className="metric-label">Ativos</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: '#3498db' }}>{metrics.properties.sold}</div>
              <div className="metric-label">Vendidos</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: '#f39c12' }}>{metrics.properties.pending}</div>
              <div className="metric-label">Pendentes</div>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE USUÁRIOS */}
        <section className="metrics-section">
          <h2>👥 Usuários</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{metrics.users.sellers}</div>
              <div className="metric-label">Vendedores</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{metrics.users.buyers}</div>
              <div className="metric-label">Compradores</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{metrics.users.admins}</div>
              <div className="metric-label">Administradores</div>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE LEADS */}
        <section className="metrics-section">
          <h2>💬 Gestão de Leads</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{metrics.leads.total}</div>
              <div className="metric-label">Total de Leads</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: '#e74c3c' }}>{metrics.leads.new}</div>
              <div className="metric-label">Novos Hoje</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: '#f39c12' }}>{metrics.leads.inProgress}</div>
              <div className="metric-label">Em Andamento</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: '#27ae60' }}>{metrics.leads.closed}</div>
              <div className="metric-label">Convertidos</div>
            </div>
          </div>
        </section>

        {/* AÇÕES ADMINISTRATIVAS */}
        <section className="actions-section">
          <h2>⚡ Ações Administrativas</h2>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/users')}>
              👥 Gerenciar Usuários
            </button>
            <button className="action-btn" onClick={() => navigate('/properties/pending')}>
              📋 Aprovar Imóveis
            </button>
            <button className="action-btn" onClick={() => navigate('/reports')}>
              📊 Relatórios
            </button>
            <button className="action-btn" onClick={() => navigate('/settings')}>
              ⚙️ Configurações
            </button>
          </div>
        </section>

        {/* TOP IMÓVEIS */}
        <section className="list-section">
          <h2>🔝 Imóveis Mais Visualizados</h2>
          {metrics.topProperties.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Visualizações</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topProperties.map((prop) => (
                  <tr key={prop.id}>
                    <td>{prop.id}</td>
                    <td>{prop.title}</td>
                    <td>R$ {parseFloat(prop.price).toLocaleString('pt-BR')}</td>
                    <td>{prop.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhum imóvel ainda</p>
          )}
        </section>
      </main>
    </div>
  );
}
