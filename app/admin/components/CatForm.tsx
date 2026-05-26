'use client';

import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Cat } from './Dashboard';

interface CatFormProps {
  cat: Cat | null;
  onSave: () => void;
  onCancel: () => void;
}

const EMPTY_FORM = {
  name: '',
  age: '',
  gender: 'macho' as const,
  color: '',
  description: '',
  status: 'disponible' as const,
  image_url: '' as string | null,
};

export default function CatForm({ cat, onSave, onCancel }: CatFormProps) {
  const isEditing = !!cat;
  const [form, setForm] = useState(cat ? {
    name: cat.name,
    age: cat.age,
    gender: cat.gender,
    color: cat.color,
    description: cat.description,
    status: cat.status,
    image_url: cat.image_url,
  } : EMPTY_FORM);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(cat?.image_url ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede pesar más de 5 MB.');
      return;
    }

    setUploading(true);
    setError('');

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop();
    const fileName = `cats/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('cat-photos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setError('Error al subir la imagen. Intenta de nuevo.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('cat-photos')
      .getPublicUrl(fileName);

    setForm(prev => ({ ...prev, image_url: publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      age: form.age.trim(),
      gender: form.gender,
      color: form.color.trim(),
      description: form.description.trim(),
      status: form.status,
      image_url: form.image_url || null,
    };

    let dbError = null;

    if (isEditing) {
      const { error } = await supabase.from('cats').update(payload).eq('id', cat.id);
      dbError = error;
    } else {
      const { error } = await supabase.from('cats').insert([payload]);
      dbError = error;
    }

    if (dbError) {
      setError('Error al guardar. Revisa los datos e intenta de nuevo.');
      setSaving(false);
      return;
    }

    onSave();
  };

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Image upload */}
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-2xl bg-orange-50 border-2 border-dashed border-orange-200 flex items-center justify-center cursor-pointer hover:bg-orange-100 transition overflow-hidden relative"
          >
            {uploading ? (
              <div className="w-7 h-7 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            ) : imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">📷</span>
                <span className="text-xs text-orange-400 font-medium">Subir foto</span>
              </div>
            )}
          </div>
          <input
            title='image upload'
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-400">JPG, PNG o WEBP · máx 5 MB</p>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Nombre *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ej. Luna"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Edad *</label>
            <input
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              placeholder="Ej. 2 años, 6 meses"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Género *</label>
            <select
              title='gender'
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white"
            >
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Color / pelaje *</label>
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              required
              placeholder="Ej. Naranja con blanco"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Estado de adopción *</label>
            <div className="flex flex-wrap gap-2">
              {(['disponible', 'en_proceso', 'adoptado'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, status: s }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                    form.status === s
                      ? s === 'disponible'
                        ? 'bg-green-500 text-white border-green-500'
                        : s === 'en_proceso'
                        ? 'bg-yellow-400 text-yellow-900 border-yellow-400'
                        : 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-orange-200'
                  }`}
                >
                  {s === 'disponible' ? 'Disponible' : s === 'en_proceso' ? 'En proceso' : 'Adoptado'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Cuéntanos sobre la personalidad, historia o necesidades especiales de este michi..."
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold transition"
          >
            {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar michi'}
          </button>
        </div>
      </form>
    </div>
  );
}