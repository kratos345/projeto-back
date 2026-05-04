import { useState, useEffect } from 'react';
import { getMyLeads, updateLeadStatus } from '../../api/leads';
import '../../styles/leads.css';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const response = await getMyLeads();
      setLeads(response.data);
    } catch (err) {
      setError('Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, { status: newStatus });
      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'novo': return '#e74c3c';
      case 'contato_feito': return '#f39c12';
      case 'visita_marcada': return '#3498db';
      case 'proposta': return '#9b59b6';
      case 'fechado': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'contato_feito': return 'Contato Feito';
      case 'visita_marcada': return 'Visita Marcada';
      case 'proposta': return 'Proposta';
      case 'fechado': return 'Fechado';
      default: return status;
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filter === 'todos') return true;
    return lead.status === filter;
  });

  if (loading) return <div className="page"><p>Carregando leads...</p></div>;
  if (error) return <div className="page"><p className="error">{error}</p></div>;

  return (
    <div className="page">
      <header className="top-bar">
        <h2>Meus Leads</h2>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos os Status</option>
            <option value="novo">Novos</option>
            <option value="contato_feito">Contato Feito</option>
            <option value="visita_marcada">Visita Marcada</option>
            <option value="proposta">Proposta</option>
            <option value="fechado">Fechados</option>
          </select>
        </div>
      </header>

      <main>
        {filteredLeads.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum lead encontrado</h3>
            <p>{filter === 'todos' ? 'Você ainda não tem leads.' : `Nenhum lead com status "${getStatusText(filter)}".`}</p>
          </div>
        ) : (
          <div className="leads-list">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="lead-card">
                <div className="lead-header">
                  <div className="lead-info">
                    <h3>{lead.name}</h3>
                    <p className="lead-contact">
                      📧 {lead.email} {lead.phone && `| 📱 ${lead.phone}`}
                    </p>
                  </div>
                  <div className="lead-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(lead.status) }}
                    >
                      {getStatusText(lead.status)}
                    </span>
                  </div>
                </div>

                <div className="lead-property">
                  <h4>Imóvel de Interesse:</h4>
                  <p><strong>{lead.Property?.title}</strong></p>
                  <p>{lead.Property?.address}, {lead.Property?.city}</p>
                  <p>R$ {parseFloat(lead.Property?.price || 0).toLocaleString('pt-BR')}</p>
                </div>

                {lead.notes && (
                  <div className="lead-notes">
                    <h4>Notas:</h4>
                    <p>{lead.notes}</p>
                  </div>
                )}

                <div className="lead-actions">
                  <label>Status:</label>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="novo">Novo</option>
                    <option value="contato_feito">Contato Feito</option>
                    <option value="visita_marcada">Visita Marcada</option>
                    <option value="proposta">Proposta</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </div>

                <div className="lead-date">
                  <small>Criado em: {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
