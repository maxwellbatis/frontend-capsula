import React, { forwardRef, useImperativeHandle } from 'react';
import { Sparkles } from 'lucide-react';
import { useCapsules } from '@/hooks/useCapsules';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Image as ImageIcon, X } from 'lucide-react';

interface CapsuleCardProps {
  onCapsuleCreated?: () => void;
}

const CapsuleCard = forwardRef(function CapsuleCard(props: CapsuleCardProps, ref) {
  const { createCapsule, updateCapsule } = useCapsules();
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', content: '', imageUrl: '', musicUrl: '', location: '' });
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => setShowForm(true)
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCapsule(editingId, form);
      } else {
        await createCapsule(form);
        if (props.onCapsuleCreated) props.onCapsuleCreated();
      }
      setShowForm(false);
      setForm({ title: '', content: '', imageUrl: '', musicUrl: '', location: '' });
      setEditingId(null);
    } catch {}
    setSubmitting(false);
  };

  const handleEdit = (capsule: any) => {
    setForm({
      title: capsule.title || '',
      content: capsule.content || '',
      imageUrl: capsule.imageUrl || '',
      musicUrl: capsule.musicUrl || '',
      location: capsule.location || '',
    });
    setEditingId(capsule.id);
    setShowForm(true);
  };

  return (
    <div className="amorarium-card p-6 mb-6 sparkle">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">A Cápsula de Hoje</h2>
        <Sparkles className="w-5 h-5 text-amorarium-gold animate-gentle-pulse" />
      </div>
      <p className="text-gray-600 mb-6">
        Capture este momento especial e guarde para o futuro ✨
      </p>
      {/* Não exibe cápsulas criadas aqui, só o botão de criar */}
      <Button onClick={() => { setShowForm(true); setEditingId(null); }} className="mb-4 bg-amorarium-rose text-white hover:bg-amorarium-gold/80">Nova Cápsula</Button>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md w-full p-0 bg-white/95 shadow-xl rounded-2xl border border-amorarium-peach">
          <div className="amorarium-card bg-gradient-to-br from-amorarium-cream via-white to-amorarium-peach/30 p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-amorarium-rose text-lg font-bold mb-2">{editingId ? 'Editar Cápsula' : 'Nova Cápsula'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="title" value={form.title} onChange={handleChange} placeholder="Título" className="w-full p-2 rounded-lg border border-amorarium-peach focus:ring-2 focus:ring-amorarium-rose bg-white/80 text-gray-800 placeholder:text-gray-400" required minLength={2} />
              <textarea name="content" value={form.content} onChange={handleChange} placeholder="Conteúdo" className="w-full p-2 rounded-lg border border-amorarium-peach focus:ring-2 focus:ring-amorarium-rose bg-white/80 text-gray-800 placeholder:text-gray-400" />
              {/* Upload de imagem opcional */}
              <input
                type="file"
                accept="image/*"
                id="capsule-image-upload"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  setForm(f => ({ ...f, imageFile: file }));
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setPreviewImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewImage(null);
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <label htmlFor="capsule-image-upload" className="inline-flex items-center cursor-pointer px-3 py-2 rounded-lg border border-amorarium-peach bg-white/80 text-amorarium-rose hover:bg-amorarium-peach/20 transition">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  {previewImage ? 'Trocar imagem' : 'Adicionar imagem'}
                </label>
                {previewImage && (
                  <div className="relative group">
                    <img src={previewImage} alt="Prévia" className="w-16 h-16 object-cover rounded-lg border border-amorarium-peach" />
                    <button type="button" onClick={() => { setForm(f => ({ ...f, imageFile: undefined, imageUrl: '' })); setPreviewImage(null); }} className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100 transition-opacity opacity-80 group-hover:opacity-100">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
              <input name="musicUrl" value={form.musicUrl} onChange={handleChange} placeholder="URL da música (opcional)" className="w-full p-2 rounded-lg border border-amorarium-peach focus:ring-2 focus:ring-amorarium-rose bg-white/80 text-gray-800 placeholder:text-gray-400" />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Local (opcional)" className="w-full p-2 rounded-lg border border-amorarium-peach focus:ring-2 focus:ring-amorarium-rose bg-white/80 text-gray-800 placeholder:text-gray-400" />
              <DialogFooter className="flex gap-2 justify-end mt-2">
                <Button type="submit" disabled={submitting} className="bg-amorarium-rose text-white hover:bg-amorarium-gold/80">{editingId ? 'Salvar' : 'Criar'}</Button>
                <Button type="button" variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default CapsuleCard;
