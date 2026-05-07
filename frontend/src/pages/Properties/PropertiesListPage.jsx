import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProperties, deleteProperty } from '../../api/properties';
import '../../styles/properties.css';

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
      setError('Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este imóvel?')) return;

    try {
      await deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      alert('Erro ao deletar imóvel');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponivel': return '#27ae60';
      case 'ativo': return '#27ae60';
      case 'pendente': return '#f39c12';
      case 'negociando': return '#f39c12';
      case 'vendido': return '#3498db';
      case 'arquivado': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  if (loading) return <div className="page"><p>Carregando imóveis...</p></div>;
  if (error) return <div className="page"><p className="error">{error}</p></div>;

  return (
    <div className="page">
      <header className="top-bar">
        <h2>Meus Imóveis</h2>
        <button onClick={() => navigate('/properties/new')} className="btn-primary">
          ➕ Novo Imóvel
        </button>
      </header>

      <main>
        {properties.length === 0 ? (
          <div className="empty-state">
            <h3>Você ainda não tem imóveis cadastrados</h3>
            <p>Comece criando seu primeiro anúncio!</p>
            <button onClick={() => navigate('/properties/new')} className="btn-primary">
              Criar Primeiro Imóvel
            </button>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-header">
                  <h3>{property.title}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(property.status) }}
                  >
                    {property.status}
                  </span>
                </div>

                <div className="property-details">
                  <p><strong>Preço:</strong> R$ {parseFloat(property.price).toLocaleString('pt-BR')}</p>
                  <p><strong>Tipo:</strong> {property.type}</p>
                  <p><strong>Cidade:</strong> {property.city}</p>
                  <p><strong>Quartos:</strong> {property.bedrooms} | <strong>Banheiros:</strong> {property.bathrooms}</p>
                  <p><strong>Área:</strong> {property.area} m²</p>
                  <p><strong>Visualizações:</strong> {property.views}</p>
                </div>

                <div className="property-actions">
                  <button
                    onClick={() => navigate(`/properties/edit/${property.id}`)}
                    className="btn-secondary"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="btn-danger"
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
