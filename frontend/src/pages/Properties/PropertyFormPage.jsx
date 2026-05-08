import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, updateProperty, getPropertyById } from '../../api/properties';
import '../../styles/properties.css';
import PrimeVendaTheme from '../../components/PrimeVendaTheme';

export default function PropertyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Para edição
  const isEditing = !!id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'Apartamento',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: '',
    number: '',
    neighborhood: '',
    complement: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      const response = await getPropertyById(id);
      const property = response.data;
      setForm({
        title: property.title || '',
        description: property.description || '',
        type: property.type || 'Apartamento',
        price: property.price || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area || '',
        address: property.street || '',
        number: property.number || '',
        neighborhood: property.neighborhood || '',
        complement: property.complement || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zipCode || ''
      });
    } catch (err) {
      setError('Erro ao carregar imóvel');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      price: parseFloat(form.price) || 0,
      bedrooms: parseInt(form.bedrooms, 10) || 0,
      bathrooms: parseInt(form.bathrooms, 10) || 0,
      area: parseFloat(form.area) || 0,
      address: form.address.trim(),
      number: form.number.trim(),
      neighborhood: form.neighborhood.trim(),
      complement: form.complement.trim(),
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      zipCode: form.zipCode.trim()
    };

    try {
      if (isEditing) {
        await updateProperty(id, payload);
      } else {
        await createProperty(payload);
      }

      navigate('/properties/my');
    } catch (err) {
      setError('Não foi possível salvar o imóvel. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="page"><p>Carregando...</p></div>;

  return (
    <>
      <PrimeVendaTheme />
      <div className="page">
        <header className="top-bar">
          <h2>{isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}</h2>
          <button onClick={() => navigate('/properties/my')} className="btn-ghost">
            ← Voltar
          </button>
        </header>

        <main className="dashboard-content">
          <form onSubmit={handleSubmit} className="card property-form">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-section">
            <h3>Informações Básicas</h3>

            <div className="form-group">
              <label className="form-label">Título do Anúncio *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="inp"
                placeholder="Ex: Apartamento 3 quartos no centro"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Imóvel *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="inp"
                required
                disabled={loading}
              >
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Terreno">Terreno</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Comercial">Comercial</option>
                <option value="Galpão">Galpão</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preço (R$) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="inp"
                placeholder="450000"
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="inp"
                rows="4"
                placeholder="Descreva o imóvel..."
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Características</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quartos</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  className="inp"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banheiros</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  className="inp"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Área (m²)</label>
                <input
                  type="number"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className="inp"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Localização</h3>

            <div className="form-group">
              <label className="form-label">Endereço</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="inp"
                placeholder="Rua das Flores, 123"
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Número</label>
                <input
                  type="text"
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  className="inp"
                  placeholder="123"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bairro</label>
                <input
                  type="text"
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={handleChange}
                  className="inp"
                  placeholder="Centro"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Complemento</label>
                <input
                  type="text"
                  name="complement"
                  value={form.complement}
                  onChange={handleChange}
                  className="inp"
                  placeholder="Apartamento 101"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cidade *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="inp"
                  placeholder="São Paulo"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado *</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="inp"
                  placeholder="SP"
                  maxLength="2"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">CEP</label>
                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  className="inp"
                  placeholder="01234-567"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/properties/my')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar Imóvel' : 'Criar Imóvel')}
            </button>
          </div>
          </form>
        </main>
      </div>
    </>
  );
}
