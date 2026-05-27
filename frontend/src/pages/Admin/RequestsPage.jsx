import { useEffect, useState } from 'react';
import { getRequests, updateRequestStatus } from '../../api/requests';
import '../../styles/admin.css';

export default function RequestsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getRequests();
      setItems(res.data);
    } catch (err) {
      setError('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    if (!window.confirm(`Confirma ${status} da solicitação ${id}?`)) return;
    try {
      await updateRequestStatus(id, status);
      setItems(items.map(it => it.id === id ? { ...it, status } : it));
      alert('Status atualizado');
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  if (loading) return <div className="page"><p>Carregando solicitações...</p></div>;
  if (error) return <div className="page"><p className="error">{error}</p></div>;

  return (
    <div className="page admin-page">
      <header className="admin-top-bar">
        <div>
          <h2>📨 Solicitações de Conta</h2>
          <p>Lista de solicitações enviadas pelos usuários</p>
        </div>
      </header>

      <main className="admin-content">
        {items.length === 0 ? (
          <div className="empty-state card">
            <h3>Nenhuma solicitação</h3>
            <p>Não há solicitações pendentes.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 12 }}>
            <table className="table-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>CPF/CNPJ</th>
                  <th>Status</th>
                  <th>Enviada em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.name}</td>
                    <td>{i.email}</td>
                    <td>{i.cpfCnpj}</td>
                    <td style={{ textTransform: 'capitalize' }}>{i.status}</td>
                    <td>{new Date(i.createdAt).toLocaleString('pt-BR')}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      {i.status !== 'approved' && (
                        <button className="btn-gold" onClick={() => handleStatus(i.id, 'approved')}>Aprovar</button>
                      )}
                      {i.status !== 'rejected' && (
                        <button className="btn-secondary" onClick={() => handleStatus(i.id, 'rejected')}>Rejeitar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
