import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerRequest } from '../../api/auth'
import { useAuth } from '../../contexts/AuthContext'

export default function RegisterPage() {
  const { signin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const data = await registerRequest(form)
      signin(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submit}>
        <h1>🚀 Criar Conta</h1>
        
        {error && (
          <div className="alert alert-error">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}
        
        <div className="form-group">
          <label className="form-label">Nome Completo</label>
          <input 
            className="form-input"
            name="name"
            type="text"
            placeholder="João Silva"
            value={form.name}
            onChange={handle}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input 
            className="form-input"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={handle}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Senha</label>
          <input 
            className="form-input"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handle}
            required
            minLength={6}
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? '⏳ Cadastrando...' : '✅ Cadastrar'}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.95rem' }}>
          Já tem conta? <Link to="/login">Entrar aqui</Link>
        </p>
      </form>
    </div>
  )
}
