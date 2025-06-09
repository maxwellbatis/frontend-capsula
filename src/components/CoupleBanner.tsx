import React, { useState } from 'react';
import { useCouple } from '@/hooks/useCouple';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Mail, Share, Copy } from 'lucide-react';

interface CoupleBannerProps {
  coupleId?: string | null;
}

const CoupleBanner: React.FC<CoupleBannerProps> = ({ coupleId }) => {
  const { couple, loading: coupleLoading } = useCouple();
  const [showInvite, setShowInvite] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerateInvite = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('amorarium-token');
      if (!token) {
        setError('Você precisa estar logado para gerar um convite');
        return;
      }

      const res = await fetch('http://localhost:4000/api/couples/generate-invite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao gerar convite');
      }
      
      const data = await res.json();
      const fullLink = `${window.location.origin}/accept-invite/${data.token}`;
      setInviteLink(fullLink);
      setShowInviteLink(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao gerar link de convite');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('amorarium-token');
      if (!token) {
        setError('Você precisa estar logado para enviar um convite');
        return;
      }

      const res = await fetch('http://localhost:4000/api/couples/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ partnerEmail }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao enviar convite');
      }
      
      const data = await res.json();
      setSuccess(data.message || 'Convite enviado com sucesso!');
      setPartnerEmail('');
      setShowInvite(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar convite');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setSuccess('Link copiado para a área de transferência!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (coupleLoading) return null;

  // Se já está em casal, mostra informações do casal e dos membros
  if (coupleId && couple) {
    return (
      <div className="amorarium-card bg-amorarium-peach/10 border border-amorarium-peach mb-6 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {couple.avatarUrl && (
            <img src={couple.avatarUrl} alt="Avatar do casal" className="w-16 h-16 rounded-full object-cover border-2 border-amorarium-rose" />
          )}
          
          <div>
            <div className="font-bold text-amorarium-rose text-lg mb-1">{couple.name || 'Casal formado!'}</div>
            {couple.anniversary && (
              <div className="text-gray-700 text-sm mb-1">
                {(() => {
                  const anniv = new Date(couple.anniversary);
                  const now = new Date();
                  const annivDate = new Date(anniv.getFullYear(), anniv.getMonth(), anniv.getDate());
                  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  const diff = Math.round((nowDate.getTime() - annivDate.getTime()) / (1000 * 60 * 60 * 24));
                  return `Juntos há ${diff} dias`;
                })()}
              </div>
            )}
            {couple.createdAt && (
              <div className="text-gray-700 text-sm mb-1">
                Desde: {new Date(couple.createdAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
            {couple.anniversary && (
              <div className="text-gray-700 text-sm">
                Aniversário: {new Date(couple.anniversary).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
            {couple.description && <div className="text-gray-600 text-xs mt-1">{couple.description}</div>}
            <div className="flex gap-2 mt-2">
              {couple.users?.map((u) => (
                <div key={u.id} className="flex items-center gap-1 bg-amorarium-cream px-2 py-1 rounded-lg">
                  {u.avatarUrl && <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-full object-cover" />}
                  <span className="text-amorarium-rose font-medium text-xs">{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se não está em casal, mostra opções para convidar
  return (
    <>
      <div className="amorarium-card bg-amorarium-peach/10 border border-amorarium-peach mb-6 p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-amorarium-rose mb-2">Convide seu Parceiro(a)</h2>
          <p className="text-gray-600 mb-4">Compartilhe o Amorarium com quem você ama</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowInvite(true)}
              className="amorarium-button px-4 py-2 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              <span>Convidar por Email</span>
            </button>
            
            <button
              onClick={handleGenerateInvite}
              className="amorarium-button px-4 py-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <Share className="w-5 h-5" />
              <span>Gerar Link de Convite</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Convite por Email */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="!bg-white dark:!bg-slate-900 !border-none">
          <DialogHeader>
            <DialogTitle className="!text-gray-800 dark:!text-white">
              Convidar por Email
            </DialogTitle>
            <DialogDescription>
              Envie um convite por email para seu parceiro(a)
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email do Parceiro(a)</label>
              <input
                type="email"
                value={partnerEmail}
                onChange={e => setPartnerEmail(e.target.value)}
                className="w-full p-2 rounded border border-gray-200 bg-white text-gray-800 placeholder-gray-400"
                placeholder="exemplo@email.com"
                required
              />
            </div>
            
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            
            <DialogFooter>
              <button
                type="button"
                className="amorarium-button"
                onClick={() => setShowInvite(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="amorarium-button bg-amorarium-rose text-white"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Convite'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Link de Convite */}
      <Dialog open={showInviteLink} onOpenChange={setShowInviteLink}>
        <DialogContent className="!bg-white dark:!bg-slate-900 !border-none">
          <DialogHeader>
            <DialogTitle className="!text-gray-800 dark:!text-white">
              Compartilhe o Convite
            </DialogTitle>
            <DialogDescription>
              Compartilhe este link com seu parceiro(a) para formar um casal
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 p-2 rounded border border-gray-200 bg-gray-50 text-gray-800"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-amorarium-cream hover:bg-amorarium-peach/20 transition-colors"
                title="Copiar link"
              >
                <Copy className="w-5 h-5 text-amorarium-rose" />
              </button>
            </div>
            
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowInviteLink(false)}
                className="amorarium-button"
              >
                Fechar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoupleBanner;
