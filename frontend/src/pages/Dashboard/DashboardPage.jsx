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
      {TABS[role].map((tab) => (
        <div key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
          <Ic name={TAB_META[tab].icon} size={16} />
          {TAB_META[tab].label}
        </div>
      ))}
    </nav>

    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
      <div className="nav-item" onClick={onLogout}>
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

const ListingCard = ({ item, onView }) => (
  <div className="card" style={{ cursor: 'pointer' }} onClick={() => onView && onView(item)}>
    <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.06)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      />
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
        <span className="badge badge-muted">{item.type === 'imovel' ? '🏠' : '🚗'} {item.category}</span>
        {item.featured && <span className="badge badge-gold">⭐ Destaque</span>}
      </div>
      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        <StatusBadge status={item.status} />
      </div>
    </div>
    <div style={{ padding: '18px 20px' }}>
      <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Ic name="map" size={11} /> {item.location}
      </p>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 10, lineHeight: 1.3 }}>{item.title}</h3>
      <p style={{ fontSize: 22, fontWeight: 700, background: 'linear-gradient(135deg,var(--gold),var(--amber))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 12 }}>{fmt(item.price)}</p>
      {item.type === 'imovel' ? (
        <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--muted)' }}>
          {item.beds > 0 && <span>🛏 {item.beds} quartos</span>}
          {item.baths > 0 && <span>🚿 {item.baths} banheiros</span>}
          <span>📐 {item.area}m²</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--muted)' }}>
          <span>📅 {item.year}</span>
          <span>🛣 {item.km?.toLocaleString('pt-BR')} km</span>
          <span>🎨 {item.color}</span>
        </div>
      )}
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Vendedor: <span style={{ color: 'var(--text)' }}>{item.seller}</span></span>
        <button className="btn-gold" style={{ padding: '7px 16px', fontSize: 12 }}>Ver detalhes</button>
      </div>
    </div>
  </div>
);

const ListingModal = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <img src={item.image} alt={item.title} style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span className="badge badge-muted">{item.category}</span>
                <StatusBadge status={item.status} />
                {item.featured && <span className="badge badge-gold">⭐ Destaque</span>}
              </div>
              <h2 className="playfair" style={{ fontSize: 22, fontWeight: 700 }}>{item.title}</h2>
            </div>
            <button onClick={onClose} style={{ background: 'var(--border)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700, background: 'linear-gradient(135deg,var(--gold),var(--amber))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 12 }}>{fmt(item.price)}</p>
          <p style={{ color: 'var(--muted)', fontSize: 13, display: 'flex', gap: 6, marginBottom: 18 }}><Ic name="map" size={14} /> {item.location}</p>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{item.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: 12, marginBottom: 24 }}>
            {item.type === 'imovel' ? (
              <>
                {item.beds > 0 && <div className="stat-card" style={{ padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20 }}>🛏</div><div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{item.beds} quartos</div></div>}
                {item.baths > 0 && <div className="stat-card" style={{ padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20 }}>🚿</div><div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{item.baths} banheiros</div></div>}
                <div className="stat-card" style={{ padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20 }}>📐</div><div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{item.area}m²</div></div>
              </>
            ) : (
              <>
                <div className="stat-card" style={{ padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20 }}>📅</div><div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{item.year}</div></div>
                <div className="stat-card" style={{ padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20 }}>🛣</div><div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{item.km?.toLocaleString('pt-BR')} km</div></div>
                <div className="stat-card" style={{ padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20 }}>🎨</div><div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{item.color}</div></div>
              </>
            )}
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--muted)' }}>Anunciado por</p>
              <p style={{ fontWeight: 600 }}>{item.seller}</p>
            </div>
            <button className="btn-gold">Entrar em contato</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExplorarTab = () => {
  const [filter, setFilter] = useState('todos');
  const [selected, setSelected] = useState(null);
  const filtered = filter === 'todos' ? ALL_LISTINGS : ALL_LISTINGS.filter((i) => i.type === filter);

  return (
    <div className="fade-up">
      {selected && <ListingModal item={selected} onClose={() => setSelected(null)} />}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['todos', '🔎 Todos'], ['imovel', '🏠 Imóveis'], ['veiculo', '🚗 Veículos']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: '8px 18px', borderRadius: 30, border: `1.5px solid ${filter === v ? 'var(--gold)' : 'var(--border)'}`, background: filter === v ? 'rgba(201,168,76,.1)' : 'transparent', color: filter === v ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all .2s' }}>{l}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px,1fr))', gap: 20 }}>
        {filtered.map((item) => <ListingCard key={item.id} item={item} onView={setSelected} />)}
      </div>
    </div>
  );
};

