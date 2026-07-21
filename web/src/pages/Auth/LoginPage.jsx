import { useState, useEffect, useRef } from "react";
import { loginRequest, forgotPassword, resetPassword } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PrimeVendaTheme from "../../components/PrimeVendaTheme";
import RequestAccountForm from "./RequestAccountForm";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const countdownRef = useRef(null);

  const navigate = useNavigate();
  const { signin } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'forgot'
  const [forgotStage, setForgotStage] = useState(0); // 0 = ask email, 1 = set new password
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotProgress, setForgotProgress] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const forgotCountdownRef = useRef(null);
  const forgotTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      if (forgotCountdownRef.current) {
        clearInterval(forgotCountdownRef.current);
      }
      if (forgotTimeoutRef.current) {
        clearTimeout(forgotTimeoutRef.current);
      }
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest(email, password);
      signin(data.token, data.user);
      setLoginSuccess(true);
      setLoading(false);
      setProgress(0);

      countdownRef.current = setInterval(() => {
        setProgress((old) => Math.min(100, old + 2));
      }, 100);

      setTimeout(() => {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
        navigate('/');
      }, 5000);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Erro no login";
      setError(message.includes('Network Error') ? 'Erro de conexão: verifique se o backend está rodando.' : message);
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
              <span className="playfair gold-text" style={{ fontSize: 26, fontWeight: 700 }}>Prime Venda</span>
              <p style={{ color: "var(--muted)", marginTop: 8, fontSize: 14 }}>Plataforma premium de vendas de imóveis</p>
            </div>
            <div>
              <h1 className="playfair" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Venda ou compre<br />
                <span className="gold-text">imóveis de alto padrão</span>
              </h1>
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7 }}>Conectando compradores e vendedores no mercado imobiliário.</p>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <form className="auth-form fade-up" onSubmit={mode === 'login' ? handleLogin : (e) => e.preventDefault()}>
            <div style={{ marginBottom: 36, textAlign: "center" }}>
              <span className="playfair gold-text" style={{ fontSize: 28, fontWeight: 700 }}>Prime Venda</span>
              <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 20, marginBottom: 6 }}>Bem-vindo de volta</h2>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Acesse sua conta para continuar no portal de imóveis.</p>
            </div>
            {error && (
              <div style={{ marginBottom: 20, padding: 14, borderRadius: 12, background: "rgba(224,85,85,.12)", color: "var(--red)", border: "1px solid rgba(224,85,85,.3)" }}>
                {error}
              </div>
            )}
            {loginSuccess && (
              <div style={{ marginBottom: 20, padding: 14, borderRadius: 12, background: "rgba(56,189,248,.12)", color: "#0f766e", border: "1px solid rgba(34,197,94,.3)" }}>
                <strong>Logado com sucesso!</strong>
                <p style={{ margin: '8px 0 10px', fontSize: 13 }}>Aguarde enquanto redirecionamos para o painel.</p>
                <div style={{ width: '100%', height: 10, borderRadius: 999, background: '#e5e7eb', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: '#f59e0b', transition: 'width .1s ease' }} />
                </div>
              </div>
            )}
            {forgotSuccess && (
              <div style={{ marginBottom: 20, padding: 14, borderRadius: 12, background: "rgba(56,189,248,.12)", color: "#0f766e", border: "1px solid rgba(34,197,94,.3)" }}>
                <strong>{forgotSuccess}</strong>
                <p style={{ margin: '8px 0 10px', fontSize: 13 }}>{forgotStage === 0 ? 'Aguarde enquanto abrimos o formulário de nova senha.' : 'Aguarde enquanto voltamos para o login.'}</p>
                <div style={{ width: '100%', height: 10, borderRadius: 999, background: '#e5e7eb', overflow: 'hidden' }}>
                  <div style={{ width: `${forgotProgress}%`, height: '100%', background: '#f59e0b', transition: 'width .1s ease' }} />
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
              {mode === 'login' ? (
                <>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: ".4px", textTransform: "uppercase" }}>E-mail</label>
                    <input
                      className="inp"
                      placeholder="seu@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading || loginSuccess}
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
                      disabled={loading || loginSuccess}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 13, color: "var(--gold)", cursor: "pointer" }} onClick={() => { setMode('forgot'); setForgotStage(0); setForgotError(''); }}>
                      Esqueci a senha
                    </span>
                  </div>
                </>
              ) : (
                // Forgot password UI
                <>
                  {forgotError && <div style={{ marginBottom: 10, color: 'var(--red)' }}>{forgotError}</div>}
                  {forgotStage === 0 ? (
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: ".4px", textTransform: "uppercase" }}>E-mail</label>
                      <input
                        className="inp"
                        placeholder="seu@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={forgotLoading || !!forgotSuccess}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }} onClick={() => setMode('login')}>Voltar ao login</span>
                        <button type="button" className="btn-gold" onClick={async () => {
                          setForgotError('');
                          setForgotSuccess('');
                          if (forgotCountdownRef.current) clearInterval(forgotCountdownRef.current);
                          if (forgotTimeoutRef.current) clearTimeout(forgotTimeoutRef.current);
                          setForgotLoading(true);
                          try {
                            await forgotPassword(email);
                            setForgotSuccess('Usuário encontrado');
                            setForgotProgress(0);
                            forgotCountdownRef.current = setInterval(() => {
                              setForgotProgress((old) => Math.min(100, old + 3));
                            }, 100);
                            forgotTimeoutRef.current = setTimeout(() => {
                              if (forgotCountdownRef.current) {
                                clearInterval(forgotCountdownRef.current);
                              }
                              setForgotSuccess('');
                              setForgotStage(1);
                            }, 3000);
                          } catch (err) {
                            setForgotError(err.response?.data?.message || err.message || 'Erro ao processar.');
                          } finally {
                            setForgotLoading(false);
                          }
                        }} disabled={forgotLoading || !!forgotSuccess} style={{ padding: '8px 14px' }}>{forgotLoading ? 'Enviando...' : 'Enviar'}</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", letterSpacing: ".4px", textTransform: "uppercase" }}>Nova senha</label>
                      <input className="inp" placeholder="••••••••" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginTop: 8, marginBottom: 6, display: "block", letterSpacing: ".4px", textTransform: "uppercase" }}>Confirmar senha</label>
                      <input className="inp" placeholder="••••••••" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }} onClick={() => { setForgotStage(0); setNewPassword(''); setConfirmPassword(''); }}>Voltar</span>
                        <button type="button" className="btn-gold" onClick={async () => {
                          setForgotError('');
                          if (!newPassword || newPassword.length < 6) { setForgotError('Senha deve ter pelo menos 6 caracteres.'); return; }
                          if (newPassword !== confirmPassword) { setForgotError('Senhas não conferem.'); return; }
                          setForgotError('');
                          setForgotSuccess('');
                          if (forgotCountdownRef.current) clearInterval(forgotCountdownRef.current);
                          if (forgotTimeoutRef.current) clearTimeout(forgotTimeoutRef.current);
                          setForgotLoading(true);
                          try {
                            await resetPassword(email, newPassword);
                            setForgotSuccess('Senha trocada com sucesso');
                            setForgotProgress(0);
                            forgotCountdownRef.current = setInterval(() => {
                              setForgotProgress((old) => Math.min(100, old + 3));
                            }, 100);
                            forgotTimeoutRef.current = setTimeout(() => {
                              if (forgotCountdownRef.current) {
                                clearInterval(forgotCountdownRef.current);
                              }
                              // Volta para o formulário de login e redireciona para a rota de login
                              setMode('login');
                              setForgotStage(0);
                              setNewPassword('');
                              setConfirmPassword('');
                              setForgotSuccess('');
                              navigate('/login');
                            }, 3000);
                          } catch (err) {
                            setForgotError(err.response?.data?.message || err.message || 'Erro ao redefinir senha.');
                          } finally { setForgotLoading(false); }
                        }} disabled={forgotLoading || !!forgotSuccess} style={{ padding: '8px 14px' }}>{forgotLoading ? 'Redefinindo...' : 'Redefinir senha'}</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {mode === 'login' ? (
              <button className="btn-gold" type="submit" disabled={loading || loginSuccess} style={{ width: "100%", padding: 14 }}>
                {loading ? '⏳ Entrando...' : loginSuccess ? 'Aguarde...' : 'Entrar'}
              </button>
            ) : null}
            <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--muted)" }}>
              Novo usuário somente pode ser criado por um administrador no painel. <span style={{ color: 'var(--gold)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowRequestForm(true)}>Solicitar conta</span>
            </p>
            {showRequestForm && <RequestAccountForm onClose={() => setShowRequestForm(false)} />}
          </form>
        </div>
      </div>
    </>
  );
}
