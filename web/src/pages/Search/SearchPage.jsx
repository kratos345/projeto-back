import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProperties } from '../../api/properties';
import { addFavorite } from '../../api/favorites';
import { createLead } from '../../api/leads';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/search.css';

const initialFilters = {
  city: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: ''
};

export default function SearchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState(null);
  const [interestLoadingId, setInterestLoadingId] = useState(null);

  useEffect(() => {
    loadProperties();
  }, [filters.city, filters.type, filters.minPrice, filters.maxPrice, filters.bedrooms]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllProperties({
        status: 'ativo',
        city: filters.city,
        type: filters.type,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        bedrooms: filters.bedrooms
      });
      setProperties(response.data || []);
    } catch (err) {
      setError('Erro ao carregar imóveis');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm.trim());
  };

  const filteredProperties = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return properties.filter((property) => {
      if (!query) return true;
      return [property.title, property.description, property.city, property.state, property.type, property.neighborhood, property.address]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query));
    });
  }, [properties, searchQuery]);

  const handleFavorite = async (propertyId) => {
    if (!user) {
      setError('Faça login para favoritar imóveis.');
      return;
    }

    try {
      setError('');
      setSuccessMessage('');
      setFavoriteLoadingId(propertyId);
      await addFavorite(propertyId);
      setSuccessMessage('Imóvel adicionado aos seus favoritos.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao favoritar imóvel.');
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  const handleInterest = async (propertyId) => {
    if (!user) {
      setError('Faça login para manifestar interesse.');
      return;
    }

    try {
      setError('');
      setSuccessMessage('');
      setInterestLoadingId(propertyId);
      await createLead({ propertyId });
      setSuccessMessage('Interesse registrado com sucesso! O vendedor receberá sua solicitação.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar interesse.');
    } finally {
      setInterestLoadingId(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchTerm('');
    setSearchQuery('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="page">
      <header className="top-bar">
        <h2>🔍 Explorar anúncios</h2>
        <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>
          Exibindo todos os anúncios de imóveis publicados pelos vendedores.
        </p>
      </header>

      <main>
        {/* Filtros */}
        <section className="search-filters">
          <h3>🏠 Filtros de Busca</h3>
          <div className="filters-form">
            <form onSubmit={handleSearchSubmit} className="filter-row" style={{ gap: 12, alignItems: 'flex-end' }}>
              <div className="filter-group" style={{ flex: 1 }}>
                <label>Buscar</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Título, cidade, bairro ou tipo"
                  className="filter-input"
                />
              </div>
              <button className="btn-gold" type="submit" style={{ height: 42 }}>Pesquisar</button>
            </form>

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
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Galpão">Galpão</option>
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
                <button type="button" onClick={clearFilters} className="btn-clear">
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
              {filteredProperties.length} imóvel{filteredProperties.length !== 1 ? 'is' : ''} encontrado{filteredProperties.length !== 1 ? 's' : ''}
            </span>
          </div>

          {successMessage && (
            <div className="success-state">
              <p>✅ {successMessage}</p>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <p>🔄 Carregando imóveis...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>❌ {error}</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="empty-state">
              <h4>🏠 Nenhum imóvel encontrado</h4>
              <p>Tente ajustar os filtros ou a pesquisa</p>
            </div>
          ) : (
            <div className="properties-grid">
              {filteredProperties.map((property) => {
                const imageUrl = property.image || property.images?.find((img) => img?.isFeatured)?.url || property.images?.[0]?.url || property.seller?.profileImage;
                return (
                  <div key={property.id} className="property-card">
                    <div className="property-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={property.title}
                        />
                      ) : (
                        <span>🏠</span>
                      )}
                    </div>

                    <div className="property-content">
                      <h4 className="property-title">{property.title}</h4>

                      <div className="property-seller">
                        Por: {property.seller?.name || 'Anônimo'}
                      </div>

                      <div className="property-price">
                        R$ {parseFloat(property.price).toLocaleString('pt-BR')}
                      </div>

                      <div className="property-details">
                        <span>📍 {property.address || property.location || [property.city, property.state].filter(Boolean).join(', ')}</span>
                        {property.bedrooms && <span>🛏️ {property.bedrooms} quartos</span>}
                        {property.bathrooms && <span>🚿 {property.bathrooms} banheiros</span>}
                        {property.area && <span>📐 {property.area}m²</span>}
                      </div>

                      <div className="property-type">
                        {property.type?.toString().toLowerCase() === 'apartamento' && '🏢 Apartamento'}
                        {property.type?.toString().toLowerCase() === 'casa' && '🏠 Casa'}
                        {property.type?.toString().toLowerCase() === 'terreno' && '🌳 Terreno'}
                        {property.type?.toString().toLowerCase() === 'comercial' && '🏬 Comercial'}
                        {property.type?.toString().toLowerCase() === 'cobertura' && '🏘️ Cobertura'}
                        {property.type?.toString().toLowerCase() === 'galpão' && '🏭 Galpão'}
                      </div>

                      <div className="property-description">
                        {property.description
                          ? property.description.length > 100
                            ? `${property.description.substring(0, 100)}...`
                            : property.description
                          : 'Descrição não informada.'
                        }
                      </div>

                      <div className="property-actions">
                        <button className="btn-interest" onClick={() => handleInterest(property.id)} disabled={interestLoadingId === property.id}>
                          {interestLoadingId === property.id ? 'Processando...' : '💬 Tenho Interesse'}
                        </button>
                        <button className="btn-secondary" onClick={() => navigate(`/properties/${property.id}`)}>
                          🔎 Ver Detalhes
                        </button>
                        <button className="btn-favorite" onClick={() => handleFavorite(property.id)} disabled={favoriteLoadingId === property.id}>
                          {favoriteLoadingId === property.id ? 'Salvando...' : '❤️ Favoritar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