const FavoritosTab = () => {
  const favs = ALL_LISTINGS.filter((i) => i.featured);
  const [selected, setSelected] = useState(null);
  return (
    <div className="fade-up">
      {selected && <ListingModal item={selected} onClose={() => setSelected(null)} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>{favs.length} itens salvos</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px,1fr))', gap: 20 }}>
        {favs.map((item) => <ListingCard key={item.id} item={item} onView={setSelected} />)}
      </div>
    </div>
  );
};

const MinhasComprasTab = () => {
  const vendidos = ALL_LISTINGS.filter((i) => i.status === 'vendido');
  const [selected, setSelected] = useState(null);
  return (
    <div className="fade-up">
      {selected && <ListingModal item={selected} onClose={() => setSelected(null)} />}
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>{vendidos.length} compra(s) registrada(s)</p>
      {vendidos.map((item) => (
        <div key={item.id} className="card" style={{ marginBottom: 16, display: 'flex', overflow: 'hidden' }}>
          <img src={item.image} alt="" style={{ width: 160, objectFit: 'cover' }} />
          <div style={{ padding: 20, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="badge badge-muted">{item.category}</span>
              <StatusBadge status={item.status} />
            </div>
            <h3 className="playfair" style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{item.title}</h3>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>{fmt(item.price)}</p>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>{item.location}</p>
            <button className="btn-ghost" style={{ marginTop: 12, padding: '7px 16px', fontSize: 12 }} onClick={() => setSelected(item)}>Ver comprovante</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const PerfilTab = ({ role, user, onUserUpdate }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpfCnpj: user?.cpfCnpj || '',
    company: user?.company || '',
    creci: user?.creci || '',
    website: user?.website || '',
    profileImage: user?.profileImage || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      cpfCnpj: user?.cpfCnpj || '',
      company: user?.company || '',
      creci: user?.creci || '',
      website: user?.website || '',
      profileImage: user?.profileImage || ''
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (form.password && form.password !== form.confirmPassword) {
      return setError('As senhas não coincidem.');
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        cpfCnpj: form.cpfCnpj,
        company: form.company,
        creci: form.creci,
        website: form.website,
        profileImage: form.profileImage
      };
      if (form.password) payload.password = form.password;

      const response = await updateCurrentUser(payload);
      onUserUpdate(response.data);
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setMessage('Perfil atualizado com sucesso.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up" style={{ maxWidth: 720 }}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', background: 'var(--border)' }}>
            {form.profileImage ? (
              <img src={form.profileImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: 'var(--gold)' }}>{ROLE_ICON[role]}</div>
            )}
          </div>
          <div>
            <h2 className="playfair" style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{user?.name || 'Meu Perfil'}</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{user?.email}</p>
            <span className="badge badge-gold" style={{ marginTop: 6 }}>{ROLE_LABEL[role]}</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'grid', gap: 12 }}>
            <label className="form-label">Foto de perfil</label>
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input name="name" value={form.name} onChange={handleChange} className="form-input" disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" disabled={loading} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="form-input" disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label">CPF/CNPJ</label>
              <input name="cpfCnpj" value={form.cpfCnpj} onChange={handleChange} className="form-input" disabled={loading} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Empresa / Corretor</label>
              <input name="company" value={form.company} onChange={handleChange} className="form-input" disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label">CRECI</label>
              <input name="creci" value={form.creci} onChange={handleChange} className="form-input" disabled={loading} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Website / Redes sociais</label>
            <input name="website" value={form.website} onChange={handleChange} className="form-input" disabled={loading} />
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <label className="form-label">Alterar senha</label>
            <div className="form-row">
              <div className="form-group">
                <input name="password" type="password" value={form.password} onChange={handleChange} className="form-input" placeholder="Nova senha" disabled={loading} />
              </div>
              <div className="form-group">
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="form-input" placeholder="Confirmar senha" disabled={loading} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-gold" style={{ padding: '12px 32px', width: 'fit-content' }} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar perfil'}
          </button>
        </div>
      </form>
    </div>
  );
};

const StatCard = ({ icon, label, value, delta, color = 'var(--gold)' }) => (
  <div className="stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 700, color }}>{value}</p>
        {delta && <p style={{ fontSize: 12, color: delta > 0 ? 'var(--green)' : 'var(--red)', marginTop: 4 }}>{delta > 0 ? '▲' : '▼'} {Math.abs(delta)}% vs. mês ant.</p>}
      </div>
      <div style={{ background: `${color}18`, borderRadius: 10, padding: 10 }}>
        <Ic name={icon} size={20} color={color} />
      </div>
    </div>
  </div>
);

const PainelVendedorTab = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getSellerMetrics();
        setMetrics(response.data);
      } catch (err) {
        setError('Erro ao carregar métricas do vendedor');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="fade-up"><p>Carregando métricas...</p></div>;
  if (error) return <div className="fade-up"><p className="error">{error}</p></div>;

  return (
    <div className="fade-up">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="tag" label="Anúncios totais" value={metrics.properties.total || 0} delta={metrics.properties.active ? 12 : 0} />
        <StatCard icon="users" label="Leads recebidos" value={metrics.leads.total || 0} delta={0} color="var(--blue)" />
        <StatCard icon="eye" label="Visualizações totais" value={metrics.stats.totalViews || 0} delta={0} color="var(--green)" />
        <StatCard icon="chart" label="Anúncios ativos" value={metrics.properties.active || 0} delta={0} color="var(--amber)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Status dos leads</h3>
          {metrics.leads.perStatus?.length > 0 ? metrics.leads.perStatus.map((item) => (
            <div key={item.status} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 13 }}>{item.status}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{item.count}</span>
            </div>
          )) : <p style={{ color: 'var(--muted)' }}>Nenhum lead registrado ainda.</p>}
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Resumo</h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Você possui {metrics.properties.total || 0} anúncios no sistema.</p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Ativos: {metrics.properties.active || 0}</p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Vencidos/pendentes: {(metrics.properties.total || 0) - (metrics.properties.active || 0)}</p>
        </div>
      </div>
    </div>
  );
};

