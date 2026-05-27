import { useState } from "react";
import { requestAccount } from "../../api/auth";

export default function RequestAccountForm({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !cpfCnpj.trim() || !password || !email.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('E-mail inválido');
      return;
    }
    if (!isValidCpfCnpj(cpfCnpj)) {
      setCpfError('CPF/CNPJ inválido');
      return;
    }
    if (password !== confirm) {
      setError("As senhas não batem.");
      return;
    }

    try {
      // enviar cpf/cnpj sem formatação
      const digits = cpfCnpj.replace(/\D/g, '');
      await requestAccount({ name, cpfCnpj: digits, password, email });
      setSuccess(true);
      setName("");
      setCpfCnpj("");
      setPassword("");
      setConfirm("");

      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erro ao enviar solicitação');
    }
  };

  const maskCpfCnpj = (val) => {
    if (!val) return '';
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 11) {
      // CPF mask: 000.000.000-00
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (m, a, b, c, d) => {
        let out = `${a}`;
        if (b) out += `.${b}`;
        if (c) out += `.${c}`;
        if (d) out += `-${d}`;
        return out;
      }).slice(0, 14);
    } else {
      // CNPJ mask: 00.000.000/0000-00
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (m, a, b, c, d, e) => {
        let out = `${a}`;
        if (b) out += `.${b}`;
        if (c) out += `.${c}`;
        if (d) out += `/${d}`;
        if (e) out += `-${e}`;
        return out;
      }).slice(0, 18);
    }
  };

  const isValidEmail = (value) => {
    if (!value) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };

  const isValidCpfCnpj = (value) => {
    if (!value) return false;
    const v = value.replace(/\D/g, '');
    if (v.length === 11) return validateCPF(v);
    if (v.length === 14) return validateCNPJ(v);
    return false;
  };

  const validateCPF = (cpf) => {
    if (!cpf || cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
  };

  const validateCNPJ = (cnpj) => {
    if (!cnpj || cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;
    const t = cnpj.length - 2;
    const d = cnpj.substring(t);
    const d1 = parseInt(d.charAt(0));
    const d2 = parseInt(d.charAt(1));
    let calc = (x) => {
      let n = 0;
      let p = x - 7;
      for (let i = x; i >= 1; i--) {
        n += parseInt(cnpj.charAt(x - i)) * p--;
        if (p < 2) p = 9;
      }
      const r = n % 11;
      return r < 2 ? 0 : 11 - r;
    };
    return calc(12) === d1 && calc(13) === d2;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ width: 420, maxWidth: '95%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: 'var(--gold)' }}>Solicitar conta</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 0, fontSize: 18, cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
        </div>

        {error && <div style={{ marginBottom: 10, color: 'var(--red)' }}>{error}</div>}

        {success ? (
          <div style={{ padding: 14, borderRadius: 8, background: 'rgba(34,197,94,.12)', color: '#064e3b' }}>
            Solicitação enviada com sucesso. Aguarde contato da equipe.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>Nome completo</label>
              <input className="inp" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />

              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>E-mail</label>
              <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />

              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>CPF ou CNPJ</label>
              <input className="inp" value={cpfCnpj} onChange={(e) => setCpfCnpj(maskCpfCnpj(e.target.value))} placeholder="000.000.000-00 ou 00.000.000/0000-00" />

              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>Senha desejada</label>
              <input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />

              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>Confirme a senha</label>
              <input className="inp" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repita a senha" />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button type="button" onClick={onClose} className="btn" style={{ background: 'transparent', border: '1px solid #d1d5db', padding: '8px 12px' }}>Cancelar</button>
                <button type="submit" className="btn-gold" style={{ padding: '8px 14px' }}>Enviar solicitação</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
