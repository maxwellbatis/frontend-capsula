import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GalleryEntry {
  id: number;
  url?: string; // para cápsulas
  imageUrl?: string; // para galeria
  type: string;
  description?: string;
  momentAt?: string;
  createdAt?: string;
  album?: string;
  capsuleId?: number;
}

export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [album, setAlbum] = useState('');
  const [albums, setAlbums] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('amorarium-token');
    setLoading(true);
    fetch('http://localhost:4000/api/gallery', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setGallery(data);
        // Agrupa álbuns existentes
        const uniqueAlbums = Array.from(new Set(data.map((item: any) => String(item.album)).filter(Boolean)));
        setAlbums(uniqueAlbums as string[]);
        setLoading(false);
      });
    // Também busca as cápsulas e adiciona ao abrir a página ou após upload
    fetch('http://localhost:4000/api/capsules', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const capsuleImages = data.filter((c: any) => c.imageUrl).map((c: any) => ({
          id: c.id + 1000000, // evita conflito de id
          url: c.imageUrl,
          type: 'capsule',
          description: c.title,
          createdAt: c.createdAt,
          album: 'Cápsulas',
          capsuleId: c.id,
        }));
        setGallery(g => {
          // Evita duplicatas de cápsulas
          const filtered = g.filter(item => item.type !== 'capsule');
          return [...filtered, ...capsuleImages];
        });
        if (capsuleImages.length > 0) setAlbums(a => a.includes('Cápsulas') ? a : [...a, 'Cápsulas']);
      });
  }, [showUpload, uploading]); // Atualiza ao abrir upload e ao terminar upload

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const token = localStorage.getItem('amorarium-token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('album', album);
    try {
      await fetch('http://localhost:4000/api/gallery/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      setShowUpload(false);
      setFile(null);
      setDescription('');
      setAlbum('');
    } finally {
      setUploading(false);
    }
  };

  // Agrupa por álbum (ou por "Sem Categoria")
  const grouped = gallery.reduce((acc, item) => {
    const key = item.album || 'Sem Categoria';
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, GalleryEntry[]>);

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto mb-2" />Carregando galeria...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-amorarium-rose">Galeria</h1>
        <Button onClick={() => setShowUpload(true)} className="flex items-center gap-2 bg-amorarium-rose text-white"> <Plus className="w-4 h-4" />Adicionar Foto</Button>
      </div>
      {showUpload && (
        <form onSubmit={handleUpload} className="mb-8 p-4 rounded-xl border border-gray-200 bg-white/90 shadow flex flex-col gap-3">
          <Label className="font-medium text-gray-700">Imagem</Label>
          <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required className="bg-white text-gray-800 placeholder:text-gray-400 border border-gray-300" />
          <Label className="font-medium text-gray-700">Legenda</Label>
          <Input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Legenda da foto" className="bg-white text-gray-800 placeholder:text-gray-400 border border-gray-300" />
          <Label className="font-medium text-gray-700">Álbum / Categoria</Label>
          <select value={album} onChange={e => setAlbum(e.target.value)} className="p-2 rounded border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400">
            <option value="">Selecione ou digite...</option>
            {albums.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <Input type="text" value={album} onChange={e => setAlbum(e.target.value)} placeholder="Novo álbum ou categoria (opcional)" className="mt-1 bg-white text-gray-800 placeholder:text-gray-400 border border-gray-300" />
          <div className="flex gap-2 mt-2">
            <Button type="submit" disabled={uploading} className="bg-amorarium-rose text-white">{uploading ? 'Enviando...' : 'Enviar'}</Button>
            <Button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setShowUpload(false)}>Cancelar</Button>
          </div>
        </form>
      )}
      {Object.entries(grouped).map(([album, items]) => (
        <div key={album} className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-amorarium-rose">{album}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className="relative group">
                <img src={item.imageUrl || item.url} alt={item.description || ''} className="rounded-lg object-cover w-full h-40 border border-amorarium-peach" />
                {item.description && <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition">{item.description}</div>}
                {item.type === 'capsule' && <span className="absolute top-2 right-2 bg-amorarium-rose text-white text-xs px-2 py-0.5 rounded-full">Cápsula</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
      {gallery.length === 0 && <div className="text-center text-gray-500">Nenhuma foto enviada ainda.</div>}
    </div>
  );
}
