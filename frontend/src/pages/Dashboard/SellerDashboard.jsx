import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSellerMetrics } from '../../api/dashboard';
import '../../styles/dashboard.css';

export default function SellerDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await getSellerMetrics();
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
        <h1>📈 Meu Dashboard</h1>
        <div>
          <button onClick={() => navigate('/properties/new')}>➕ Novo Imóvel</button>
          <button onClick={() => navigate('/properties/my')}>📋 Meus Imóveis</button>
        </div>
      </header>

      <main>
        {/* SEÇÃO DE IMÓVEIS */}
        <section className="metrics-section">
          <h2>🏠 Meus Imóveis</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{metrics.properties.total}</div>
              <div className="metric-label">Total</div>
            </div>
            <div className="metric-card highlight">
              <div className="metric-value" style={{ color: '#27ae60' }}>{metrics.properties.active}</div>
              <div className="metric-label">Ativos</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: '#3498db' }}>{metrics.properties.sold}</div>
              <div className="metric-label">Vendidos</div>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE LEADS */}
        <section className="metrics-section">
          <h2>💬 Meus Leads</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{metrics.leads.total}</div>
              <div className="metric-label">Total de Leads</div>
            </div>
            {metrics.leads.perStatus && metrics.leads.perStatus.map((status) => (
              <div className="metric-card" key={status.status}>
                <div className="metric-value">{status.count}</div>
                <div className="metric-label">{status.status.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO DE ESTATÍSTICAS */}
        <section className="metrics-section">
          <h2>📊 Estatísticas</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{metrics.stats.totalViews}</div>
              <div className="metric-label">Visualizações Totais</div>
            </div>
          </div>
        </section>

        {/* AÇÕES RÁPIDAS */}
        <section className="actions-section">
          <h2>⚡ Ações Rápidas</h2>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/sales')}>
              💰 Área de Vendas
            </button>
            <button className="action-btn" onClick={() => navigate('/properties/new')}>
              ➕ Criar Imóvel
            </button>
            <button className="action-btn" onClick={() => navigate('/properties/my')}>
              📋 Gerenciar Imóveis
            </button>
            <button className="action-btn" onClick={() => navigate('/leads')}>
              💬 Ver Meus Leads
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
