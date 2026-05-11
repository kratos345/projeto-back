import { useState } from "react";
import { loginRequest } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PrimeVendaTheme from "../../components/PrimeVendaTheme";

const ROLE_OPTIONS = [
  ["user", "👤", "Usuário"],
  ["vendedor", "🏪", "Vendedor"],
  ["admin", "🛡", "Admin"]
];

const TEST_ACCOUNTS = [
  { role: 'admin', label: 'Admin', email: 'admin@example.com', password: '123456' },
  { role: 'vendedor', label: 'Vendedor', email: 'vendedor@example.com', password: '123456' },
  { role: 'user', label: 'Usuário', email: 'usuario@example.com', password: '123456' }
];

export default function LoginPage() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signin } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest(email, password);
      signin(data.token, data.user);
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Erro no login";
      setError(message.includes('Network Error') ? 'Erro de conexão: verifique se o backend está rodando.' : message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (value) => {
    setRole(value);
    const account = TEST_ACCOUNTS.find((item) => item.role === value);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setError("");
    }
  };

  const handleFillTestAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setRole(account.role);
    setError("");
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
              <p style={{ color: "var(--muted)", marginTop: 8, fontSize: 14 }}>Plataforma premium de vendas</p>
            </div>
            <div>
              <h1 className="playfair" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Imóveis & Veículos<br />
                <span className="gold-text">de alto padrão</span>
              </h1>
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7 }}>Conectando compradores e vendedores nos melhores negócios do mercado.</p>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <form className="auth-form fade-up" onSubmit={handleLogin}>
            <div style={{ marginBottom: 36, textAlign: "center" }}>
              <span className="playfair gold-text" style={{ fontSize: 28, fontWeight: 700 }}>PrimeVenda</span>
              <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 20, marginBottom: 6 }}>Bem-vindo de volta</h2>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Acesse sua conta para continuar</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8, marginBottom: 18 }}>
              {ROLE_OPTIONS.map(([value, icon, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => handleSelectRole(value)}
                  style={{
                    padding: "10px 6px",
                    border: `1.5px solid ${role === value ? "var(--gold)" : "var(--border)"}`,
                    borderRadius: 10,
                    background: role === value ? "rgba(201,168,76,.1)" : "transparent",
                    color: role === value ? "var(--gold)" : "var(--muted)",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    transition: "all .2s"
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 3 }}>{icon}</div>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 22, padding: 14, borderRadius: 14, background: 'rgba(255, 255, 255, 0.05)' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>Use uma conta de teste rápida:</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                {TEST_ACCOUNTS.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleFillTestAccount(account)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,.12)',
                      background: 'rgba(255,255,255,.04)',
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 12
                    }}
                  >
                    {account.label}
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <div style={{ marginBottom: 20, padding: 14, borderRadius: 12, background: "rgba(224,85,85,.12)", color: "var(--red)", border: "1px solid rgba(224,85,85,.3)" }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: ".4px", textTransform: "uppercase" }}>E-mail</label>
                <input
                  className="inp"
                  placeholder="seu@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: ".4px", textTransform: "uppercase" }}>Senha</label>
                <input
                  className="inp"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 13, color: "var(--gold)", cursor: "pointer" }}>Esqueci a senha</span>
              </div>
            </div>
            <button className="btn-gold" type="submit" disabled={loading} style={{ width: "100%", padding: 14 }}>
              {loading ? '⏳ Entrando...' : `Entrar como ${role === 'admin' ? 'Admin' : role === 'vendedor' ? 'Vendedor' : 'Usuário'}`}
            </button>
            <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--muted)" }}>
              Não tem conta?{' '}
              <Link style={{ color: "var(--gold)", cursor: "pointer", fontWeight: 600, textDecoration: 'none' }} to="/register">Cadastre-se</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
