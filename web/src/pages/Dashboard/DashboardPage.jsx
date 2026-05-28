import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMyProperties, deleteProperty, getProperties } from '../../api/properties';
import { getMyFavorites, removeFavorite } from '../../api/favorites';
import { getMyPurchases } from '../../api/leads';
import { updateCurrentUser, uploadAvatar, getUsers, deleteUser, getUserSettings, updateUserSettings } from '../../api/users';
import { getAdminMetrics, getSellerMetrics } from '../../api/dashboard';
import PrimeVendaTheme from '../../components/PrimeVendaTheme';
import '../../styles/dashboard.css';
import UsuarioDashboard from './components/UsuarioDashboard';
import VendedorDashboard from './components/VendedorDashboard';
import AdminDashboard from './components/AdminDashboard';
import UsersPage from '../Users/UsersPage';
import { Ic, fmt, formatDate, StatusBadge, ListingModal, ListingCard, StatCard } from './components/DashboardHelpers';
import logo from '../../assets/logo.png';

// Observação: anteriormente usamos mocks para a aba Explorar.
// Agora a aba Explorar deve carregar apenas anúncios reais criados no backend.

const TABS = {
  usuario: ['explorar', 'favoritos', 'minhas-compras', 'configuracoes', 'perfil'],
  vendedor: ['painel', 'meus-anuncios', 'novo-anuncio', 'configuracoes', 'perfil'],
  adm: ['painel', 'usuarios', 'perfil', 'relatorios', 'configuracoes'],
};

const TAB_META = {
  explorar: { icon: 'grid', label: 'Explorar' },
  favoritos: { icon: 'heart', label: 'Favoritos' },
  'minhas-compras': { icon: 'list', label: 'Minhas Compras' },
  perfil: { icon: 'user', label: 'Perfil' },
  painel: { icon: 'chart', label: 'Painel' },
  'meus-anuncios': { icon: 'tag', label: 'Meus Anúncios' },
  'novo-anuncio': { icon: 'plus', label: 'Novo Anúncio' },
  configuracoes: { icon: 'settings', label: 'Configurações' },
  anuncios: { icon: 'list', label: 'Anúncios' },
  usuarios: { icon: 'users', label: 'Usuários' },
  relatorios: { icon: 'chart', label: 'Relatórios' },
};

const ROLE_LABEL = { usuario: 'Usuário', vendedor: 'Vendedor', adm: 'Administrador' };
const ROLE_ICON = { usuario: '👤', vendedor: '🏪', adm: '🛡' };

const tabTitles = {
  explorar: 'Explorar Anúncios',
  favoritos: 'Favoritos',
  'minhas-compras': 'Minhas Compras',
  perfil: 'Perfil',
  painel: 'Painel de Controle',
  'meus-anuncios': 'Meus Anúncios',
  'novo-anuncio': 'Novo Anúncio',
  configuracoes: 'Configurações',
  anuncios: 'Anúncios',
  usuarios: 'Usuários',
  relatorios: 'Relatórios'
};

const getErrorMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

