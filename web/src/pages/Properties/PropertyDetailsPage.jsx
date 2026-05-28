import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getPropertyById, deleteProperty, approveProperty, rejectProperty } from '../../api/properties'
import { addFavorite } from '../../api/favorites'
import { createLead } from '../../api/leads'
import PrimeVendaTheme from '../../components/PrimeVendaTheme'
import '../../styles/properties.css'

const statusLabel = (status) => {
  switch (status) {
    case 'ativo': return 'Ativo'
    case 'pendente': return 'Pendente'
    case 'vendido': return 'Vendido'
    case 'negociando': return 'Negociando'
    case 'arquivado': return 'Arquivado'
    default: return status || 'Desconhecido'
  }
}

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await getPropertyById(id)
        setProperty(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar o imóvel.')
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [id])

  const handleFavorite = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    setMessage('')

    try {
      await addFavorite(property.id)
      setMessage('Imóvel adicionado aos favoritos com sucesso.')
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível favoritar o imóvel.')
    } finally {
      setSaving(false)
    }
  }

  const handleInterest = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    setMessage('')

    try {
      await createLead({ propertyId: property.id })
      setMessage('Interesse registrado com sucesso!')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar interesse.')
    } finally {
      setSaving(false)
    }
  }

  const handleApprove = async () => {
    if (!window.confirm('Deseja aprovar este anúncio?')) return
    setSaving(true)
    setError('')
    setMessage('')

    try {
      await approveProperty(property.id)
      setProperty((prev) => ({ ...prev, status: 'ativo' }))
      setMessage('Anúncio aprovado com sucesso.')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao aprovar o anúncio.')
    } finally {
      setSaving(false)
    }
  }

  const handleReject = async () => {
    if (!window.confirm('Deseja rejeitar este anúncio?')) return
    setSaving(true)
    setError('')
    setMessage('')

    try {
      await rejectProperty(property.id)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao rejeitar o anúncio.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Deseja excluir este anúncio permanentemente?')) return
    setSaving(true)
    setError('')

    try {
      await deleteProperty(property.id)
      navigate('/properties/my')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir o anúncio.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page"><p>Carregando imóvel...</p></div>
  if (error) return <div className="page"><p className="error">{error}</p></div>
  if (!property) return <div className="page"><p>Imóvel não encontrado.</p></div>

  const isOwner = user?.id === property.sellerId
  const isAdmin = user?.role === 'admin'
  const canContact = user?.role === 'user'

  return (
    <>
      <PrimeVendaTheme />
      <div className="page">
        <header className="top-bar" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2>{property.title}</h2>
            <p style={{ color: 'var(--muted)' }}>Detalhes completos do anúncio</p>
          </div>
          <button onClick={() => navigate(-1)} className="btn-secondary">Voltar</button>
        </header>

        <main className="property-details-page">
          <section className="property-gallery">
            {property.images?.length > 0 ? (
              <div className="gallery-grid">
                {property.images.map((image) => (
                  <img key={image.id || image.url} src={image.url || image} alt={property.title} />
                ))}
              </div>
            ) : (
              <div className="property-image-placeholder">Sem imagens disponíveis</div>
            )}
          </section>

          <section className="property-summary">
            <div className="property-summary-header">
              <div>
                <span className="status-badge badge-gold">{statusLabel(property.status)}</span>
                <h3>{property.type}</h3>
                <p style={{ marginTop: 6, color: 'var(--muted)' }}>{property.city}, {property.state}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                  R$ {parseFloat(property.price || 0).toLocaleString('pt-BR')}
                </p>
                <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>{property.bedrooms} quartos • {property.bathrooms} banheiros • {property.area}m²</p>
              </div>
            </div>

            <div className="property-cards-grid">
              <div className="card">
                <h4>Descrição</h4>
                <p>{property.description || 'Nenhuma descrição disponível.'}</p>
              </div>
              <div className="card">
                <h4>Endereço</h4>
                <p>{property.street || '—'}, {property.number || 's/n'}</p>
                <p>{property.neighborhood || '—'} • {property.city || '—'} • {property.state || '—'}</p>
                <p>CEP: {property.zipCode || '—'}</p>
              </div>
              <div className="card">
                <h4>Vendedor</h4>
                <p><strong>{property.seller?.name || 'Desconhecido'}</strong></p>
                <p>{property.seller?.email}</p>
              </div>
            </div>

            <div className="property-actions-row">
              {message && <div className="success-state"><p>{message}</p></div>}
              {error && <div className="error-state"><p>{error}</p></div>}

              {canContact && (
                <>
                  <button className="btn-primary" onClick={handleInterest} disabled={saving}>
                    {saving ? 'Registrando...' : 'Tenho Interesse'}
                  </button>
                  <button className="btn-secondary" onClick={handleFavorite} disabled={saving}>
                    {saving ? 'Favoritando...' : 'Adicionar aos Favoritos'}
                  </button>
                </>
              )}

              {isOwner && (
                <>
                  <button className="btn-gold" onClick={() => navigate(`/properties/edit/${property.id}`)}>
                    ✏️ Editar Anúncio
                  </button>
                  <button className="btn-danger" onClick={handleDelete} disabled={saving}>
                    {saving ? 'Excluindo...' : 'Excluir Anúncio'}
                  </button>
                </>
              )}

              {isAdmin && (
                <>
                  <button className="btn-approve" onClick={handleApprove} disabled={saving}>
                    ✅ Aprovar
                  </button>
                  <button className="btn-reject" onClick={handleReject} disabled={saving}>
                    ❌ Rejeitar
                  </button>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
