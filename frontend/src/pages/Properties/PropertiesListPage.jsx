import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getMyProperties, deleteProperty, createProperty, updateProperty, uploadPropertyImages, deletePropertyImage } from '../../api/properties';
import '../../styles/properties.css';
import PrimeVendaTheme from '../../components/PrimeVendaTheme';

const initialFormState = {
  title: '',
  description: '',
  type: 'Apartamento',
  status: 'ativo',
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
};

export default function PropertiesListPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  const { id: editIdParam } = useParams();

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (location.state?.openNew || location.pathname === '/properties/new') {
      openNewForm();
      return;
    }

    const targetId = editIdParam || location.state?.editId;
    if (!targetId || properties.length === 0) return;

    const property = properties.find((item) => item.id.toString() === targetId.toString());
    if (property) openEditForm(property);
  }, [location.state, location.pathname, properties, editIdParam]);

  async function loadProperties() {
    try {
      const response = await getMyProperties();
      setProperties(response.data);
    } catch (err) {
      setLoadError('Não foi possível carregar seus imóveis. Atualize a página e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSelectedProperty(null);
    setForm(initialFormState);
    setExistingImages([]);
    setNewImages([]);
    setFormVisible(false);
    setFormError('');
  }

  function openNewForm() {
    resetForm();
    setFormVisible(true);
  }

  function openEditForm(property) {
    setSelectedProperty(property);
    setForm({
      title: property.title || '',
      description: property.description || '',
      type: property.type || 'Apartamento',
      status: property.status || 'ativo',
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
    setExistingImages(property.images || []);
    setNewImages([]);
    setFormVisible(true);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'zipCode') {
      const raw = value.replace(/\D/g, '').slice(0, 8);
      const formatted = raw.replace(/^(\d{5})(\d{1,3})?$/, (_, part1, part2) => {
        return part2 ? `${part1}-${part2}` : part1;
      });
      setForm((prev) => ({ ...prev, zipCode: formatted }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);
  };

  const handleRemoveExistingImage = async (imageId) => {
    if (!selectedProperty) return;
    try {
      await deletePropertyImage(selectedProperty.id, imageId);
      setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
      setProperties((prev) => prev.map((property) => {
        if (property.id !== selectedProperty.id) return property;
        return { ...property, images: property.images?.filter((image) => image.id !== imageId) || [] };
      }));
    } catch (err) {
      setFormError('Erro ao remover imagem.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

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
      status: form.status?.toString().trim().toLowerCase(),
      zipCode: form.zipCode.trim()
    };

    // Validações rigorosas
    if (!payload.title || payload.title.length < 10) {
      setFormError('❌ Título deve ter no mínimo 10 caracteres');
      setSaving(false);
      return;
    }

    if (payload.price <= 0) {
      setFormError('❌ Preço deve ser maior que zero');
      setSaving(false);
      return;
    }

    if (!payload.address || payload.address.length < 5) {
      setFormError('❌ Endereço inválido (mínimo 5 caracteres)');
      setSaving(false);
      return;
    }

    if (!payload.city || payload.city.length < 3) {
      setFormError('❌ Cidade inválida');
      setSaving(false);
      return;
    }

    if (!payload.state || payload.state.length !== 2) {
      setFormError('❌ Estado deve ter 2 caracteres (ex: SP)');
      setSaving(false);
      return;
    }

    if (payload.zipCode && !/^\d{5}-\d{3}$/.test(payload.zipCode)) {
      setFormError('❌ CEP inválido (formato: 12345-678)');
      setSaving(false);
      return;
    }

    if (payload.bedrooms < 0 || payload.bathrooms < 0 || payload.area < 0) {
      setFormError('❌ Valores de quartos, banheiros e área não podem ser negativos');
      setSaving(false);
      return;
    }

    try {
      let propertyId = selectedProperty?.id;

      if (selectedProperty) {
        await updateProperty(propertyId, payload);
      } else {
        const response = await createProperty(payload);
        propertyId = response.data.id;
      }

      if (newImages.length > 0) {
        await uploadPropertyImages(propertyId, newImages);
      }

      await loadProperties();
      resetForm();
      alert('✅ Imóvel salvo com sucesso!');
    } catch (err) {
      setFormError('❌ Não foi possível salvar o imóvel. Verifique os dados e tente novamente.');
    } finally {
      setSaving(false);
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
  if (loadError) return <div className="page"><p className="error">{loadError}</p></div>;

  return (
    <>
      <PrimeVendaTheme />
      <div className="properties-page">
        <header className="top-bar">
          <h2>Meus Imóveis</h2>
          <button onClick={openNewForm} className="btn-gold">
            ➕ Novo Imóvel
          </button>
        </header>

        <main className="dashboard-content">
          {formVisible && (
            <div className="card property-form" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 16 }}>
                <div>
                  <h3>{selectedProperty ? 'Editar Imóvel' : 'Novo Imóvel'}</h3>
                  <p style={{ color: 'var(--muted)', margin: 0 }}>
                    {selectedProperty ? 'Ajuste os dados do anúncio e salve as alterações.' : 'Preencha os dados abaixo para criar um novo anúncio.'}
                  </p>
                </div>
                <button type="button" className="btn-secondary" onClick={resetForm} disabled={saving}>
                  Fechar
                </button>
              </div>

              {formError && <div className="alert alert-error">{formError}</div>}

              <form onSubmit={handleSubmit}>
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
                      disabled={saving}
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
                      disabled={saving}
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
                    <label className="form-label">Status do Anúncio *</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="inp"
                      required
                      disabled={saving}
                    >
                      <option value="ativo">Ativo</option>
                      <option value="pendente">Pendente</option>
                      <option value="disponivel">Disponível</option>
                      <option value="negociando">Negociando</option>
                      <option value="vendido">Vendido</option>
                      <option value="arquivado">Arquivado</option>
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
                      disabled={saving}
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
                      disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                      disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Imagens do anúncio</h3>

                  <div className="form-group">
                    <label className="form-label">Selecionar imagens</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="inp"
                      disabled={saving}
                    />
                  </div>

                  {existingImages.length > 0 && (
                    <div className="image-preview-list">
                      <h4>Imagens já enviadas</h4>
                      <div className="image-preview-grid">
                        {existingImages.map((image) => (
                          <div key={image.id} className="image-preview-card">
                            <img src={image.url} alt="Anúncio" />
                            <button
                              type="button"
                              className="btn-ghost btn-small"
                              onClick={() => handleRemoveExistingImage(image.id)}
                              disabled={saving}
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {newImages.length > 0 && (
                    <div className="image-preview-list">
                      <h4>Novas imagens selecionadas</h4>
                      <div className="image-preview-grid">
                        {newImages.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="image-preview-card">
                            <img src={URL.createObjectURL(file)} alt={file.name} />
                            <p>{file.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={resetForm} disabled={saving}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Salvando...' : (selectedProperty ? 'Atualizar Imóvel' : 'Criar Imóvel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {properties.length === 0 ? (
            <div className="empty-state card">
              <h3>Você ainda não tem imóveis cadastrados</h3>
              <p>Comece criando seu primeiro anúncio!</p>
              <button onClick={openNewForm} className="btn-gold">
                Criar Primeiro Imóvel
              </button>
            </div>
          ) : (
            <div className="card property-table-card">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Imagem</th>
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
                      <td>
                        {property.images?.[0]?.url ? (
                          <img src={property.images[0].url} alt="Thumb" className="table-thumb" />
                        ) : (
                          <span className="badge badge-muted">Sem imagem</span>
                        )}
                      </td>
                      <td>{property.title}</td>
                      <td>{property.type}</td>
                      <td>{formatPrice(property.price)}</td>
                      <td>{property.city}</td>
                      <td><span className={getBadgeClass(property.status)}>{property.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button onClick={() => openEditForm(property)} className="btn-ghost">
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
