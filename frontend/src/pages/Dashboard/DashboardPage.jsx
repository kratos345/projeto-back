import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMyProperties, deleteProperty, getProperties } from '../../api/properties';
import { updateCurrentUser, getUsers, deleteUser } from '../../api/users';
import { getAdminMetrics, getSellerMetrics } from '../../api/dashboard';
import PrimeVendaTheme from '../../components/PrimeVendaTheme';

const PROPERTIES = [
  { id: 1, type: 'imovel', category: 'Casa', title: 'Casa Moderna em Alphaville', price: 980000, location: 'Barueri, SP', beds: 4, baths: 3, area: 320, status: 'disponivel', seller: 'Carlos M.', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', description: 'Linda casa moderna com acabamento premium, piscina, churrasqueira e jardim.', featured: true },
  { id: 2, type: 'imovel', category: 'Apartamento', title: 'Apê Luxo Beira-Mar', price: 1450000, location: 'Balneário Camboriú, SC', beds: 3, baths: 2, area: 140, status: 'disponivel', seller: 'Ana S.', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', description: 'Apartamento de alto padrão com vista panorâmica para o mar.', featured: true },
  { id: 3, type: 'imovel', category: 'Cobertura', title: 'Cobertura Duplex Jardins', price: 2800000, location: 'São Paulo, SP', beds: 5, baths: 4, area: 480, status: 'negociando', seller: 'Roberto F.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', description: 'Cobertura exclusiva no coração dos Jardins, terraço gourmet.', featured: false },
  { id: 4, type: 'imovel', category: 'Terreno', title: 'Terreno Condomínio Fechado', price: 320000, location: 'Campinas, SP', beds: 0, baths: 0, area: 600, status: 'disponivel', seller: 'Lucia T.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', description: 'Terreno plano em condomínio de alto padrão, toda infraestrutura.', featured: false },
  { id: 5, type: 'imovel', category: 'Casa', title: 'Casa de Praia Guarujá', price: 750000, location: 'Guarujá, SP', beds: 3, baths: 2, area: 200, status: 'vendido', seller: 'Paulo R.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', description: 'Casa encantadora a 200m da praia com deck e área de lazer.', featured: false },
];

const VEHICLES = [
  { id: 6, type: 'veiculo', category: 'SUV', title: 'BMW X5 M Sport 2024', price: 520000, location: 'São Paulo, SP', year: 2024, km: 8000, color: 'Preto', status: 'disponivel', seller: 'Carlos M.', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80', description: 'BMW X5 M Sport impecável, único dono, todos os adicionais de fábrica.', featured: true },
  { id: 7, type: 'veiculo', category: 'Sedan', title: 'Mercedes-Benz C300 2023', price: 368000, location: 'Curitiba, PR', year: 2023, km: 22000, color: 'Prata', status: 'disponivel', seller: 'Ana S.', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80', description: 'C300 em perfeito estado, interior caramelo, teto solar panorâmico.', featured: false },
  { id: 8, type: 'veiculo', category: 'Esportivo', title: 'Porsche 911 Carrera GTS', price: 1250000, location: 'Rio de Janeiro, RJ', year: 2022, km: 15000, color: 'Vermelho', status: 'negociando', seller: 'Roberto F.', image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600&q=80', description: '911 GTS ícone, motor 450cv, cambio PDK, pacote Sport Chrono.', featured: true },
  { id: 9, type: 'veiculo', category: 'Pickup', title: 'Ram 2500 Limited 2024', price: 420000, location: 'Brasília, DF', year: 2024, km: 5000, color: 'Branco', status: 'disponivel', seller: 'Lucia T.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', description: 'Ram 2500 diesel, interior couro premium, já emplacada.', featured: false },
  { id: 10, type: 'veiculo', category: 'Hatch', title: 'VW Golf GTI 2023', price: 198000, location: 'Porto Alegre, RS', year: 2023, km: 30000, color: 'Azul', status: 'vendido', seller: 'Paulo R.', image: 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&q=80', description: 'GTI completo, bancos alvins, rodas 18", impecável.', featured: false },
];

const ALL_LISTINGS = [...PROPERTIES, ...VEHICLES];

const USERS_MOCK = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', role: 'usuario', status: 'ativo', joined: '12/01/2025', purchases: 2 },
  { id: 2, name: 'Maria Oliveira', email: 'maria@email.com', role: 'vendedor', status: 'ativo', joined: '05/03/2025', purchases: 0 },
  { id: 3, name: 'Carlos Mendes', email: 'carlos@email.com', role: 'vendedor', status: 'ativo', joined: '20/11/2024', purchases: 0 },
  { id: 4, name: 'Ana Santos', email: 'ana@email.com', role: 'usuario', status: 'inativo', joined: '08/06/2024', purchases: 1 },
  { id: 5, name: 'Roberto Faria', email: 'roberto@email.com', role: 'vendedor', status: 'ativo', joined: '15/09/2024', purchases: 0 },
];

const Icons = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  car: 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5a2 2 0 0 1-2 2h-2',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  chart: 'M18 20V10M12 20V4M6 20v-6',
  list: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2',
  plus: 'M12 5v14M5 12h14',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
  eye: 'M1 12s4-8 11-8 11 8-4 8-11 8-11-8-11-8z',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  building: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18h-2V5H8v17H6z',
};

const Icon = ({ d, size = 18, color = 'currentColor', fill = 'none', stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Ic = ({ name, size, color, fill, stroke }) => (
  <Icon d={Icons[name]} size={size} color={color} fill={fill} stroke={stroke} />
);

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);

const StatusBadge = ({ status }) => {
  const map = {
    disponivel: ['badge badge-green', 'Disponível'],
    negociando: ['badge badge-gold', 'Negociando'],
    vendido: ['badge badge-red', 'Vendido'],
    pendente: ['badge badge-muted', 'Pendente'],
    arquivado: ['badge badge-muted', 'Arquivado'],
    ativo: ['badge badge-green', 'Ativo'],
    inativo: ['badge badge-muted', 'Inativo'],
  };
  const [cls, label] = map[status] || ['badge badge-muted', status];
  return <span className={cls}>{label}</span>;
};

const TABS = {
  usuario: ['explorar', 'favoritos', 'minhas-compras', 'perfil'],
  vendedor: ['painel', 'meus-anuncios', 'novo-anuncio', 'configuracoes', 'perfil'],
  adm: ['painel', 'anuncios', 'usuarios', 'relatorios', 'configuracoes'],
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

const Sidebar = ({ role, activeTab, setActiveTab, onLogout, user }) => (
  <div className="sidebar" style={{ width: 230, minHeight: '100vh', padding: '24px 14px', display: 'flex', flexDirection: 'column' }}>
    <div style={{ marginBottom: 32 }}>
      <span className="playfair gold-text" style={{ fontSize: 20, fontWeight: 700 }}>PrimeVenda</span>
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
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <Ic name="bell" size={20} color="var(--muted)" />
        <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
      </div>
      <div style={{ background: 'linear-gradient(135deg,var(--gold),var(--amber))', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{ROLE_ICON[role]}</div>
    </div>
  </div>
);

// Componente para Usuário
const UsuarioDashboard = ({ user, onUserUpdate }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fade-up">
      {selected && <ListingModal item={selected} onClose={() => setSelected(null)} />}
      
      {/* Boas-vindas */}
      <div style={{ marginBottom: 32 }}>
        <h2 className="playfair" style={{ fontSize: 24, marginBottom: 8 }}>Olá, {user?.name || 'Usuário'}!</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Explore imóveis e veículos disponíveis na plataforma.</p>
      </div>

      {/* Barra de busca */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
        <input className="inp" placeholder="🔍  Buscar imóveis ou veículos..." style={{ flex: 1, minWidth: 200 }} />
        <select className="inp" style={{ width: 160 }}>
          <option>Qualquer preço</option>
          <option>Até R$ 200 mil</option>
          <option>R$ 200k – 500k</option>
          <option>R$ 500k – 1M</option>
          <option>Acima de R$ 1M</option>
        </select>
        <select className="inp" style={{ width: 160 }}>
          <option>Qualquer local</option>
          <option>São Paulo, SP</option>
          <option>Rio de Janeiro, RJ</option>
          <option>Curitiba, PR</option>
        </select>
        <button className="btn-gold" style={{ whiteSpace: 'nowrap' }}>Buscar</button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['todos', '🔎 Todos'], ['imovel', '🏠 Imóveis'], ['veiculo', '🚗 Veículos']].map(([v, l]) => (
          <button key={v} style={{ padding: '8px 18px', borderRadius: 30, border: `1.5px solid var(--gold)`, background: 'rgba(201,168,76,.1)', color: 'var(--gold)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>{l}</button>
        ))}
      </div>

      {/* Anúncios em destaque */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Anúncios em Destaque</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px,1fr))', gap: 20 }}>
          {ALL_LISTINGS.filter(i => i.featured).slice(0, 6).map((item) => <ListingCard key={item.id} item={item} onView={setSelected} />)}
        </div>
      </div>

      {/* Perfil rápido */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Meu Perfil</h3>
        <PerfilTab role="usuario" user={user} onUserUpdate={onUserUpdate} />
      </div>
    </div>
  );
};

// Componente para Vendedor
const VendedorDashboard = ({ user, onUserUpdate }) => {
  const [metrics, setMetrics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsRes, propsRes] = await Promise.all([
        getSellerMetrics(),
        getMyProperties()
      ]);
      setMetrics(metricsRes.data);
      setProperties(propsRes.data.slice(0, 5)); // Últimos 5 anúncios
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="fade-up"><p>Carregando dados do vendedor...</p></div>;
  if (error) return <div className="fade-up"><p className="error">{error}</p></div>;

  return (
    <div className="fade-up">
      {/* Boas-vindas */}
      <div style={{ marginBottom: 32 }}>
        <h2 className="playfair" style={{ fontSize: 24, marginBottom: 8 }}>Bem-vindo, {user?.name || 'Vendedor'}!</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Gerencie seus anúncios e acompanhe seu desempenho.</p>
      </div>

      {/* Métricas rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="tag" label="Anúncios totais" value={metrics.properties.total || 0} delta={metrics.properties.active ? 12 : 0} />
        <StatCard icon="users" label="Leads recebidos" value={metrics.leads.total || 0} delta={0} color="var(--blue)" />
        <StatCard icon="eye" label="Visualizações" value={metrics.stats.totalViews || 0} delta={0} color="var(--green)" />
        <StatCard icon="chart" label="Anúncios ativos" value={metrics.properties.active || 0} delta={0} color="var(--amber)" />
      </div>

      {/* Ações rápidas */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button className="btn-gold" onClick={() => navigate('/properties/new')}>➕ Novo Anúncio</button>
        <button className="btn-secondary" onClick={() => navigate('/properties/my')}>📋 Ver Todos os Anúncios</button>
        <button className="btn-secondary" onClick={() => navigate('/leads')}>💬 Ver Leads</button>
      </div>

      {/* Últimos anúncios */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Seus Últimos Anúncios</h3>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Anúncio</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={property.image || 'https://via.placeholder.com/80'} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontWeight: 500, fontSize: 13 }}>{property.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--muted)' }}>{property.type}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{fmt(property.price)}</td>
                  <td><StatusBadge status={property.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => navigate(`/properties/edit/${property.id}`)}><Ic name="edit" size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Perfil e configurações */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Perfil e Configurações</h3>
        <PerfilTab role="vendedor" user={user} onUserUpdate={onUserUpdate} />
      </div>
    </div>
  );
};

// Componente para Admin
const AdminDashboard = ({ user, onUserUpdate }) => {
  const [metrics, setMetrics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsRes, propsRes, usersRes] = await Promise.all([
        getAdminMetrics(),
        getProperties(),
        getUsers()
      ]);
      setMetrics(metricsRes.data);
      setProperties(propsRes.data.slice(0, 5)); // Últimos 5 anúncios
      setUsers(usersRes.data.slice(0, 5)); // Últimos 5 usuários
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="fade-up"><p>Carregando dados administrativos...</p></div>;
  if (error) return <div className="fade-up"><p className="error">{error}</p></div>;

  return (
    <div className="fade-up">
      {/* Boas-vindas */}
      <div style={{ marginBottom: 32 }}>
        <h2 className="playfair" style={{ fontSize: 24, marginBottom: 8 }}>Painel Administrativo</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Gerencie usuários, anúncios e configurações da plataforma.</p>
      </div>

      {/* Métricas gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="tag" label="Total de anúncios" value={metrics.properties.total || 0} delta={metrics.properties.active ? 10 : 0} />
        <StatCard icon="users" label="Vendedores" value={metrics.users.sellers || 0} delta={0} color="var(--blue)" />
        <StatCard icon="chart" label="Compradores" value={metrics.users.buyers || 0} delta={0} color="var(--green)" />
        <StatCard icon="building" label="Admins" value={metrics.users.admins || 0} delta={0} color="var(--amber)" />
      </div>

      {/* Ações rápidas */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button className="btn-gold" onClick={() => navigate('/users')}>👥 Gerenciar Usuários</button>
        <button className="btn-secondary" onClick={() => navigate('/properties/my')}>📋 Ver Anúncios</button>
        <button className="btn-secondary">📊 Ver Relatórios</button>
      </div>

      {/* Atividade recente */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Atividade Recente</h3>
        {[
          { icon: '🏠', msg: 'Novos anúncios disponíveis para revisão', time: 'Agora' },
          { icon: '👤', msg: 'Novos usuários foram criados hoje', time: 'Hoje' },
          { icon: '📩', msg: `${metrics.leads.new || 0} leads novos aguardando resposta`, time: 'Agora' },
          { icon: '✅', msg: `${metrics.leads.closed || 0} leads concluídos`, time: 'Hoje' }
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: 18 }}>{a.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13.5 }}>{a.msg}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{a.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Últimos usuários e anúncios */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Últimos Usuários</h3>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Tipo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold),var(--amber))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                          {u.role === 'vendedor' ? '🏪' : '👤'}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-muted">{u.role === 'vendedor' ? 'Vendedor' : u.role === 'adm' ? 'Administrador' : 'Usuário'}</span></td>
                    <td><StatusBadge status={u.isActive ? 'ativo' : 'inativo'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Últimos Anúncios</h3>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Anúncio</th>
                  <th>Vendedor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={item.image || item.images?.[0] || 'https://via.placeholder.com/40'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{item.title || item.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--muted)' }}>{item.seller || item.user?.name || item.user?.email || '—'}</td>
                    <td><StatusBadge status={item.status || 'pendente'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Configurações rápidas */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Configurações da Plataforma</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>Acesse as configurações completas para gerenciar regras, segurança e aparência da plataforma.</p>
        <button className="btn-secondary">⚙️ Configurações Avançadas</button>
      </div>
    </div>
  );
};

const ListingModal = ({ item, onClose }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
    <div style={{ background: 'var(--card)', borderRadius: 16, maxWidth: 600, width: '100%', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
      <div style={{ position: 'relative' }}>
        <img src={item.image} alt={item.title} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: '16px 16px 0 0' }} />
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>
      <div style={{ padding: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{item.title}</h2>
        <p style={{ color: 'var(--gold)', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{fmt(item.price)}</p>
        <p style={{ color: 'var(--muted)', marginBottom: 16 }}>{item.location}</p>
        <p style={{ lineHeight: 1.6 }}>{item.description}</p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button className="btn-gold" style={{ flex: 1 }}>💬 Entrar em Contato</button>
          <button className="btn-secondary">❤️ Favoritar</button>
        </div>
      </div>
    </div>
  </div>
);

const ListingCard = ({ item, onView }) => (
  <div className="card" onClick={() => onView(item)} style={{ cursor: 'pointer' }}>
    <img src={item.image} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: '14px 14px 0 0' }} />
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h3>
      <p style={{ color: 'var(--gold)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{fmt(item.price)}</p>
      <p style={{ color: 'var(--muted)', fontSize: 13 }}>{item.location}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {item.beds && <span style={{ fontSize: 12, color: 'var(--muted)' }}>🛏️ {item.beds}</span>}
        {item.baths && <span style={{ fontSize: 12, color: 'var(--muted)' }}>🛁 {item.baths}</span>}
        {item.area && <span style={{ fontSize: 12, color: 'var(--muted)' }}>📐 {item.area}m²</span>}
      </div>
    </div>
  </div>
);

const StatCard = ({ icon, label, value, delta, color = 'var(--gold)' }) => (
  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 48, height: 48, borderRadius: '50%', background: `rgba(${color === 'var(--gold)' ? '201,168,76' : color === 'var(--blue)' ? '59,130,246' : color === 'var(--green)' ? '34,197,94' : '245,158,11'},.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Ic name={icon} size={20} color={color} />
    </div>
    <div>
      <p style={{ fontSize: 28, fontWeight: 700, margin: 0, color }}>{value}</p>
      <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>{label}</p>
      {delta !== undefined && delta !== 0 && (
        <p style={{ fontSize: 11, color: delta > 0 ? 'var(--green)' : 'var(--red)', margin: '4px 0 0 0' }}>
          {delta > 0 ? '+' : ''}{delta}% vs mês anterior
        </p>
      )}
    </div>
  </div>
);

const SettingsTab = ({ role, user }) => {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    publicProfile: role === 'vendedor',
    autoApproveLeads: role === 'vendedor'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(`settings_${user?.email}`);
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, [user?.email]);

  const handleSave = () => {
    window.localStorage.setItem(`settings_${user?.email}`, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Configurações</h2>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'grid', gap: 18 }}>
        <div>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Preferências de Notificação</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.emailAlerts} onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })} />
            <span>Receber alertas por e-mail</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.smsAlerts} onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })} />
            <span>Receber alertas por SMS</span>
          </label>
        </div>

        {role === 'vendedor' ? (
          <div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Preferências do Vendedor</p>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.publicProfile} onChange={(e) => setSettings({ ...settings, publicProfile: e.target.checked })} />
              <span>Perfil público para novos clientes</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.autoApproveLeads} onChange={(e) => setSettings({ ...settings, autoApproveLeads: e.target.checked })} />
              <span>Receber leads automaticamente</span>
            </label>
          </div>
        ) : (
          <div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Conta do Comprador</p>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.publicProfile} onChange={(e) => setSettings({ ...settings, publicProfile: e.target.checked })} />
              <span>Perfil visível para corretores selecionados</span>
            </label>
          </div>
        )}

        <button className="btn-gold" onClick={handleSave}>Salvar configurações</button>
        {saved && <p style={{ color: 'var(--green)', margin: 0 }}>Configurações salvas!</p>}
      </div>
    </div>
  );
};

const PerfilTab = ({ role, user, onUserUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profileImage: formData.profileImage,
        cpfCnpj: formData.cpfCnpj,
        company: formData.company,
        creci: formData.creci,
        website: formData.website
      };
      const response = await updateCurrentUser(payload);
      onUserUpdate(response.data);
      setEditing(false);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError(err?.response?.data?.message || 'Erro ao atualizar perfil.');
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
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ color: 'var(--gold)', fontSize: 48 }}>{ROLE_ICON[role]}</div>
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>Foto de perfil</p>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>Cole a URL da imagem para atualizar</p>
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

const TabContent = ({ role, tab, user, onUserUpdate }) => {
  if (role === 'usuario') {
    if (tab === 'explorar') return <UsuarioDashboard user={user} onUserUpdate={onUserUpdate} />;
    if (tab === 'favoritos') return <div className="fade-up"><h2>Favoritos</h2><p>Funcionalidade em desenvolvimento...</p></div>;
    if (tab === 'minhas-compras') return <div className="fade-up"><h2>Minhas Compras</h2><p>Funcionalidade em desenvolvimento...</p></div>;
    if (tab === 'configuracoes') return <SettingsTab role="usuario" user={user} />;
    if (tab === 'perfil') return <PerfilTab role="usuario" user={user} onUserUpdate={onUserUpdate} />;
  }

  if (role === 'vendedor') {
    if (tab === 'painel') return <VendedorDashboard user={user} onUserUpdate={onUserUpdate} />;
    if (tab === 'meus-anuncios') return <div className="fade-up"><h2>Meus Anúncios</h2><p>Redirecionando...</p></div>;
    if (tab === 'novo-anuncio') return <div className="fade-up"><h2>Novo Anúncio</h2><p>Redirecionando...</p></div>;
    if (tab === 'configuracoes') return <SettingsTab role="vendedor" user={user} />;
    if (tab === 'perfil') return <PerfilTab role="vendedor" user={user} onUserUpdate={onUserUpdate} />;
  }

  if (role === 'adm') {
    if (tab === 'painel') return <AdminDashboard user={user} onUserUpdate={onUserUpdate} />;
    if (tab === 'anuncios') return <div className="fade-up"><h2>Anúncios</h2><p>Funcionalidade em desenvolvimento...</p></div>;
    if (tab === 'usuarios') return <div className="fade-up"><h2>Usuários</h2><p>Funcionalidade em desenvolvimento...</p></div>;
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