const MeusAnunciosTab = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await getMyProperties();
      setProperties(response.data);
    } catch (err) {
      setError('Erro ao carregar seus anúncios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este anúncio?')) return;
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Erro ao deletar anúncio');
    }
  };

  if (loading) {
    return <div className="fade-up"><p>Carregando seus anúncios...</p></div>;
  }

  if (error) {
    return <div className="fade-up"><p className="error">{error}</p></div>;
  }

  return (
    <div className="fade-up">
      {selected && <ListingModal item={selected} onClose={() => setSelected(null)} />}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Anúncio</th>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Local</th>
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
                <td><span className="chip">{property.type}</span></td>
                <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{fmt(property.price)}</td>
                <td style={{ fontSize: 13, color: 'var(--muted)' }}>{property.city}</td>
                <td><StatusBadge status={property.status} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setSelected(property)}>Ver</button>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => navigate(`/properties/edit/${property.id}`)}><Ic name="edit" size={12} /></button>
                    <button className="btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(property.id)}><Ic name="trash" size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NovoAnuncioTab = () => {
  const [tipo, setTipo] = useState('imovel');
  const navigate = useNavigate();

  return (
    <div className="fade-up" style={{ maxWidth: 680 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
        {[['imovel', '🏠 Imóvel'], ['veiculo', '🚗 Veículo']].map(([v, l]) => (
          <button key={v} onClick={() => setTipo(v)} style={{ padding: '12px 20px', border: `1.5px solid ${tipo === v ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 10, background: tipo === v ? 'rgba(201,168,76,.1)' : 'transparent', color: tipo === v ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .2s' }}>{l}</button>
        ))}
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>Use a página de cadastro para publicar seu novo anúncio.</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Tipo selecionado</div>
            <strong>{tipo === 'imovel' ? 'Imóvel' : 'Veículo'}</strong>
          </div>
          <button className="btn-gold" style={{ padding: '13px 28px' }} onClick={() => navigate('/properties/new')}>
            Criar novo anúncio
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfiguracoesSeller = () => {
  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem('sellerSettings')) || {
      company: 'Minha Imobiliária',
      creci: '000000-SP',
      phone: '',
      whatsapp: '',
      website: '',
      adDuration: '30 dias',
      autoHighlight: 'Sim',
      autoReply: 'Ativada',
      notifications: {
        contact: true,
        proposal: true,
        expiring: true,
        weeklySummary: false,
      }
    };
  });
  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('sellerSettings', JSON.stringify(settings));
    setMessage('Configurações salvas com sucesso.');
  };

  return (
    <div className="fade-up" style={{ maxWidth: 620 }}>
      {message && <div className="alert alert-success">{message}</div>}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Perfil do vendedor</h3>
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label className="form-label">Nome da empresa / Corretor</label>
            <input className="inp" value={settings.company} onChange={(e) => handleChange('company', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="form-label">CRECI</label>
              <input className="inp" value={settings.creci} onChange={(e) => handleChange('creci', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Telefone de contato</label>
              <input className="inp" value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="form-label">WhatsApp</label>
              <input className="inp" value={settings.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Site / Instagram</label>
              <input className="inp" value={settings.website} onChange={(e) => handleChange('website', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Configurações de anúncio</h3>
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label className="form-label">Validade padrão dos anúncios</label>
            <select className="inp" value={settings.adDuration} onChange={(e) => handleChange('adDuration', e.target.value)}>
              {['30 dias', '60 dias', '90 dias'].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="form-label">Destaque automático</label>
              <select className="inp" value={settings.autoHighlight} onChange={(e) => handleChange('autoHighlight', e.target.value)}>
                {['Sim', 'Não'].map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Resposta automática de contato</label>
              <select className="inp" value={settings.autoReply} onChange={(e) => handleChange('autoReply', e.target.value)}>
                {['Ativada', 'Desativada'].map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Notificações</h3>
        <div style={{ display: 'grid', gap: 14 }}>
          {[
            { label: 'Novo contato por anúncio', field: 'contact' },
            { label: 'Proposta recebida', field: 'proposal' },
            { label: 'Anúncio expirando', field: 'expiring' },
            { label: 'Resumo semanal por e-mail', field: 'weeklySummary' }
          ].map(({ label, field }) => (
            <div key={field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>{label}</span>
              <label className="switch">
                <input type="checkbox" checked={settings.notifications[field]} onChange={() => handleToggle(field)} />
                <span className="slider" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-gold" style={{ padding: '13px 32px' }} onClick={saveSettings}>Salvar configurações</button>
    </div>
  );
};

const PainelAdmTab = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminMetrics();
        setMetrics(response.data);
      } catch (err) {
        setError('Erro ao carregar métricas do admin');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="fade-up"><p>Carregando métricas...</p></div>;
  if (error) return <div className="fade-up"><p className="error">{error}</p></div>;

  return (
    <div className="fade-up">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="tag" label="Total de anúncios" value={metrics.properties.total || 0} delta={metrics.properties.active ? 10 : 0} />
        <StatCard icon="users" label="Vendedores" value={metrics.users.sellers || 0} delta={0} color="var(--blue)" />
        <StatCard icon="chart" label="Compradores" value={metrics.users.buyers || 0} delta={0} color="var(--green)" />
        <StatCard icon="building" label="Admins" value={metrics.users.admins || 0} delta={0} color="var(--amber)" />
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Atividade recente</h3>
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
    </div>
  );
};

const AnunciosAdmTab = () => {
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getProperties();
        setProperties(response.data);
      } catch (err) {
        setError('Erro ao carregar anúncios');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="fade-up">
      {selected && <ListingModal item={selected} onClose={() => setSelected(null)} />}
      {loading && <p>Carregando anúncios...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !properties.length && <p style={{ color: 'var(--muted)' }}>Nenhum anúncio encontrado.</p>}

      {!loading && properties.length > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Anúncio</th>
                <th>Vendedor</th>
                <th>Tipo</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Destaque</th>
                <th>Ações</th>
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
                  <td><span className="chip">{item.type === 'imovel' ? '🏠' : '🚗'}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--gold)', fontSize: 13 }}>{fmt(item.price || item.value || 0)}</td>
                  <td><StatusBadge status={item.status || 'pendente'} /></td>
                  <td>{item.featured ? <span className="badge badge-gold">⭐ Sim</span> : <span className="badge badge-muted">Não</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => setSelected(item)}>Ver</button>
                      <button className="btn-danger" style={{ padding: '5px 10px' }}><Ic name="trash" size={12} /></button>
                    </div>
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

const UsuariosAdmTab = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (err) {
        setError('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir este usuário?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError('Erro ao excluir usuário');
    }
  };

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>Gerenciar usuários</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Visualize e gerencie as contas cadastradas.</p>
        </div>
        <button type="button" className="primary-button" onClick={() => navigate('/dashboard/usuarios/novo')}>Adicionar usuário</button>
      </div>

      {loading && <p>Carregando usuários...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !users.length && <p style={{ color: 'var(--muted)' }}>Nenhum usuário encontrado.</p>}

      {!loading && users.length > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>E-mail</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Cadastro</th>
                <th>Compras</th>
                <th>Ações</th>
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
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>{u.email}</td>
                  <td><span className="badge badge-muted">{u.role === 'vendedor' ? 'Vendedor' : u.role === 'adm' ? 'Administrador' : 'Usuário'}</span></td>
                  <td><StatusBadge status={u.isActive ? 'ativo' : 'inativo'} /></td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td style={{ fontSize: 13, textAlign: 'center' }}>{u.purchases || 0}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => navigate(`/dashboard/usuarios/${u.id}`)}>Editar</button>
                      <button className="btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleDelete(u.id)}><Ic name="trash" size={12} /></button>
                    </div>
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

const RelatoriosAdmTab = () => (
  <div className="fade-up">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
      {[
        { title: 'Receita por categoria', items: [['Casas', 'R$ 3,2M', 65], ['Apartamentos', 'R$ 1,8M', 45], ['SUVs', 'R$ 1,1M', 30], ['Sedans', 'R$ 0,7M', 20]] },
        { title: 'Top vendedores', items: [['Carlos M.', 'R$ 2,1M', 85], ['Roberto F.', 'R$ 1,5M', 62], ['Ana S.', 'R$ 0,9M', 38], ['Lucia T.', 'R$ 0,6M', 25]] },
      ].map((panel) => (
        <div key={panel.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>{panel.title}</h3>
          {panel.items.map(([label, val, pct]) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>{val}</span>
              </div>
              <div style={{ height: 5, background: 'var(--border)', borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--gold),var(--amber))', borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Resumo mensal</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
        {[40, 60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 100].map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', background: i === 11 ? 'linear-gradient(180deg,var(--gold),var(--amber))' : 'var(--border)', borderRadius: '4px 4px 0 0', height: `${v}%`, transition: 'height .3s' }} />
            <span style={{ fontSize: 9, color: 'var(--muted)' }}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ConfiguracoeAdm = () => {
  const defaultSettings = {
    companyName: 'PrimeVenda',
    supportEmail: 'suporte@primevenda.com',
    companyCnpj: '00.000.000/0001-00',
    approvalMode: 'Manual',
    maxPhotos: '10 fotos',
    validityPeriod: '60 dias',
    requireEmailVerification: true,
    twoFactorAuth: false,
    adminActivityLog: true,
    maintenanceMode: false,
  };

  const [settings, setSettings] = useState(() => {
    const saved = window.localStorage.getItem('primevenda-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    window.localStorage.setItem('primevenda-settings', JSON.stringify(settings));
    window.alert('Configurações salvas com sucesso.');
  };

  return (
    <div className="fade-up" style={{ maxWidth: 620 }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>Configurações gerais da plataforma</h3>
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label className="label">Nome da plataforma</label>
            <input className="inp" value={settings.companyName} onChange={(e) => handleChange('companyName', e.target.value)} />
          </div>
          <div>
            <label className="label">E-mail de suporte</label>
            <input className="inp" value={settings.supportEmail} onChange={(e) => handleChange('supportEmail', e.target.value)} />
          </div>
          <div>
            <label className="label">CNPJ</label>
            <input className="inp" value={settings.companyCnpj} onChange={(e) => handleChange('companyCnpj', e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>Regras de anúncio</h3>
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label className="label">Aprovação de anúncios</label>
            <select className="inp" value={settings.approvalMode} onChange={(e) => handleChange('approvalMode', e.target.value)}>
              <option>Manual</option>
              <option>Automática</option>
            </select>
          </div>
          <div>
            <label className="label">Máx. fotos por anúncio</label>
            <select className="inp" value={settings.maxPhotos} onChange={(e) => handleChange('maxPhotos', e.target.value)}>
              <option>5 fotos</option>
              <option>10 fotos</option>
              <option>15 fotos</option>
            </select>
          </div>
          <div>
            <label className="label">Validade máxima</label>
            <select className="inp" value={settings.validityPeriod} onChange={(e) => handleChange('validityPeriod', e.target.value)}>
              <option>30 dias</option>
              <option>60 dias</option>
              <option>90 dias</option>
              <option>Ilimitada</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>Segurança</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Verificação de e-mail obrigatória', key: 'requireEmailVerification' },
            { label: 'Autenticação em 2 fatores (A2F)', key: 'twoFactorAuth' },
            { label: 'Log de atividades dos admins', key: 'adminActivityLog' },
            { label: 'Modo manutenção', key: 'maintenanceMode' },
          ].map((item) => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>{item.label}</span>
              <label className="switch">
                <input type="checkbox" checked={settings[item.key]} onChange={(e) => handleChange(item.key, e.target.checked)} />
                <span className="slider" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-gold" style={{ padding: '13px 32px' }} onClick={saveSettings}>Salvar configurações</button>
    </div>
  );
};

const tabTitles = {
  explorar: 'Explorar Anúncios', favoritos: 'Favoritos', 'minhas-compras': 'Minhas Compras', perfil: 'Meu Perfil', painel: 'Painel', 'meus-anuncios': 'Meus Anúncios', 'novo-anuncio': 'Novo Anúncio', configuracoes: 'Configurações', anuncios: 'Gerenciar Anúncios', usuarios: 'Gerenciar Usuários', relatorios: 'Relatórios',
};

const TabContent = ({ role, tab, user, onUserUpdate }) => {
  if (tab === 'explorar') return <ExplorarTab />;
  if (tab === 'favoritos') return <FavoritosTab />;
  if (tab === 'minhas-compras') return <MinhasComprasTab />;
  if (tab === 'perfil') return <PerfilTab role={role} user={user} onUserUpdate={onUserUpdate} />;
  if (tab === 'painel' && role === 'vendedor') return <PainelVendedorTab />;
  if (tab === 'meus-anuncios') return <MeusAnunciosTab />;
  if (tab === 'novo-anuncio') return <NovoAnuncioTab />;
  if (tab === 'configuracoes' && role === 'vendedor') return <ConfiguracoesSeller />;
  if (tab === 'painel' && role === 'adm') return <PainelAdmTab />;
  if (tab === 'anuncios') return <AnunciosAdmTab />;
  if (tab === 'usuarios') return <UsuariosAdmTab />;
  if (tab === 'relatorios') return <RelatoriosAdmTab />;
  if (tab === 'configuracoes' && role === 'adm') return <ConfiguracoeAdm />;
  return <p style={{ color: 'var(--muted)' }}>Conteúdo em breve.</p>;
};

export default function DashboardPage() {
  const { user, loading, signout } = useAuth();
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
