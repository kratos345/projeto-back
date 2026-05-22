import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties } from '../../../api/properties';
import { addFavorite } from '../../../api/favorites';
import { createLead } from '../../../api/leads';
import { ListingModal, ListingCard, fmt, StatusBadge, getPropertyImage } from './DashboardHelpers';

const emptyFilters = {
  type: '',
  city: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: ''
};

export default function UsuarioDashboard({ user }) {
  const [selected, setSelected] = useState(null);
  const [propertiesList, setPropertiesList] = useState([]);
  const [propsLoading, setPropsLoading] = useState(false);
  const [propsError, setPropsError] = useState('');
  const [filters, setFilters] = useState(emptyFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [favoriteLoadingId, setFavoriteLoadingId] = useState(null);
  const [interestLoadingId, setInterestLoadingId] = useState(null);
  const navigate = useNavigate();

  const loadProperties = async () => {
    setPropsLoading(true);
    setPropsError('');

    try {
      const payload = {
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.city ? { city: filters.city } : {}),
        ...(filters.minPrice ? { minPrice: filters.minPrice } : {}),
        ...(filters.maxPrice ? { maxPrice: filters.maxPrice } : {}),
        ...(filters.bedrooms ? { bedrooms: filters.bedrooms } : {})
      };

      const res = await getProperties(payload);
      setPropertiesList(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar propriedades:', err);
      setPropsError(err.response?.data?.message || 'Erro ao carregar anúncios');
    } finally {
      setPropsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (!mounted) return;
    loadProperties();

    return () => { mounted = false; };
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm.trim());
  };

  const handleClear = () => {
    setFilters(emptyFilters);
    setSearchTerm('');
    setSearchQuery('');
    setActionError('');
    setActionMessage('');
  };

  const visibleProperties = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return propertiesList.filter((item) => {
      if (!query) return true;
      return [item.title, item.description, item.city, item.state, item.type, item.street, item.neighborhood]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(query));
    });
  }, [propertiesList, searchQuery]);

  const sortedVisibleProperties = useMemo(() => {
    return [...visibleProperties].sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
  }, [visibleProperties]);

  const featuredProperties = useMemo(() => {
    const featured = sortedVisibleProperties.filter((item) => item.featured);
    return featured.length ? featured.slice(0, 6) : sortedVisibleProperties.slice(0, 6);
  }, [sortedVisibleProperties]);

  const allProperties = useMemo(() => sortedVisibleProperties, [sortedVisibleProperties]);

  const handleFavorite = async (propertyId) => {
    if (!user) {
      setActionError('Faça login para favoritar imóveis.');
      return;
    }

    try {
      setActionError('');
      setActionMessage('');
      setFavoriteLoadingId(propertyId);
      await addFavorite(propertyId);
      setActionMessage('Imóvel adicionado aos favoritos.');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Erro ao favoritar imóvel.');
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  const handleInterest = async (propertyId) => {
    if (!user) {
      setActionError('Faça login para manifestar interesse.');
      return;
    }

    try {
      setActionError('');
      setActionMessage('');
      setInterestLoadingId(propertyId);
      await createLead({ propertyId });
      setActionMessage('Interesse registrado com sucesso! O vendedor receberá sua solicitação.');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Erro ao registrar interesse.');
    } finally {
      setInterestLoadingId(null);
    }
  };

  return (
    <div className="fade-up">
      {selected && (
        <ListingModal
          item={selected}
          onClose={() => setSelected(null)}
          onFavorite={handleFavorite}
          onInterest={handleInterest}
        />
      )}

      <div style={{ marginBottom: 32 }}>
        <h2 className="playfair" style={{ fontSize: 24, marginBottom: 8 }}>Olá, {user?.name || 'Usuário'}!</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Explore anúncios ativos, favorite seus preferidos e manifeste interesse em comprar.</p>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <input
            className="inp"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar por título, cidade, bairro ou tipo"
            style={{ flex: 1, minWidth: 220 }}
          />
          <select name="type" value={filters.type} onChange={handleFilterChange} className="inp" style={{ width: 170 }}>
            <option value="">Todos os tipos</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Terreno">Terreno</option>
            <option value="Cobertura">Cobertura</option>
            <option value="Comercial">Comercial</option>
            <option value="Galpão">Galpão</option>
          </select>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="inp"
            placeholder="Cidade"
            style={{ width: 180 }}
          />
          <button type="submit" className="btn-gold" style={{ whiteSpace: 'nowrap' }}>Buscar</button>
          <button type="button" className="btn-secondary" onClick={handleClear}>Limpar</button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12, marginTop: 16 }}>
          <div className="dashboard-filter-pill">Preço mínimo</div>
        </div>
      </div>

      {(actionMessage || actionError) && (
        <div style={{ marginBottom: 24 }}>
          {actionMessage && <div className="alert alert-success">{actionMessage}</div>}
          {actionError && <div className="alert alert-error">{actionError}</div>}
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Anúncios em Destaque</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px,1fr))', gap: 20 }}>
          {propsLoading && <p>Carregando anúncios...</p>}
          {propsError && <p style={{ color: 'var(--red)' }}>{propsError}</p>}
          {!propsLoading && !propsError && featuredProperties.length === 0 && <p style={{ color: 'var(--muted)' }}>Nenhum anúncio em destaque encontrado.</p>}
          {!propsLoading && !propsError && featuredProperties.map((item) => <ListingCard key={item.id} item={item} onView={setSelected} />)}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Todos os Anúncios</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 13 }}>{allProperties.length} anúncio{allProperties.length !== 1 ? 's' : ''} encontrado{allProperties.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {propsLoading ? (
          <p>Carregando anúncios...</p>
        ) : propsError ? (
          <p className="error">{propsError}</p>
        ) : allProperties.length === 0 ? (
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <h3>Nenhum anúncio encontrado</h3>
            <p style={{ color: 'var(--muted)', margin: '12px 0 0' }}>Ajuste a busca ou os filtros para ver mais anúncios.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 20 }}>
            {allProperties.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <img src={getPropertyImage(item)} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 14 }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{item.title || 'Anúncio'}</h3>
                      <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 13 }}>{item.city || item.state || 'Localização não informada'}</p>
                    </div>
                    <StatusBadge status={item.status || 'disponivel'} />
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>{fmt(item.price || 0)}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    {item.bedrooms ? <span style={{ color: 'var(--muted)', fontSize: 12 }}>🛏️ {item.bedrooms}</span> : null}
                    {item.bathrooms ? <span style={{ color: 'var(--muted)', fontSize: 12 }}>🚿 {item.bathrooms}</span> : null}
                    {item.area ? <span style={{ color: 'var(--muted)', fontSize: 12 }}>📐 {item.area}m²</span> : null}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn-secondary" onClick={() => setSelected(item)}>Ver detalhes</button>
                    <button className="btn-gold" onClick={() => handleInterest(item.id)} disabled={interestLoadingId === item.id}>
                      {interestLoadingId === item.id ? 'Processando...' : 'Tenho Interesse'}
                    </button>
                    <button className="btn-ghost" onClick={() => handleFavorite(item.id)} disabled={favoriteLoadingId === item.id}>
                      {favoriteLoadingId === item.id ? 'Salvando...' : 'Favoritar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
