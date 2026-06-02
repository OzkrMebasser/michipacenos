"use client";

import { useState, useRef } from "react";
import { supabase, type CatInsert } from "../lib/supabase";
import type { Cat } from "../../lib/types";

interface CatFormProps {
  cat: Cat | null;
  onSave: () => void;
  onCancel: () => void;
}

const EMPTY_FORM: CatInsert = {
  name: "",
  age: "",
  gender: "macho",
  color: "",
  description: "",
  status: "disponible",
  image_url: null,
  photos: [],
  sterilized: false,
  sterilization_date: null,
  sterilization_reserved_date: null,
  ficha: null,
  deleted_at: null,
  ficha: null,
};

export default function CatForm({ cat, onSave, onCancel }: CatFormProps) {
  const isEditing = !!cat;
  const [form, setForm] = useState<CatInsert>(
    cat ? {
      name: cat.name,
      age: cat.age,
      gender: cat.gender,
      color: cat.color,
      description: cat.description,
      status: cat.status,
      image_url: cat.image_url,
      photos: cat.photos ?? [],
      sterilized: cat.sterilized ?? false,
      sterilization_date: cat.sterilization_date ?? null,
      sterilization_reserved_date: cat.sterilization_reserved_date ?? null,
      ficha: cat.ficha ?? null,
      deleted_at: cat.deleted_at ?? null,
    } : EMPTY_FORM,
  );

  const [uploading, setUploading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(cat?.image_url ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("La imagen no puede pesar más de 5 MB."); return; }

    setUploading(true);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    const ext = file.name.split(".").pop();
    const fileName = `cats/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("cat-photos").upload(fileName, file, { upsert: true });
    if (uploadError) { setError("Error al subir la imagen."); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from("cat-photos").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, image_url: publicUrl }));
    setUploading(false);
  };

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const currentPhotos = form.photos ?? [];
    const remaining = 5 - currentPhotos.length;

    if (remaining <= 0) { setError("Ya tienes el máximo de 5 fotos."); return; }

    const filesToUpload = files.slice(0, remaining);
    if (files.length > remaining) setError(`Solo se subieron ${remaining} foto(s) — límite de 5 alcanzado.`);

    setUploadingPhotos(true);
    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      if (file.size > 5 * 1024 * 1024) { setError("Una imagen supera 5 MB y fue omitida."); continue; }
      const ext = file.name.split(".").pop();
      const fileName = `cats/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("cat-photos").upload(fileName, file, { upsert: true });
      if (uploadError) continue;
      const { data: { publicUrl } } = supabase.storage.from("cat-photos").getPublicUrl(fileName);
      uploadedUrls.push(publicUrl);
    }

    setForm((prev) => ({ ...prev, photos: [...(prev.photos ?? []), ...uploadedUrls] }));
    setUploadingPhotos(false);
  };

  const removePhoto = (index: number) => {
    setForm((prev) => ({ ...prev, photos: (prev.photos ?? []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: CatInsert = {
      name: form.name.trim(),
      age: form.age.trim(),
      gender: form.gender,
      color: form.color.trim(),
      description: form.description.trim(),
      status: form.status,
      image_url: form.image_url || null,
      photos: form.photos ?? [],
      sterilized: form.sterilized,
      sterilization_date: form.sterilized ? (form.sterilization_date || null) : null,
      sterilization_reserved_date: !form.sterilized ? (form.sterilization_reserved_date || null) : null,
      ficha: form.ficha ? form.ficha.trim() : null,
      deleted_at: cat.deleted_at,
    };

    let dbError = null;
    if (isEditing) {
      const { error } = await supabase.from("cats").update(payload).eq("id", cat.id);
      dbError = error;
    } else {
      const { error } = await supabase.from("cats").insert([payload]);
      dbError = error;
    }

    if (dbError) { setError("Error al guardar. Revisa los datos e intenta de nuevo."); setSaving(false); return; }
    onSave();
  };

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-6 sm:p-8 text-gray-900">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Main image */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-700 self-start">Foto principal *</p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-2xl bg-orange-50 border-2 border-dashed border-orange-200 flex items-center justify-center cursor-pointer hover:bg-orange-100 transition overflow-hidden"
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
          <input title="main image" ref={fileInputRef} type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
          <p className="text-xs text-gray-400">JPG, PNG o WEBP · máx 5 MB</p>
        </div>

        {/* Extra photos */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Fotos adicionales <span className="text-gray-400">({(form.photos ?? []).length}/5)</span></p>
            {(form.photos ?? []).length < 5 && (
              <button
                type="button"
                onClick={() => photosInputRef.current?.click()}
                disabled={uploadingPhotos}
                className="text-xs text-orange-500 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:bg-orange-50 transition disabled:opacity-60"
              >
                {uploadingPhotos ? 'Subiendo...' : '+ Agregar fotos'}
              </button>
            )}
          </div>
          <input title="extra photos" ref={photosInputRef} type="file" accept="image/*" multiple onChange={handlePhotosUpload} className="hidden" />

          {(form.photos ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(form.photos ?? []).map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                  <img src={url} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Ej. Luna"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
          </div>
          <div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-gray-700">Ficha</label>
  <input
    name="ficha"
    value={form.ficha ?? ""}
    onChange={handleChange}
    placeholder="Ej. 001, A-23..."
    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
  />
</div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Edad *</label>
            <input name="age" value={form.age} onChange={handleChange} required placeholder="Ej. 2 años, 6 meses"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Género *</label>
            <select title="gender" name="gender" value={form.gender} onChange={handleChange}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white">
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Color / pelaje *</label>
            <select title="color" name="color" value={form.color} onChange={handleChange} required
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white">
              <option value="">Selecciona un pelaje...</option>
              <optgroup label="Colores sólidos">
                <option value="Negro">Negro</option>
                <option value="Blanco">Blanco</option>
                <option value="Gris / azul">Gris / azul</option>
                <option value="Naranja / rojo">Naranja / rojo</option>
                <option value="Crema / beige">Crema / beige</option>
                <option value="Café / marrón">Café / marrón</option>
              </optgroup>
              <optgroup label="Bicolores y multicolor">
                <option value="Blanco y negro">Blanco y negro</option>
                <option value="Naranja y blanco">Naranja y blanco</option>
                <option value="Gris y blanco">Gris y blanco</option>
                <option value="Tricolor (carey)">Tricolor (carey)</option>
                <option value="Tricolor (naranja, negro y blanco)">Tricolor (naranja, negro y blanco)</option>
              </optgroup>
              <optgroup label="Patrones">
                <option value="Atigrado (tabby gris)">Atigrado — tabby gris</option>
                <option value="Atigrado (tabby naranja)">Atigrado — tabby naranja</option>
                <option value="Atigrado (tabby marrón)">Atigrado — tabby marrón</option>
                <option value="Moteado">Moteado</option>
                <option value="Colorpoint (siamés)">Colorpoint — siamés</option>
              </optgroup>
              <optgroup label="Otros">
                <option value="Mixto / no definido">Mixto / no definido</option>
              </optgroup>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Estado de adopción *</label>
            <div className="flex flex-wrap gap-2">
              {(["disponible", "en_recuperacion", "adoptado"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                    form.status === s
                      ? s === "disponible" ? "bg-green-500 text-white border-green-500"
                        : s === "en_recuperacion" ? "bg-yellow-400 text-yellow-900 border-yellow-400"
                        : "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
                  }`}>
                  {s === "disponible" ? "Disponible" : s === "en_recuperacion" ? "En Recuperación" : "Adoptado"}
                </button>
              ))}
            </div>
          </div>

      {/* Esterilización */}
<div className="flex flex-col gap-3 sm:col-span-2">
  <hr className="border-orange-100" />
  <label className="text-sm font-medium text-gray-700">Esterilización</label>

  {/* Toggle Sí / No */}
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => setForm((prev) => ({ ...prev, sterilized: true, sterilization_reserved_date: null }))}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
        form.sterilized
          ? "bg-teal-500 text-white border-teal-500"
          : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
      }`}
    >
      ✓ Sí
    </button>
    <button
      type="button"
      onClick={() => setForm((prev) => ({ ...prev, sterilized: false, sterilization_date: null }))}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
        !form.sterilized
          ? "bg-gray-400 text-white border-gray-400"
          : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
      }`}
    >
      ✗ No
    </button>
  </div>

  {/* Si YA está esterilizado: fecha de esterilización */}
  {form.sterilized && (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500">Fecha de esterilización</label>
      <input
        type="date"
        value={form.sterilization_date ?? ""}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, sterilization_date: e.target.value || null }))
        }
        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition w-full sm:w-56"
      />
      <p className="text-xs text-gray-400">Déjalo vacío si no tienes la fecha exacta.</p>
    </div>
  )}

  {/* Si NO está esterilizado: fecha de reserva */}
  {!form.sterilized && (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500">Fecha de reserva para esterilización</label>
      <input
        type="date"
        value={form.sterilization_reserved_date ?? ""}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, sterilization_reserved_date: e.target.value || null }))
        }
        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition w-full sm:w-56"
      />
      <p className="text-xs text-gray-400">Opcional — si ya tiene cita agendada.</p>
    </div>
  )}
</div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              placeholder="Cuéntanos sobre la personalidad, historia o necesidades especiales de este michi..."
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button type="submit" disabled={saving || uploading || uploadingPhotos}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold transition">
            {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar michi"}
          </button>
        </div>
      </form>
    </div>
  );
}