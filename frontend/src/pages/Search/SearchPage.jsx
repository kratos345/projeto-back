import { useState, useEffect } from 'react';
import { getProperties } from '../../api/properties';
import '../../styles/search.css';

export default function SearchPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getProperties({
        ...filters,
        status: 'approved' // Só mostrar imóveis aprovados
      });
      setProperties(response.data);
    } catch (err) {
      setError('Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: ''
    });
  };

  return (
    <div className="page">
      <header className="top-bar">
        <h2>🔍 Buscar Imóveis</h2>
      </header>

      <main>
        {/* Filtros */}
        <section className="search-filters">
          <h3>🏠 Filtros de Busca</h3>
          <div className="filters-form">
            <div className="filter-row">
              <div className="filter-group">
                <label>Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Ex: São Paulo"
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Tipo</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="filter-input"
                >
                  <option value="">Todos os tipos</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Quartos</label>
                <select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  className="filter-input"
                >
                  <option value="">Qualquer</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Preço Mínimo</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="R$ 0"
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Preço Máximo</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="R$ 0"
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>&nbsp;</label>
                <button onClick={clearFilters} className="btn-clear">
                  🗑️ Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Resultados */}
        <section className="search-results">
          <div className="results-header">
            <h3>🏡 Imóveis Disponíveis</h3>
            <span className="results-count">
              {properties.length} imóvel{properties.length !== 1 ? 'is' : ''} encontrado{properties.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>🔄 Carregando imóveis...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>❌ {error}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <h4>🏠 Nenhum imóvel encontrado</h4>
              <p>Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <div key={property.id} className="property-card">
                  <div className="property-image">
                    <span>🏠</span>
                  </div>

                  <div className="property-content">
                    <h4 className="property-title">{property.title}</h4>

                    <div className="property-price">
                      R$ {parseFloat(property.price).toLocaleString('pt-BR')}
                    </div>

                    <div className="property-details">
                      <span>🏙️ {property.city}, {property.state}</span>
                      {property.bedrooms && <span>🛏️ {property.bedrooms} quartos</span>}
                      {property.bathrooms && <span>🚿 {property.bathrooms} banheiros</span>}
                      {property.area && <span>📐 {property.area}m²</span>}
                    </div>

                    <div className="property-type">
                      {property.type === 'apartamento' && '🏢 Apartamento'}
                      {property.type === 'casa' && '🏠 Casa'}
                      {property.type === 'terreno' && '🌳 Terreno'}
                      {property.type === 'comercial' && '🏬 Comercial'}
                    </div>

                    <div className="property-description">
                      {property.description && property.description.length > 100
                        ? `${property.description.substring(0, 100)}...`
                        : property.description
                      }
                    </div>

                    <div className="property-actions">
                      <button className="btn-interest">
                        💬 Tenho Interesse
                      </button>
                      <button className="btn-favorite">
                        ❤️ Favoritar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