const Sidebar = ({ role, activeTab, setActiveTab, onLogout, user }) => (
  <div className="sidebar" style={{ width: 230, minHeight: '100vh', padding: '24px 14px', display: 'flex', flexDirection: 'column' }}>
    <div style={{ marginBottom: 32 }}>
      <span className="playfair gold-text" style={{ fontSize: 20, fontWeight: 700 }}>Prime Venda</span>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(201,168,76,.06)', border: '1px solid rgba(201,168,76,.12)', borderRadius: 12, padding: '10px 12px' }}>
        {user?.profileImage ? (
          <img src={user.profileImage} alt="Avatar" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold),var(--amber))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{ROLE_ICON[role]}</div>
        )}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{user?.name || 'Usuário'}</p>
          <p style={{ fontSize: 11, color: 'var(--gold)', marginTop: 2 }}>{user?.email || ''}</p>
        </div>
      </div>
    </div>

    <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
      {/* Abas baseadas no role */}
      {role === 'usuario' && TABS.usuario.map(tab => (
        <div 
          key={tab} 
          className={`nav-item ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
          style={{ cursor: 'pointer' }}
        >
          {TAB_META[tab]?.icon && <Ic name={TAB_META[tab].icon} size={16} />} {TAB_META[tab]?.label}
        </div>
      ))}
      {role === 'vendedor' && TABS.vendedor.map(tab => (
        <div 
          key={tab} 
          className={`nav-item ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
          style={{ cursor: 'pointer' }}
        >
          {TAB_META[tab]?.icon && <Ic name={TAB_META[tab].icon} size={16} />} {TAB_META[tab]?.label}
        </div>
      ))}
      {role === 'adm' && TABS.adm.map(tab => (
        <div 
          key={tab} 
          className={`nav-item ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
          style={{ cursor: 'pointer' }}
        >
          {TAB_META[tab]?.icon && <Ic name={TAB_META[tab].icon} size={16} />} {TAB_META[tab]?.label}
        </div>
      ))}
    </nav>

    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
      <div className="nav-item" onClick={onLogout} style={{ cursor: 'pointer' }}>
        <Ic name="logout" size={16} /> Sair
      </div>
    </div>
  </div>
);

const Header = ({ title, role }) => (
  <div className="top-bar">
    <h1 className="playfair" style={{ fontSize: 20, fontWeight: 600 }}>{title}</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={logo} alt="Logo" style={{ height: 40, maxWidth: 200, objectFit: 'contain' }} />
    </div>
  </div>
);

// Componente para Usuário
// Agora extraído para frontend/src/pages/Dashboard/components/UsuarioDashboard.jsx

// Componente para Vendedor
// Agora extraído para frontend/src/pages/Dashboard/components/VendedorDashboard.jsx

// Componente para Admin
// Agora extraído para frontend/src/pages/Dashboard/components/AdminDashboard.jsx

const SettingsTab = ({ role, user }) => {
  const [settings, setSettings] = useState({
    darkMode: false,
    receiveEmails: true,
    receiveSMS: false,
    publicProfile: role === 'vendedor',
    autoApproveLeads: role === 'vendedor',
    weeklySummary: true,
    propertyRecommendations: true
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserSettings();
        const prefs = response.data.preferences || {};
        setSettings({
          darkMode: prefs.darkMode ?? false,
          receiveEmails: prefs.receiveEmails ?? true,
          receiveSMS: prefs.receiveSMS ?? false,
          publicProfile: prefs.publicProfile ?? (role === 'vendedor'),
          autoApproveLeads: prefs.autoApproveLeads ?? (role === 'vendedor'),
          weeklySummary: prefs.weeklySummary ?? true,
          propertyRecommendations: prefs.propertyRecommendations ?? true
        });
      } catch (err) {
        console.error('Erro ao carregar configurações:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else if (err.response?.status === 404) {
          setError('Configurações não encontradas. Usando valores padrão.');
          setSettings({
            darkMode: false,
            receiveEmails: true,
            receiveSMS: false,
            publicProfile: role === 'vendedor',
            autoApproveLeads: role === 'vendedor',
            weeklySummary: true,
            propertyRecommendations: true
          });
        } else {
          setError('Não foi possível carregar suas configurações.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.id, role]);

  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [settings.darkMode]);

  const handleSave = async () => {
    try {
      setError('');
      await updateUserSettings({
        preferences: {
          darkMode: settings.darkMode,
          receiveEmails: settings.receiveEmails,
          receiveSMS: settings.receiveSMS,
          publicProfile: settings.publicProfile,
          autoApproveLeads: settings.autoApproveLeads,
          weeklySummary: settings.weeklySummary,
          propertyRecommendations: settings.propertyRecommendations
        },
        notificationsEnabled: settings.receiveEmails || settings.receiveSMS
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err.response?.data || err.message);
      setError(getErrorMessage(err, 'Erro ao salvar configurações.'));
    }
  };

  const handleReset = () => {
    setSettings({
      darkMode: false,
      receiveEmails: true,
      receiveSMS: false,
      publicProfile: role === 'vendedor',
      autoApproveLeads: role === 'vendedor',
      weeklySummary: true,
      propertyRecommendations: true
    });
    setSaved(false);
    setError('');
  };

  if (loading) {
    return <div className="fade-up"><p>Carregando configurações...</p></div>;
  }

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Configurações</h2>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'grid', gap: 18 }}>
        <div>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Notificações</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.receiveEmails} onChange={(e) => setSettings({ ...settings, receiveEmails: e.target.checked })} />
            <span>Receber alertas por e-mail</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.receiveSMS} onChange={(e) => setSettings({ ...settings, receiveSMS: e.target.checked })} />
            <span>Receber alertas por SMS</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.weeklySummary} onChange={(e) => setSettings({ ...settings, weeklySummary: e.target.checked })} />
            <span>Resumo semanal de imóveis e leads</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.propertyRecommendations} onChange={(e) => setSettings({ ...settings, propertyRecommendations: e.target.checked })} />
            <span>Receber recomendações de imóveis</span>
          </label>
        </div>

        <div>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Experiência</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.darkMode} onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })} />
            <span>Ativar modo escuro</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.publicProfile} onChange={(e) => setSettings({ ...settings, publicProfile: e.target.checked })} />
            <span>Perfil público para clientes e corretores</span>
          </label>
          {role === 'vendedor' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.autoApproveLeads} onChange={(e) => setSettings({ ...settings, autoApproveLeads: e.target.checked })} />
              <span>Autoaprovar leads recebidos</span>
            </label>
          )}
        </div>

        {error && <p style={{ color: 'var(--red)', margin: 0 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-gold" onClick={handleSave}>Salvar configurações</button>
          <button className="btn-secondary" type="button" onClick={handleReset}>Reiniciar padrões</button>
        </div>
        {saved && <p style={{ color: 'var(--green)', margin: 0 }}>Configurações salvas com sucesso!</p>}
      </div>
    </div>
  );
};

const MeusAnunciosTab = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getMyProperties();
        setProperties(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Não foi possível carregar seus anúncios.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refresh]);

  if (loading) return <div className="fade-up"><p>Carregando seus anúncios...</p></div>;
  if (error) return <div className="fade-up"><p className="error">{error}</p></div>;

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>Meus Anúncios</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Veja todos os seus anúncios cadastrados e gerencie suas publicações.</p>
        </div>
        <button className="btn-gold" onClick={() => navigate('/properties/my', { state: { openNew: true } })}>➕ Novo Anúncio</button>
      </div>

      {properties.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <h3>Você ainda não tem anúncios</h3>
          <p style={{ color: 'var(--muted)', margin: '16px 0' }}>Crie seu primeiro anúncio agora e coloque sua oferta no ar.</p>
          <button className="btn-gold" onClick={() => navigate('/properties/my', { state: { openNew: true } })}>Criar Anúncio</button>
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td>{property.title}</td>
                  <td>{property.type}</td>
                  <td>{fmt(property.price)}</td>
                  <td><StatusBadge status={property.status} /></td>
                  <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn-ghost" onClick={() => navigate('/properties/my', { state: { editId: property.id } })}>Editar</button>
                    <button className="btn-ghost" onClick={() => navigate('/properties/my', { state: { editId: property.id } })}>Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const NovoAnuncioTab = () => {
  const navigate = useNavigate();

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>Novo Anúncio</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Cadastre um novo imóvel e comece a receber contatos de interessados.</p>
        </div>
        <button className="btn-gold" onClick={() => navigate('/properties/my', { state: { openNew: true } })}>Abrir formulário</button>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Crie seu anúncio em poucos passos</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--muted)', lineHeight: 1.8 }}>
          <li>Descreva o imóvel de forma clara e atrativa.</li>
          <li>Escolha o tipo, preço e localização.</li>
          <li>Adicione fotos e detalhes para destacar seu anúncio.</li>
          <li>Publique e acompanhe o desempenho pelo painel.</li>
        </ul>
      </div>
    </div>
  );
};

const PerfilTab = ({ role, user, onUserUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage || '');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
    cpfCnpj: user?.cpfCnpj || '',
    company: user?.company || '',
    creci: user?.creci || '',
    website: user?.website || ''
  });

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      profileImage: user?.profileImage || '',
      cpfCnpj: user?.cpfCnpj || '',
      company: user?.company || '',
      creci: user?.creci || '',
      website: user?.website || ''
    });
    setPreview(user?.profileImage || '');
    setAvatarFile(null);
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Escolha um arquivo de imagem válido.');
      return;
    }
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      let profileImage = formData.profileImage;

      if (avatarFile) {
        const uploadResponse = await uploadAvatar(avatarFile);
        profileImage = uploadResponse.data.profileImage;
        setPreview(profileImage);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profileImage,
        cpfCnpj: formData.cpfCnpj,
        company: formData.company,
        creci: formData.creci,
        website: formData.website
      };

      const response = await updateCurrentUser(payload);
      onUserUpdate(response.data);
      setEditing(false);
      setAvatarFile(null);
      setPreview(response.data.profileImage || '');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError(getErrorMessage(err, 'Erro ao atualizar perfil.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Meu Perfil</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Informações Pessoais</h3>
            <button
              className={editing ? 'btn-secondary' : 'btn-gold'}
              onClick={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving}
            >
              {saving ? 'Salvando...' : editing ? 'Salvar' : 'Editar'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Nome</label>
              <input className="inp" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!editing} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>E-mail</label>
              <input className="inp" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!editing} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Telefone</label>
              <input className="inp" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!editing} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Tipo de Conta</label>
              <input className="inp" value={ROLE_LABEL[role] || role} disabled />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Foto de Perfil (URL)</label>
            <input className="inp" value={formData.profileImage} onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })} disabled={!editing} placeholder="https://..." />
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Upload de Arquivo</label>
            <input
              className="inp"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={!editing}
            />
          </div>

          {role === 'usuario' && (
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>CPF / CNPJ</label>
              <input className="inp" value={formData.cpfCnpj} onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })} disabled={!editing} />
            </div>
          )}

          {role === 'vendedor' && (
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Empresa</label>
                <input className="inp" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} disabled={!editing} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>CRECI</label>
                <input className="inp" value={formData.creci} onChange={(e) => setFormData({ ...formData, creci: e.target.value })} disabled={!editing} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Website / Portfólio</label>
                <input className="inp" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} disabled={!editing} placeholder="https://..." />
              </div>
            </div>
          )}

          {error && <p style={{ color: 'var(--red)', marginTop: 14 }}>{error}</p>}
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,.1)' }}>
            {preview ? (
              <img src={preview} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ color: 'var(--gold)', fontSize: 48 }}>{ROLE_ICON[role]}</div>
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>Foto de perfil</p>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>Envie um arquivo ou use uma URL.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{user?.name || 'Nome do usuário'}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UsuarioFavoritesTab = () => {
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await getMyFavorites();
        setFavorites(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Erro ao carregar favoritos.'));
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const handleRemove = async (propertyId) => {
    try {
      await removeFavorite(propertyId);
      setFavorites((prev) => prev.filter((favorite) => favorite.propertyId !== propertyId));
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao remover favorito.'));
    }
  };

  if (loading) return <div className="fade-up"><p>Carregando favoritos...</p></div>;
  if (error) return <div className="fade-up"><p className="error">{error}</p></div>;

  return (
    <div className="fade-up">
      {selected && <ListingModal item={selected} onClose={() => setSelected(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>Favoritos</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Acesse seus anúncios favoritos para comparar e decidir com calma.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <h3>Nenhum favorito ainda</h3>
          <p style={{ color: 'var(--muted)', margin: '16px 0' }}>Marque anúncios como favoritos para encontrá-los rapidamente.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {favorites.map((favorite) => {
            const item = favorite.Property || favorite.property;
            if (!item) return null;
            return (
              <div key={favorite.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <img src={item.image || 'https://via.placeholder.com/400'} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 14 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{item.title || 'Anúncio favorito'}</h3>
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--muted)' }}>{item.type ? `${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}` : 'Imóvel'}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{fmt(item.price || 0)}</span>
                    <StatusBadge status={item.status || 'disponivel'} />
                  </div>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12 }}>{item.city || item.location || item.state || 'Localização não disponível'}</p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn-secondary" onClick={() => setSelected(item)}>Ver detalhes</button>
                    <button className="btn-ghost" onClick={() => handleRemove(item.id)}>Remover</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const UsuarioPurchasesTab = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const response = await getMyPurchases();
        setPurchases(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Erro ao carregar suas compras.'));
      } finally {
        setLoading(false);
      }
    };
    loadPurchases();
  }, []);

  if (loading) return <div className="fade-up"><p>Carregando compras...</p></div>;
  if (error) return <div className="fade-up"><p className="error">{error}</p></div>;

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>Minhas Compras</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Acompanhe seu histórico de compras concluídas e anúncios finalizados.</p>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <h3>Nenhuma compra concluída</h3>
          <p style={{ color: 'var(--muted)', margin: '16px 0' }}>Quando uma compra for finalizada, ela aparecerá aqui automaticamente.</p>
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>Anúncio</th>
                <th>Vendedor</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => {
                const property = purchase.Property || purchase.property || {};
                return (
                  <tr key={purchase.id}>
                    <td>{property.title || 'Anúncio fechado'}</td>
                    <td>{purchase.seller?.name || '—'}</td>
                    <td>{fmt(property.price || 0)}</td>
                    <td><StatusBadge status={property.status || 'vendido'} /></td>
                    <td>{formatDate(purchase.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const TabContent = ({ role, tab, user, onUserUpdate }) => {
  if (role === 'usuario') {
    if (tab === 'explorar') return <UsuarioDashboard user={user} onUserUpdate={onUserUpdate} />;
    if (tab === 'favoritos') return <UsuarioFavoritesTab />;
    if (tab === 'minhas-compras') return <UsuarioPurchasesTab />;
    if (tab === 'configuracoes') return <SettingsTab role="usuario" user={user} />;
    if (tab === 'perfil') return <PerfilTab role="usuario" user={user} onUserUpdate={onUserUpdate} />;
  }

  if (role === 'vendedor') {
    if (tab === 'painel') return <VendedorDashboard user={user} onUserUpdate={onUserUpdate} />;
    if (tab === 'meus-anuncios') return <MeusAnunciosTab />;
    if (tab === 'novo-anuncio') return <NovoAnuncioTab />;
    if (tab === 'configuracoes') return <SettingsTab role="vendedor" user={user} />;
    if (tab === 'perfil') return <PerfilTab role="vendedor" user={user} onUserUpdate={onUserUpdate} />;
  }

  if (role === 'adm') {
    if (tab === 'painel') return <AdminDashboard user={user} onUserUpdate={onUserUpdate} />;
    if (tab === 'usuarios') return <UsersPage />;
    if (tab === 'perfil') return <PerfilTab role="adm" user={user} onUserUpdate={onUserUpdate} />;
    if (tab === 'relatorios') return <div className="fade-up"><h2>Relatórios</h2><p>Funcionalidade em desenvolvimento...</p></div>;
    if (tab === 'configuracoes') return <SettingsTab role="adm" user={user} />;
  }

  return <div className="fade-up"><h2>Conteúdo não encontrado</h2></div>;
};

export default function DashboardPage() {
  const { user, setUser, loading, signout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);

  const normalizeRole = (role) => {
    if (role === 'user') return 'usuario';
    if (role === 'admin') return 'adm';
    return role;
  };

  const roleKey = normalizeRole(user?.role);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && TABS[roleKey]) {
      setActiveTab((prev) => prev || TABS[roleKey][0]);
    }
  }, [user, roleKey]);

  const handleLogout = () => {
    signout();
    navigate('/login');
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c0e13', color: '#e8e4dc' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) return null;
  if (!activeTab) return null;

  return (
    <>
      <PrimeVendaTheme />
      <div className="page-shell">
        <Sidebar role={roleKey} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user} />
        <div className="dashboard-main">
          <Header title={tabTitles[activeTab] || 'Dashboard'} role={roleKey} />
          <div className="dashboard-content">
            <TabContent role={roleKey} tab={activeTab} user={user} onUserUpdate={handleUserUpdate} />
          </div>
        </div>
      </div>
    </>
  );
}
