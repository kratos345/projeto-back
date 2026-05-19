import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserById, updateUser } from '../../api/users'
import '../../styles/admin.css'

const ROLE_OPTIONS = [
  { value: 'user', label: 'Usuário' },
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'admin', label: 'Administrador' }
]

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'bloqueado', label: 'Bloqueado' }
]

export default function EditUserPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'ativo',
    phone: '',
    cpfCnpj: '',
    company: '',
    creci: '',
    password: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getUserById(id)
        const data = response.data
        setForm({
          name: data.name || '',
          email: data.email || '',
          role: data.role || 'user',
          status: data.status || 'ativo',
          phone: data.phone || '',
          cpfCnpj: data.cpfCnpj || '',
          company: data.company || '',
          creci: data.creci || '',
          password: ''
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Não foi possível carregar o usuário.')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        phone: form.phone,
        cpfCnpj: form.cpfCnpj,
        company: form.company,
        creci: form.creci
      }

      if (form.password.trim()) {
        payload.password = form.password.trim()
      }

      await updateUser(id, payload)
      setSuccess('Usuário atualizado com sucesso.')
      setForm((prev) => ({ ...prev, password: '' }))
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar usuário.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page"><p>Carregando usuário...</p></div>

  return (
    <div className="page">
      <header className="top-bar">
        <div>
          <h2>Editar Usuário</h2>
          <p>Atualize os dados e o status do usuário.</p>
        </div>
        <button onClick={() => navigate('/users')}>Voltar</button>
      </header>

      <main>
        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: '#16a34a' }}>{success}</p>}

        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-grid">
            <label>
              Nome
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Senha (deixe vazio para manter)
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </label>

            <label>
              Papel
              <select name="role" value={form.role} onChange={handleChange}>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Telefone
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </label>

            <label>
              CPF/CNPJ
              <input
                type="text"
                name="cpfCnpj"
                value={form.cpfCnpj}
                onChange={handleChange}
              />
            </label>

            <label>
              Empresa
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
              />
            </label>

            <label>
              CRECI
              <input
                type="text"
                name="creci"
                value={form.creci}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
