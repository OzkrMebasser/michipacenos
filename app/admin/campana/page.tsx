'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase'; // ajusta el path si es necesario
import type { Campaign } from '../../lib/types'; // ajusta el path si es necesario

// ─── Estado vacío por defecto ────────────────────────────────────────────────
const EMPTY: Omit<Campaign, 'id' | 'created_at'> = {
  title: 'Campaña de esterilización felina',
  subtitle: 'Bajo costo',
  month: 'Mayo',
  date_label: '',
  place: '',
  price: '',
  contact: '',
  notes: '',
  is_active: false,
  sponsor_logos: [],
};

// ─── Campos de texto del formulario ──────────────────────────────────────────
const FIELDS: {
  name: keyof typeof EMPTY;
  label: string;
  placeholder: string;
  multi?: boolean;
}[] = [
  { name: 'title',      label: 'Título',         placeholder: 'Campaña de esterilización felina' },
  { name: 'subtitle',   label: 'Subtítulo',       placeholder: 'Bajo costo' },
  { name: 'month',      label: 'Mes / periodo',   placeholder: 'Mayo' },
  { name: 'date_label', label: 'Fecha',           placeholder: 'Domingo 17' },
  { name: 'place',      label: 'Lugar',           placeholder: 'Plaza Paseo La Paz' },
  { name: 'price',      label: 'Cuota de recuperación', placeholder: '$200 por gato' },
  { name: 'contact',    label: 'Contacto / citas', placeholder: 'WhatsApp\n612 176 7890', multi: true },
  { name: 'notes',      label: 'Nota al pie',     placeholder: 'Solo se recibirán gatos con cita | Cupo limitado', multi: true },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function CampanaPage() {
  const [form, setForm]               = useState<Omit<Campaign, 'id' | 'created_at'>>(EMPTY);
  const [campaignId, setCampaignId]   = useState<string | null>(null);
  const [saving, setSaving]           = useState(false);
  const [uploadingLogos, setUploadingLogos] = useState(false);
  const [msg, setMsg]                 = useState<{ text: string; type: 'ok' | 'err' } | null>(null);
  const logosInputRef                 = useRef<HTMLInputElement>(null);

  // ── Cargar campaña más reciente al montar ──────────────────────────────────
  useEffect(() => {
    supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            title:         data.title        ?? EMPTY.title,
            subtitle:      data.subtitle     ?? EMPTY.subtitle,
            month:         data.month        ?? EMPTY.month,
            date_label:    data.date_label   ?? '',
            place:         data.place        ?? '',
            price:         data.price        ?? '',
            contact:       data.contact      ?? '',
            notes:         data.notes        ?? '',
            is_active:     data.is_active    ?? false,
            sponsor_logos: data.sponsor_logos ?? [],
          });
          setCampaignId(data.id);
        }
      });
  }, []);

  // ── Cambios en inputs de texto ─────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Toggle visible / oculta ────────────────────────────────────────────────
  const toggleActive = async () => {
    const next = !form.is_active;
    setForm(prev => ({ ...prev, is_active: next }));
    if (campaignId) {
      await supabase.from('campaigns').update({ is_active: next }).eq('id', campaignId);
    }
  };

  // ── Guardar todos los cambios ──────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setMsg(null);

    const payload = {
      title:         form.title.trim(),
      subtitle:      form.subtitle?.trim() ?? '',
      month:         form.month?.trim()    ?? '',
      date_label:    form.date_label?.trim() ?? '',
      place:         form.place?.trim()    ?? '',
      price:         form.price?.trim()    ?? '',
      contact:       form.contact?.trim()  ?? '',
      notes:         form.notes?.trim()    ?? '',
      is_active:     form.is_active,
      sponsor_logos: form.sponsor_logos ?? [],
    };

    let dbError = null;

    if (campaignId) {
      const { error } = await supabase.from('campaigns').update(payload).eq('id', campaignId);
      dbError = error;
    } else {
      const { data, error } = await supabase.from('campaigns').insert([payload]).select().single();
      dbError = error;
      if (data) setCampaignId(data.id);
    }

    setSaving(false);
    setMsg(dbError
      ? { text: 'Error al guardar. Intenta de nuevo.', type: 'err' }
      : { text: '¡Guardado correctamente! 🎉', type: 'ok' }
    );
  };

  // ── Subir logos de patrocinadores ──────────────────────────────────────────
  const handleLogosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const current   = form.sponsor_logos ?? [];
    const remaining = 4 - current.length;

    if (remaining <= 0) {
      setMsg({ text: 'Ya tienes el máximo de 4 logos.', type: 'err' });
      return;
    }

    const toUpload = files.slice(0, remaining);
    if (files.length > remaining) {
      setMsg({ text: `Solo se subirán ${remaining} logo(s) — límite de 4 alcanzado.`, type: 'err' });
    }

    setUploadingLogos(true);
    const urls: string[] = [];

    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        setMsg({ text: 'Un archivo supera 5 MB y fue omitido.', type: 'err' });
        continue;
      }
      const ext      = file.name.split('.').pop();
      const fileName = `sponsors/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from('cat-photos')
        .upload(fileName, file, { upsert: true });

      if (error) continue;

      const { data: { publicUrl } } = supabase.storage
        .from('cat-photos')
        .getPublicUrl(fileName);

      urls.push(publicUrl);
    }

    setForm(prev => ({
      ...prev,
      sponsor_logos: [...(prev.sponsor_logos ?? []), ...urls],
    }));
    setUploadingLogos(false);

    // Limpiar el input para poder subir el mismo archivo otra vez si se necesita
    if (logosInputRef.current) logosInputRef.current.value = '';
  };

  // ── Eliminar un logo ───────────────────────────────────────────────────────
  const removeLogo = (index: number) => {
    setForm(prev => ({
      ...prev,
      sponsor_logos: (prev.sponsor_logos ?? []).filter((_, i) => i !== index),
    }));
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-orange-900">Campaña en el home</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Los cambios se reflejan en la página principal al guardar.
          </p>
        </div>

        {/* Toggle visible / oculta */}
        <button
          onClick={toggleActive}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${
            form.is_active
              ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
              : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300'
          }`}
        >
          {form.is_active ? '✅ Visible en home' : '🙈 Oculta'}
        </button>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl border border-orange-100 p-6 flex flex-col gap-5">

        {/* Campos de texto */}
        {FIELDS.map(f => (
          <div key={f.name as string} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{f.label}</label>
            {f.multi ? (
              <textarea
                name={f.name as string}
                value={(form as any)[f.name] ?? ''}
                onChange={handleChange}
                placeholder={f.placeholder}
                rows={2}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
              />
            ) : (
              <input
                name={f.name as string}
                value={(form as any)[f.name] ?? ''}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            )}
          </div>
        ))}

        {/* Divider */}
        <hr className="border-orange-100" />

        {/* Logos patrocinadores */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Logos patrocinadores{' '}
              <span className="text-gray-400 font-normal">
                ({(form.sponsor_logos ?? []).length}/4)
              </span>
            </label>
            {(form.sponsor_logos ?? []).length < 4 && (
              <button
                type="button"
                onClick={() => logosInputRef.current?.click()}
                disabled={uploadingLogos}
                className="text-xs text-orange-500 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:bg-orange-50 transition disabled:opacity-60"
              >
                {uploadingLogos ? 'Subiendo...' : '+ Agregar logo'}
              </button>
            )}
          </div>

          <input
            ref={logosInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleLogosUpload}
            className="hidden"
          />

          {(form.sponsor_logos ?? []).length === 0 ? (
            <p className="text-xs text-gray-400 italic">
              Sin logos aún. Puedes agregar entre 1 y 4.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              {(form.sponsor_logos ?? []).map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`logo ${i + 1}`}
                    className="h-14 w-auto object-contain rounded-lg border border-gray-200 bg-white p-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => removeLogo(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mensaje de feedback */}
        {msg && (
          <div className={`text-sm px-4 py-3 rounded-xl border ${
            msg.type === 'ok'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {msg.text}
          </div>
        )}

        {/* Botón guardar */}
        <div className="flex justify-end pt-1">
          <button
            onClick={handleSave}
            disabled={saving || uploadingLogos}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}