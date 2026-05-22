import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequest } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import PrimeVendaTheme from '../../components/PrimeVendaTheme';

const ROLE_OPTIONS = [
  ['user', '👤', 'Usuário'],
  ['vendedor', '🏪', 'Vendedor'],
  ['admin', '🛡', 'Admin']
];

export default function RegisterPage() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cpfCnpj: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = form;
      const data = await registerRequest(payload);
      signin(data.token, data.user);
      navigate('/');
    } catch (err) {
      const response = err.response?.data;
      const message = response?.message ||
        (Array.isArray(response?.errors) ? response.errors.map(e => e.msg).join(', ') : null) ||
        'Erro ao cadastrar.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PrimeVendaTheme />
      <div className="auth-layout">
        <div className="auth-left">
          <div className="hero-bg" />
          <div className="hero-content">
            <div>
              <span className="playfair gold-text" style={{ fontSize: 26, fontWeight: 700 }}>PrimeVenda</span>
              <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 14 }}>Plataforma premium de vendas</p>
            </div>
            <div>
              <h1 className="playfair" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Comece agora sua conta<br />
                <span className="gold-text">no PrimeVenda</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 }}>Cadastre-se como comprador, vendedor ou administrador e acesse o painel correto.</p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <form className="auth-form fade-up" onSubmit={submit}>
            <div style={{ marginBottom: 28, textAlign: 'center' }}>
              <span className="playfair gold-text" style={{ fontSize: 26, fontWeight: 700 }}>PrimeVenda</span>
              <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 18, marginBottom: 6 }}>Criar conta</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>Preencha os dados para se cadastrar</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
              {ROLE_OPTIONS.map(([value, icon, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setForm({ ...form, role: value })}
                  style={{
                    padding: '10px 6px',
                    border: `1.5px solid ${form.role === value ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 10,
                    background: form.role === value ? 'rgba(201,168,76,.1)' : 'transparent',
                    color: form.role === value ? 'var(--gold)' : 'var(--muted)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all .2s'
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 3 }}>{icon}</div>
                  {label}
                </button>
              ))}
            </div>

            {error && (
              <div style={{ marginBottom: 20, padding: 14, borderRadius: 12, background: 'rgba(224,85,85,.12)', color: 'var(--red)', border: '1px solid rgba(224,85,85,.3)' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 5, display: 'block', letterSpacing: '.4px', textTransform: 'uppercase' }}>Nome</label>
                  <input className="inp" name="name" placeholder="João" value={form.name} onChange={handle} required disabled={loading} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 5, display: 'block', letterSpacing: '.4px', textTransform: 'uppercase' }}>CPF/CNPJ</label>
                  <input className="inp" name="cpfCnpj" placeholder="000.000.000-00" value={form.cpfCnpj} onChange={handle} disabled={loading} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 5, display: 'block', letterSpacing: '.4px', textTransform: 'uppercase' }}>E-mail</label>
                <input className="inp" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handle} required disabled={loading} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 5, display: 'block', letterSpacing: '.4px', textTransform: 'uppercase' }}>Senha</label>
                  <input className="inp" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required minLength={6} disabled={loading} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 5, display: 'block', letterSpacing: '.4px', textTransform: 'uppercase' }}>Confirmar senha</label>
                  <input className="inp" name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handle} required minLength={6} disabled={loading} />
                </div>
              </div>
            </div>

            <button className="btn-gold" type="submit" disabled={loading} style={{ width: '100%', padding: 13 }}>
              {loading ? '⏳ Cadastrando...' : `Criar conta como ${form.role === 'vendedor' ? 'Vendedor' : form.role === 'admin' ? 'Admin' : 'Usuário'}`}
            </button>

            <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: 'var(--muted)' }}>
              Já tem conta?{' '}
              <Link style={{ color: 'var(--gold)', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }} to="/login">Entrar</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
