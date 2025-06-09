import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

const AcceptInvite = () => {
  const { token } = useParams<{ token: string }>();
  const [coupleName, setCoupleName] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [msLeft, setMsLeft] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:4000/api/couples/invite-info/${token}`)
      .then(async res => {
        if (!res.ok) return;
        const data = await res.json();
        setCoupleName(data.coupleName);
        setExpiresAt(data.expiresAt);
        setMsLeft(data.msLeft);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // 1. Cadastra o usuário
      const registerRes = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, coupleName: 'convidado' }),
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        setMessage(registerData.message || 'Erro ao cadastrar usuário.');
        setLoading(false);
        return;
      }
      if (registerData.token) {
        localStorage.setItem('amorarium-token', registerData.token);
      }
      // 2. Aceita o convite autenticado
      const acceptRes = await fetch(`http://localhost:4000/api/couples/accept-invite/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${registerData.token}`,
        },
      });
      const acceptData = await acceptRes.json();
      if (acceptRes.ok) {
        setMessage('Cadastro realizado com sucesso! Redirecionando...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(acceptData.message || 'Erro ao aceitar convite.');
      }
    } catch {
      setMessage('Erro de conexão com o servidor.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="amorarium-card p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Aceitar Convite</h2>
          {coupleName && (
            <p className="text-center text-amorarium-rose mb-2">
              Você foi convidado(a) para o casal: <strong>{coupleName}</strong>
            </p>
          )}
          {expiresAt && msLeft !== null && (
            <p className="text-center text-gray-500 mb-4 text-xs">
              Convite expira em: {new Date(expiresAt).toLocaleString('pt-BR')}<br />
              {msLeft > 0
                ? `Faltam ${(msLeft / 1000 / 60 / 60).toFixed(1)} horas`
                : 'Convite expirado'}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Seu Nome"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 text-black placeholder-gray-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 text-black placeholder-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 text-black placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="amorarium-button w-full"
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Aceitar Convite e Criar Conta'}
            </button>
            {message && <div className="mt-2 text-amorarium-rose text-sm text-center">{message}</div>}
          </form>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AcceptInvite;
