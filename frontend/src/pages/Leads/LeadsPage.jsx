import { useState, useEffect } from 'react';
import { getMyLeads, updateLeadStatus, closeLead } from '../../api/leads';
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

  const handleCloseLead = async (leadId, reason) => {
    if (!window.confirm(`Tem certeza que quer marcar como ${reason}?`)) return;
    try {
      await closeLead(leadId, reason);
      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, status: reason } : lead
      ));
    } catch (err) {
      alert('Erro ao encerrar lead');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'novo': return '#e74c3c';
      case 'contatado': return '#f39c12';
      case 'visita_agendada': return '#3498db';
      case 'proposta_enviada': return '#9b59b6';
      case 'negociando': return '#2980b9';
      case 'fechado': return '#27ae60';
      case 'perdido': return '#7f8c8d';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'contatado': return 'Contatado';
      case 'visita_agendada': return 'Visita Agendada';
      case 'proposta_enviada': return 'Proposta Enviada';
      case 'negociando': return 'Negociando';
      case 'fechado': return 'Fechado';
      case 'perdido': return 'Perdido';
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
            <option value="contatado">Contatados</option>
            <option value="visita_agendada">Visita Agendada</option>
            <option value="proposta_enviada">Proposta Enviada</option>
            <option value="negociando">Negociando</option>
            <option value="fechado">Fechados</option>
            <option value="perdido">Perdidos</option>
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
                    <option value="contatado">Contatado</option>
                    <option value="visita_agendada">Visita Agendada</option>
                    <option value="proposta_enviada">Proposta Enviada</option>
                    <option value="negociando">Negociando</option>
                    <option value="fechado">Fechado</option>
                    <option value="perdido">Perdido</option>
                  </select>
                  {lead.status !== 'fechado' && lead.status !== 'perdido' && (
                    <div className="lead-quick-actions">
                      <button 
                        className="btn-success"
                        onClick={() => handleCloseLead(lead.id, 'fechado')}
                      >
                        ✅ Fechar Venda
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleCloseLead(lead.id, 'perdido')}
                      >
                        ❌ Perder Lead
                      </button>
                    </div>
                  )}
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
