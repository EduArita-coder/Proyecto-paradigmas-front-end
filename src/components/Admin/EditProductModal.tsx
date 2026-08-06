import React, { useState } from 'react';
import type { Producto } from '../../interfaces/product';
import { uploadProductoImagen } from '../../services/apiService';

interface EditProductModalProps {
  product: Producto | null; // Null means creating a new product
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Producto, 'id'>, id?: string) => Promise<void>;
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
  onSave,
}: EditProductModalProps) {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [cpu, setCpu] = useState(product?.cpu || '2 vCPU');
  const [ram, setRam] = useState(product?.ram || '4 GB');
  const [slots, setSlots] = useState(product?.slots || 20);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Update internal form when product prop changes
  React.useEffect(() => {
    setName(product?.name || '');
    setDescription(product?.description || '');
    setPrice(product?.price || 0);
    setCpu(product?.cpu || '2 vCPU');
    setRam(product?.ram || '4 GB');
    setSlots(product?.slots || 20);
    setImageUrl(product?.imageUrl || '');
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const uploadedUrl = await uploadProductoImagen(file);
      setImageUrl(uploadedUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await onSave(
        {
          name,
          description,
          price: Number(price),
          cpu,
          ram,
          slots: Number(slots),
          imageUrl,
        },
        product?.id
      );
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{isEditing ? '✏️ Editar Servidor' : '➕ Crear Nuevo Servidor'}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Nombre del Plan / Servidor
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Minecraft Plan PRO"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Descripción
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del servidor..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Precio (HNL / mes)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Slots / Jugadores
              </label>
              <input
                type="number"
                required
                value={slots}
                onChange={(e) => setSlots(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                CPU
              </label>
              <input
                type="text"
                required
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                placeholder="4 vCPU"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                RAM
              </label>
              <input
                type="text"
                required
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                placeholder="8 GB DDR4"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Imagen del Servidor (Subir local o URL)
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 file:cursor-pointer"
              />
              {uploading && <p className="text-xs text-cyan-400 animate-pulse">Subiendo imagen al servidor...</p>}

              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="O escribe una URL pública de la imagen (/images/ejemplo.png)"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-sm shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Guardando...' : 'Guardar Servidor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
