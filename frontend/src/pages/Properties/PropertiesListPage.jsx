import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProperties, deleteProperty } from '../../api/properties';
import '../../styles/properties.css';
import PrimeVendaTheme from '../../components/PrimeVendaTheme';

export default function PropertiesListPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await getMyProperties();
      setProperties(response.data);
    } catch (err) {
      setError('Não foi possível carregar seus imóveis. Atualize a página e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este imóvel?')) return;

    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Não foi possível deletar este imóvel. Tente novamente.');
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'disponivel': return 'badge badge-green';
      case 'ativo': return 'badge badge-green';
      case 'pendente': return 'badge badge-muted';
      case 'negociando': return 'badge badge-gold';
      case 'vendido': return 'badge badge-red';
      case 'arquivado': return 'badge badge-muted';
      default: return 'badge badge-muted';
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value || 0);
  };

  if (loading) return <div className="page"><p>Carregando imóveis...</p></div>;
  if (error) return <div className="page"><p className="error">{error}</p></div>;

  return (
    <>
      <PrimeVendaTheme />
      <div className="page">
        <header className="top-bar">
          <h2>Meus Imóveis</h2>
          <button onClick={() => navigate('/properties/new')} className="btn-gold">
            ➕ Novo Imóvel
          </button>
        </header>

        <main className="dashboard-content">
          {properties.length === 0 ? (
            <div className="empty-state card">
              <h3>Você ainda não tem imóveis cadastrados</h3>
              <p>Comece criando seu primeiro anúncio!</p>
              <button onClick={() => navigate('/properties/new')} className="btn-gold">
                Criar Primeiro Imóvel
              </button>
            </div>
          ) : (
            <div className="card">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Preço</th>
                    <th>Cidade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id}>
                      <td>{property.title}</td>
                      <td>{property.type}</td>
                      <td>{formatPrice(property.price)}</td>
                      <td>{property.city}</td>
                      <td><span className={getBadgeClass(property.status)}>{property.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button onClick={() => navigate(`/properties/edit/${property.id}`)} className="btn-ghost">
                            Editar
                          </button>
                          <button onClick={() => handleDelete(property.id)} className="btn-ghost" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
