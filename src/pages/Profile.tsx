import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { User, Heart, Camera, Calendar, Star, Settings, Edit, Share, Copy, Edit2 } from 'lucide-react';
import { useCouple } from '@/hooks/useCouple';
import CoupleBanner from '@/components/CoupleBanner';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { couple, user, loading: coupleLoading, updateCoupleName } = useCouple();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [anniversary, setAnniversary] = useState('');
  const [name, setName] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [newCoupleName, setNewCoupleName] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Atualiza campos ao receber dados do hook
  React.useEffect(() => {
    setDescription(couple?.description || user?.description || '');
    setAnniversary(couple?.anniversary || user?.anniversary || '');
    setName(user?.name || '');
    setCoupleName(couple?.name || '');
    setEmail(user?.email || '');
  }, [couple, user]);

  const isIndividual = !couple;

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('amorarium-token');
    try {
      let body;
      if (isIndividual) {
        body = { name, email, description };
        if (anniversary) body.anniversary = new Date(anniversary).toISOString();
      } else {
        body = { name: coupleName, description };
        if (anniversary) body.anniversary = new Date(anniversary).toISOString();
      }
      
      const res = await fetch('http://localhost:4000/api/couples/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erro ao salvar perfil:', errorText);
        throw new Error('Erro ao salvar');
      }
      setSuccess('Perfil atualizado!');
      setOpen(false);
      window.location.reload();
    } catch (e) {
      setError('Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  // Função para upload de avatar/banner
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setLoading(true);
    setError('');
    setSuccess('');
    const file = e.target.files[0];
    const token = localStorage.getItem('amorarium-token');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const endpoint = isIndividual
        ? 'http://localhost:4000/api/users/profile/avatar'
        : 'http://localhost:4000/api/couples/upload';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Erro ao enviar imagem');
      setSuccess('Avatar atualizado!');
      setOpen(false); // Fecha o modal após upload
      window.location.reload();
    } catch (e) {
      setError('Erro ao enviar imagem.');
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setLoading(true);
    setError('');
    setSuccess('');
    const file = e.target.files[0];
    const token = localStorage.getItem('amorarium-token');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const endpoint = isIndividual
        ? 'http://localhost:4000/api/users/profile/banner'
        : 'http://localhost:4000/api/couples/upload';
      if (!isIndividual) formData.append('type', 'banner');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Erro ao enviar imagem');
      setSuccess('Banner atualizado!');
      setOpen(false); // Fecha o modal após upload
      window.location.reload();
    } catch (e) {
      setError('Erro ao enviar imagem.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvite = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('amorarium-token');
      const res = await fetch('http://localhost:4000/api/couples/generate-invite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error('Erro ao gerar convite');
      
      const data = await res.json();
      const fullLink = `${window.location.origin}/accept-invite/${data.token}`;
      setInviteLink(fullLink);
      setShowInviteModal(true);
    } catch (e) {
      setError('Erro ao gerar link de convite');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setSuccess('Link copiado para a área de transferência!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateCoupleName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('amorarium-token');
      const res = await fetch('http://localhost:4000/api/couples/name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCoupleName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao atualizar nome');
      }

      setSuccess('Nome atualizado com sucesso!');
      setShowEditName(false);
      // Recarrega os dados do casal
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar nome');
    } finally {
      setLoading(false);
    }
  };

  // Mock para stats e achievements enquanto não há integração real
  const anniversaryCount = React.useMemo(() => {
    if (!couple?.anniversary) return 0;
    const anniv = new Date(couple.anniversary);
    const today = new Date();
    let years = today.getFullYear() - anniv.getFullYear();
    // Se ainda não chegou o mês/dia do aniversário este ano, subtrai 1
    if (
      today.getMonth() < anniv.getMonth() ||
      (today.getMonth() === anniv.getMonth() && today.getDate() < anniv.getDate())
    ) {
      years--;
    }
    return years >= 0 ? years + 1 : 1; // Mostra 1 no primeiro ano, 2 no segundo, etc.
  }, [couple?.anniversary]);

  const stats = [
    { icon: Heart, value: 12, label: 'Cápsulas' },
    { icon: Camera, value: 34, label: 'Fotos' },
    { icon: Calendar, value: anniversaryCount, label: 'Aniversários' },
    { icon: Star, value: 5, label: 'Conquistas' },
  ];
  const achievements = [
    { id: 1, icon: '🏆', title: 'Primeira Cápsula', description: 'Você criou sua primeira cápsula!' },
    { id: 2, icon: '💖', title: 'Primeiro Sonho', description: 'Você adicionou um sonho ao casal.' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <CoupleBanner coupleId={couple?.id || null} />
        {/* Profile Header */}
        <div className="amorarium-card p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amorarium-peach to-amorarium-rose rounded-full flex items-center justify-center overflow-hidden relative">
              {isIndividual ? (
                user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-20 h-20 object-cover rounded-full" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )
              ) : (
                couple?.avatarUrl ? (
                  <img src={couple.avatarUrl} alt="Avatar do casal" className="w-20 h-20 object-cover rounded-full" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )
              )}
              <label className="absolute bottom-0 right-0 bg-amorarium-rose text-white rounded-full p-1 cursor-pointer hover:bg-amorarium-peach transition-colors" title="Alterar avatar">
                <Camera className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={loading} />
              </label>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {isIndividual
                  ? (user?.name || 'Seu Perfil')
                  : (couple?.name || 'Casal')}
              </h1>
              {isIndividual ? (
                <p className="text-gray-600 text-sm">{user?.email}</p>
              ) : null}
              {/* Descrição e tempo juntos */}
              {isIndividual ? (
                <p className="text-sm text-amorarium-rose mt-1">
                  {user?.description || 'Adicione uma descrição sobre você.'}
                </p>
              ) : (
                <>
                  {couple?.anniversary && (
                    <p className="text-gray-600 text-sm">
                      {(() => {
                        const anniv = new Date(couple.anniversary);
                        const now = new Date();
                        // Zera o horário para comparar apenas a data local
                        const annivDate = new Date(anniv.getFullYear(), anniv.getMonth(), anniv.getDate());
                        const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const diff = Math.round((nowDate.getTime() - annivDate.getTime()) / (1000 * 60 * 60 * 24));
                        return `Juntos há ${diff} dias (${anniv.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })})`;
                      })()}
                    </p>
                  )}
                  <p className="text-sm text-amorarium-rose mt-1">
                    {couple?.description || 'Adicione uma descrição do casal.'}
                  </p>
                </>
              )}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="p-2 rounded-lg bg-amorarium-cream hover:bg-amorarium-peach/20 transition-colors" title="Editar perfil">
                  <Edit className="w-5 h-5 text-amorarium-rose" />
                </button>
              </DialogTrigger>
              <DialogContent className="!bg-white dark:!bg-slate-900 !border-none">
                <DialogHeader>
                  <DialogTitle className="!text-gray-800 dark:!text-white">
                    {isIndividual ? 'Editar Perfil Individual' : 'Editar Perfil do Casal'}
                  </DialogTitle>
                  <DialogDescription>
                    {isIndividual ? 'Edite suas informações pessoais. Visível apenas para você.' : 'Edite as informações do casal. Essas informações são visíveis para ambos.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
                  {isIndividual ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input
                          type="text"
                          className="w-full p-2 rounded border border-gray-200 bg-white text-gray-800 placeholder-gray-400"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full p-2 rounded border border-gray-200 bg-white text-gray-800 placeholder-gray-400"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Casal</label>
                      <input
                        type="text"
                        className="w-full p-2 rounded border border-gray-200 bg-white text-gray-800 placeholder-gray-400"
                        value={coupleName}
                        onChange={e => setCoupleName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      maxLength={200}
                      placeholder={isIndividual ? 'Fale um pouco sobre você' : 'Juntos desde 2023, apaixonados por viagem'}
                      className="bg-white dark:bg-slate-900 text-gray-800 placeholder-gray-400 border border-gray-200 dark:border-slate-700 focus:bg-white focus:dark:bg-slate-900 focus:border-amorarium-rose focus:ring-2 focus:ring-amorarium-rose"
                      style={{ WebkitBoxShadow: 'none', boxShadow: 'none', color: '#222', filter: 'none' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Aniversário</label>
                    <input
                      type="date"
                      className="w-full p-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 placeholder-gray-400 focus:bg-white focus:dark:bg-slate-900 focus:border-amorarium-rose focus:ring-2 focus:ring-amorarium-rose"
                      value={anniversary ? anniversary.slice(0, 10) : ''}
                      onChange={e => setAnniversary(e.target.value)}
                      style={{ WebkitBoxShadow: 'none', boxShadow: 'none', borderColor: '#e5e7eb', color: '#222', filter: 'none' }}
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <DialogFooter>
                    <button type="button" className="amorarium-button" onClick={() => setOpen(false)} disabled={loading}>Cancelar</button>
                    <button type="submit" className="amorarium-button bg-amorarium-rose text-white" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex space-x-2">
            {isIndividual && (
              <button 
                onClick={handleGenerateInvite}
                className="amorarium-button flex-1 flex items-center justify-center space-x-2"
                disabled={loading}
              >
                <Share className="w-4 h-4" />
                <span>Compartilhar Convite</span>
              </button>
            )}
            <button className="flex items-center justify-center px-4 py-3 rounded-xl bg-amorarium-cream text-amorarium-rose font-medium hover:bg-amorarium-peach/20 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Statistics and Achievements only for couples */}
        {!isIndividual && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="amorarium-card p-4 text-center">
                    <Icon className="w-6 h-6 text-amorarium-rose mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="amorarium-card p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Conquistas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 rounded-lg bg-amorarium-cream/50">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-800">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {/* Recent Activity - can be hidden or replaced for individual users if desired */}
        {!isIndividual && (
          <div className="amorarium-card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Atividade Recente</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-amorarium-cream/30">
                <Calendar className="w-5 h-5 text-amorarium-rose" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Cápsula criada hoje</p>
                  <p className="text-xs text-gray-600">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-amorarium-cream/30">
                <Camera className="w-5 h-5 text-amorarium-rose" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Nova foto adicionada</p>
                  <p className="text-xs text-gray-600">Ontem</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-amorarium-cream/30">
                <Star className="w-5 h-5 text-amorarium-rose" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Sonho atualizado</p>
                  <p className="text-xs text-gray-600">Há 3 dias</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Optionally, show a message for individual users */}
        {isIndividual && (
          <div className="amorarium-card p-6 text-center text-gray-600">
            <p>Você ainda não está em um casal. Convide alguém para liberar experiências compartilhadas!</p>
          </div>
        )}

        {/* Modal de Convite */}
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
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
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="amorarium-button"
                >
                  Fechar
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Edição do Nome do Casal */}
        <Dialog open={showEditName} onOpenChange={setShowEditName}>
          <DialogContent className="!bg-white dark:!bg-slate-900 !border-none">
            <DialogHeader>
              <DialogTitle className="!text-gray-800 dark:!text-white">
                Editar Nome do Casal
              </DialogTitle>
              <DialogDescription>
                Escolha um nome especial para seu casal
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleUpdateCoupleName} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Casal</label>
                <input
                  type="text"
                  value={newCoupleName}
                  onChange={e => setNewCoupleName(e.target.value)}
                  className="w-full p-2 rounded border border-gray-200 bg-white text-gray-800"
                  required
                />
              </div>
              
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}
              
              <DialogFooter>
                <button
                  type="button"
                  className="amorarium-button"
                  onClick={() => setShowEditName(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="amorarium-button bg-amorarium-rose text-white"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Profile;
