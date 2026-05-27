import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProperties, approveProperty, rejectProperty } from '../../api/properties';
import '../../styles/admin.css';
import { getRequests } from '../../api/requests';

export default function AdminPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [filter, setFilter] = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
    loadRequests();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await getAllProperties({ status: 'all' });
      setProperties(response.data);
    } catch (err) {
      setError('Erro ao carregar propriedades');
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    setReqLoading(true);
    try {
      const res = await getRequests();
      setRequests(res.data || []);
    } catch (err) {
      // falha silenciosa: não bloquear admin
    } finally {
      setReqLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Deseja aprovar este anúncio?')) return;
    try {
      await approveProperty(id);
      setProperties(properties.map(p => p.id === id ? { ...p, status: 'ativo' } : p));
      alert('✅ Anúncio aprovado');
    } catch (err) {
      alert('❌ Erro ao aprovar');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Deseja rejeitar este anúncio?')) return;
    try {
      await rejectProperty(id);
      setProperties(properties.filter(p => p.id !== id));
      alert('✅ Anúncio rejeitado');
    } catch (err) {
      alert('❌ Erro ao rejeitar');
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filter === 'todos') return true;
    if (filter === 'pendente') return p.status === 'pendente';
    if (filter === 'ativo') return p.status === 'ativo';
    return p.status === 'vendido';
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return '#f39c12';
      case 'ativo': return '#27ae60';
      case 'vendido': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      maximumFractionDigits: 0 
    }).format(value || 0);
  };

  if (loading) return <div className="page"><p>Carregando propriedades...</p></div>;
  if (error) return <div className="page"><p className="error">{error}</p></div>;

  return (
    <div className="page">
      <header className="admin-top-bar">
        <div>
          <h2>🔧 Painel de Admin</h2>
          <p>Gerencie todos os anúncios do sistema</p>
        </div>
        <button
          type="button"
          style={{
            background: 'white',
            color: '#4f46e5',
            border: '1px solid rgba(79,70,229,.25)',
            padding: '0.75rem 1rem',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/users')}
        >
          👥 Gerenciar Usuários
        </button>
        <button
          type="button"
          style={{
            marginLeft: 8,
            background: 'white',
            color: '#b7791f',
            border: '1px solid rgba(183,121,31,.15)',
            padding: '0.75rem 1rem',
            borderRadius: 6,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
          onClick={() => navigate('/admin/requests')}
        >
          📨 Solicitações
          {requests && requests.filter(r => r.status === 'pending').length > 0 && (
            <span style={{ background: '#b45309', color: 'white', borderRadius: 999, padding: '2px 8px', fontSize: 12 }}>{requests.filter(r => r.status === 'pending').length}</span>
          )}
        </button>
      </header>

      <main className="admin-content">
        {/* Resumo de solicitações de conta */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'stretch' }}>
          <div style={{ flex: '0 0 320px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>📨 Solicitações de conta</h3>
            <p style={{ margin: '6px 0 12px', color: '#6b7280' }}>{reqLoading ? 'Carregando...' : `${requests.length} total`}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 140, overflow: 'auto' }}>
              {requests.slice(0,5).map(r => (
                <div key={r.id} style={{ padding: 8, borderRadius: 8, background: 'transparent', border: '1px solid rgba(0,0,0,.04)' }}>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{r.cpfCnpj}</div>
                </div>
              ))}
              {requests.length === 0 && !reqLoading && <div style={{ color: '#6b7280' }}>Nenhuma solicitação recente</div>}
            </div>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button onClick={() => navigate('/admin/requests')} style={{ background: 'transparent', border: 0, color: 'var(--gold)', cursor: 'pointer' }}>Ver todas →</button>
            </div>
          </div>
        </div>
        {/* Filtros */}
        <div className="admin-filters">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos ({properties.length})</option>
              <option value="pendente">
                Pendentes ({properties.filter(p => p.status === 'pendente').length})
              </option>
              <option value="ativo">
                Ativos ({properties.filter(p => p.status === 'ativo').length})
              </option>
              <option value="vendido">
                Vendidos ({properties.filter(p => p.status === 'vendido').length})
              </option>
            </select>
          </div>
        </div>

        {/* Lista de Propriedades */}
        {filteredProperties.length === 0 ? (
          <div className="empty-state card">
            <h3>Nenhuma propriedade encontrada</h3>
            <p>Não há propriedades com o status selecionado.</p>
          </div>
        ) : (
          <div className="admin-properties-grid">
            {filteredProperties.map((property) => (
              <div key={property.id} className="property-card-admin">
                <div className="property-image">
                  {property.images?.[0]?.url ? (
                    <img src={property.images[0].url} alt={property.title} />
                  ) : (
                    <div className="no-image">Sem imagem</div>
                  )}
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(property.status) }}
                  >
                    {property.status.toUpperCase()}
                  </span>
                </div>

                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p className="property-type">
                    📍 {property.type} • {property.bedrooms}Q • {property.bathrooms}B
                  </p>
                  <p className="property-location">
                    {property.street}, {property.city} - {property.state}
                  </p>

                  <div className="property-details">
                    <div className="detail">
                      <span className="label">Preço:</span>
                      <span className="value">{formatPrice(property.price)}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Área:</span>
                      <span className="value">{property.area} m²</span>
                    </div>
                    <div className="detail">
                      <span className="label">Vendedor:</span>
                      <span className="value">{property.seller?.name}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Email:</span>
                      <span className="value">{property.seller?.email}</span>
                    </div>
                  </div>

                  {property.description && (
                    <p className="property-description">{property.description}</p>
                  )}

                  <div className="property-actions">
                    {property.status === 'pendente' ? (
                      <>
                        <button 
                          className="btn-approve"
                          onClick={() => handleApprove(property.id)}
                        >
                          ✅ Aprovar
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => handleReject(property.id)}
                        >
                          ❌ Rejeitar
                        </button>
                      </>
                    ) : (
                      <button 
                        className="btn-view"
                        onClick={() => navigate(`/properties/${property.id}`)}
                      >
                        👁️ Ver Detalhes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
