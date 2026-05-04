import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProperties } from '../../api/properties';
import { getMyLeads } from '../../api/leads';
import '../../styles/sales.css';

export default function SalesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [propertiesRes, leadsRes] = await Promise.all([
        getMyProperties(),
        getMyLeads()
      ]);
      setProperties(propertiesRes.data);
      setLeads(leadsRes.data);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const getSalesStats = () => {
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'approved').length;
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'novo').length;
    const closedDeals = leads.filter(l => l.status === 'fechado').length;

    return { totalProperties, activeProperties, totalLeads, newLeads, closedDeals };
  };

  const getRecentLeads = () => {
    return leads
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const getTopProperties = () => {
    return properties
      .filter(p => p.status === 'approved')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  };

  if (loading) return <div className="page"><p>Carregando dados de vendas...</p></div>;
  if (error) return <div className="page"><p className="error">{error}</p></div>;

  const stats = getSalesStats();
  const recentLeads = getRecentLeads();
  const topProperties = getTopProperties();

  return (
    <div className="page">
      <header className="top-bar">
        <h2>💰 Área de Vendas</h2>
        <div className="tab-buttons">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            📊 Visão Geral
          </button>
          <button
            className={activeTab === 'properties' ? 'active' : ''}
            onClick={() => setActiveTab('properties')}
          >
            🏠 Meus Imóveis
          </button>
          <button
            className={activeTab === 'leads' ? 'active' : ''}
            onClick={() => setActiveTab('leads')}
          >
            💬 Meus Leads
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'overview' && (
          <div className="sales-overview">
            {/* Métricas de Vendas */}
            <section className="sales-metrics">
              <h3>📈 Métricas de Performance</h3>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">🏠</div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.totalProperties}</div>
                    <div className="metric-label">Total de Imóveis</div>
                  </div>
                </div>
                <div className="metric-card highlight">
                  <div className="metric-icon">✅</div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.activeProperties}</div>
                    <div className="metric-label">Imóveis Ativos</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">💬</div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.totalLeads}</div>
                    <div className="metric-label">Total de Leads</div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">🆕</div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.newLeads}</div>
                    <div className="metric-label">Leads Novos</div>
                  </div>
                </div>
                <div className="metric-card success">
                  <div className="metric-icon">🎯</div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.closedDeals}</div>
                    <div className="metric-label">Vendas Fechadas</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Leads Recentes */}
            <section className="recent-activity">
              <h3>🔔 Leads Recentes</h3>
              <div className="activity-list">
                {recentLeads.length === 0 ? (
                  <p className="empty-state">Nenhum lead recente</p>
                ) : (
                  recentLeads.map((lead) => (
                    <div key={lead.id} className="activity-item">
                      <div className="activity-icon">👤</div>
                      <div className="activity-content">
                        <div className="activity-title">{lead.name}</div>
                        <div className="activity-subtitle">
                          Interesse em: {lead.Property?.title || 'Imóvel'}
                        </div>
                        <div className="activity-time">
                          {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="activity-status">
                        <span className={`status-${lead.status}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Imóveis Mais Visualizados */}
            <section className="top-properties">
              <h3>🔥 Imóveis em Destaque</h3>
              <div className="properties-list">
                {topProperties.length === 0 ? (
                  <p className="empty-state">Nenhum imóvel ativo</p>
                ) : (
                  topProperties.map((property) => (
                    <div key={property.id} className="property-item">
                      <div className="property-info">
                        <div className="property-title">{property.title}</div>
                        <div className="property-price">
                          R$ {parseFloat(property.price).toLocaleString('pt-BR')}
                        </div>
                        <div className="property-location">
                          {property.city}, {property.state}
                        </div>
                      </div>
                      <div className="property-stats">
                        <div className="stat">
                          <span className="stat-icon">👁️</span>
                          <span>{property.views || 0} visualizações</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="sales-properties">
            <div className="section-header">
              <h3>🏠 Gerenciar Imóveis</h3>
              <button
                className="btn-primary"
                onClick={() => navigate('/properties/new')}
              >
                ➕ Novo Imóvel
              </button>
            </div>

            <div className="properties-grid">
              {properties.length === 0 ? (
                <div className="empty-state">
                  <h4>Nenhum imóvel cadastrado</h4>
                  <p>Comece criando seu primeiro anúncio imobiliário</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/properties/new')}
                  >
                    Criar Primeiro Imóvel
                  </button>
                </div>
              ) : (
                properties.map((property) => (
                  <div key={property.id} className="property-card">
                    <div className="property-header">
                      <h4>{property.title}</h4>
                      <span className={`status-${property.status}`}>
                        {property.status === 'approved' ? 'Aprovado' :
                         property.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                      </span>
                    </div>
                    <div className="property-details">
                      <p><strong>Preço:</strong> R$ {parseFloat(property.price).toLocaleString('pt-BR')}</p>
                      <p><strong>Local:</strong> {property.city}, {property.state}</p>
                      <p><strong>Tipo:</strong> {property.type}</p>
                    </div>
                    <div className="property-actions">
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/properties/edit/${property.id}`)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/properties/my`)}
                      >
                        👁️ Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="sales-leads">
            <div className="section-header">
              <h3>💬 Gerenciar Leads</h3>
              <button
                className="btn-secondary"
                onClick={() => navigate('/leads')}
              >
                📋 Ver Todos os Leads
              </button>
            </div>

            <div className="leads-summary">
              <div className="leads-stats">
                <div className="stat-item">
                  <span className="stat-number">{stats.totalLeads}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.newLeads}</span>
                  <span className="stat-label">Novos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.closedDeals}</span>
                  <span className="stat-label">Fechados</span>
                </div>
              </div>

              <div className="recent-leads">
                {recentLeads.length === 0 ? (
                  <p className="empty-state">Nenhum lead encontrado</p>
                ) : (
                  recentLeads.map((lead) => (
                    <div key={lead.id} className="lead-item">
                      <div className="lead-info">
                        <div className="lead-name">{lead.name}</div>
                        <div className="lead-contact">
                          📧 {lead.email} {lead.phone && `| 📱 ${lead.phone}`}
                        </div>
                        <div className="lead-property">
                          Interesse: {lead.Property?.title || 'Imóvel'}
                        </div>
                      </div>
                      <div className="lead-status">
                        <span className={`status-${lead.status}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
