import { useState } from "react";
import { loginRequest } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest(email, password);
      signin(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Erro no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>🔐 Bem-vindo</h1>
        
        {error && (
          <div className="alert alert-error">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
          <span>ℹ️</span>
          <div>
            <strong>Projeto em Desenvolvimento</strong><br/>
            Criado por leonardo. <a href="https://github.com/kratos345" target="_blank" rel="noopener noreferrer">GitHub</a>.
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input
            className="form-input"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Senha</label>
          <input
            className="form-input"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? '⏳ Entrando...' : '✅ Entrar'}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.95rem' }}>
          Não tem conta? <Link to="/register">Criar uma aqui</Link>
        </p>
      </form>
    </div>
  );
}