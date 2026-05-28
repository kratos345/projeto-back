import { useState } from 'react';

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
  eye: 'M1 12c0 0 4-8 11-8s11 8 11 8-4 8-11 8S1 12 1 12zm11 3a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
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

export const Ic = ({ name, size, color, fill, stroke }) => (
  <Icon d={Icons[name]} size={size} color={color} fill={fill} stroke={stroke} />
);

export const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
export const formatDate = (value) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value));
};

export const getPropertyImage = (item) => {
  const featuredImage = item?.images?.find((img) => img?.isFeatured)?.url;
  const firstImage = item?.images?.[0]?.url || item?.images?.[0];
  return item?.image || featuredImage || firstImage || item?.seller?.profileImage || 'https://via.placeholder.com/400';
};

export const StatusBadge = ({ status }) => {
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

export const ListingModal = ({ item, onClose, onFavorite, onInterest }) => {
  const location = [item.neighborhood, item.city, item.state].filter(Boolean).join(' • ');
  const address = [item.street, item.number, item.complement].filter(Boolean).join(', ');
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: 'var(--card)', borderRadius: 16, maxWidth: 600, width: '100%', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: 'relative' }}>
          <img src={getPropertyImage(item)} alt={item.title} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: '16px 16px 0 0' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{item.title}</h2>
          <p style={{ color: 'var(--gold)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{fmt(item.price)}</p>
          <p style={{ color: 'var(--muted)', marginBottom: 8 }}>{address}</p>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>{location}</p>
          <p style={{ lineHeight: 1.6, marginBottom: 16 }}>{item.description || 'Descrição não disponível.'}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginBottom: 24 }}>
            <span>Tipo: <strong>{item.type || '—'}</strong></span>
            <span>Status: <strong>{item.status || '—'}</strong></span>
            <span>Quartos: <strong>{item.bedrooms ?? '—'}</strong></span>
            <span>Banheiros: <strong>{item.bathrooms ?? '—'}</strong></span>
            <span>Área: <strong>{item.area ? `${item.area} m²` : '—'}</strong></span>
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {onInterest && (
              <button className="btn-gold" style={{ flex: 1 }} onClick={() => onInterest(item.id)}>
                💬 Tenho Interesse
              </button>
            )}
            {onFavorite && (
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => onFavorite(item.id)}>
                ❤️ Favoritar
              </button>
            )}
            {!onInterest && !onFavorite && (
              <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                Fechar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ListingCard = ({ item, onView }) => {
  const location = item.location || [item.neighborhood, item.city, item.state].filter(Boolean).join(' • ');
  return (
    <div className="card" onClick={() => onView(item)} style={{ cursor: 'pointer' }}>
      <img src={getPropertyImage(item)} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: '14px 14px 0 0' }} />
      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || item.type}</h3>
        <p style={{ color: 'var(--gold)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{fmt(item.price)}</p>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>{item.address || location || 'Localização não informada'}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {item.bedrooms !== undefined && <span style={{ fontSize: 12, color: 'var(--muted)' }}>🛏️ {item.bedrooms}</span>}
          {item.bathrooms !== undefined && <span style={{ fontSize: 12, color: 'var(--muted)' }}>🛁 {item.bathrooms}</span>}
          {item.area !== undefined && <span style={{ fontSize: 12, color: 'var(--muted)' }}>📐 {item.area}m²</span>}
        </div>
      </div>
    </div>
  );
};

export const StatCard = ({ icon, label, value, delta, color = 'var(--gold)' }) => (
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
