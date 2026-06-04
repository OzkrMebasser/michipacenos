"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdoptionBannerAdmin() {
  const [rowId, setRowId]       = useState<string | null>(null);
  const [img, setImg]           = useState<string | null>(null);
  const [savedImg, setSavedImg] = useState<string | null>(null); // snapshot guardado en BD
  const [isActive, setIsActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState<{ text: string; type: "ok" | "err" } | null>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  // isDirty: hay una imagen nueva que aún no se ha guardado
  const isDirty = img !== savedImg;

  // Cargar fila más reciente de adoptions_banner al montar
  useEffect(() => {
    supabase
      .from("adoptions_banner")
      .select("id, img_url, is_active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setRowId(data.id);
          setImg(data.img_url ?? null);
          setSavedImg(data.img_url ?? null); // snapshot inicial
          setIsActive(data.is_active ?? false);
        }
      });
  }, []);

  // Toggle visible / oculta (se guarda directo, no necesita "Guardar imagen")
  const toggleActive = async () => {
    const next = !isActive;
    setIsActive(next);
    if (rowId) {
      await supabase
        .from("adoptions_banner")
        .update({ is_active: next })
        .eq("id", rowId);
    }
  };

  // Subir imagen al storage y guardar URL en estado
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ text: "El archivo supera 5 MB.", type: "err" });
      return;
    }

    setUploading(true);
    setMsg(null);

    const ext = file.name.split(".").pop();
    const fileName = `adoptions-banner/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("cat-photos")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setMsg({ text: "Error al subir la imagen.", type: "err" });
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("cat-photos").getPublicUrl(fileName);

    setImg(publicUrl); // isDirty se activa porque img !== savedImg
    setUploading(false);

    if (inputRef.current) inputRef.current.value = "";
  };

  // Guardar en adoptions_banner
  const handleSave = async () => {
    if (!img) {
      setMsg({ text: "Sube una imagen primero.", type: "err" });
      return;
    }

    setSaving(true);
    setMsg(null);

    let dbError = null;

    if (rowId) {
      const { error } = await supabase
        .from("adoptions_banner")
        .update({ img_url: img, is_active: isActive })
        .eq("id", rowId);
      dbError = error;
    } else {
      const { data, error } = await supabase
        .from("adoptions_banner")
        .insert([{ img_url: img, is_active: isActive }])
        .select()
        .single();
      dbError = error;
      if (data) setRowId(data.id);
    }

    if (!dbError) {
      setSavedImg(img); // sincronizar snapshot — isDirty vuelve a false
    }

    setSaving(false);
    setMsg(
      dbError
        ? { text: "Error al guardar. Intenta de nuevo.", type: "err" }
        : { text: "¡Imagen guardada! 🎉", type: "ok" }
    );
  };

  // Eliminar imagen
  const handleDelete = async () => {
    if (!confirm("¿Eliminar la imagen del banner?")) return;
    setImg(null);
    setIsActive(false);
    if (rowId) {
      await supabase
        .from("adoptions_banner")
        .update({ img_url: null, is_active: false })
        .eq("id", rowId);
      setSavedImg(null); // también actualizar snapshot
    }
  };

  
  // Render
  return (
    <div className="mt-20">
      {/* Header */}
    
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-pink-700">
            Foto promo adopciones
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Aparece debajo de la campaña en el home. Independiente de la campaña.
          </p>
        </div>

        {/* Toggle visible / oculta */}
        <button
          onClick={toggleActive}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${
            isActive
              ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
              : "bg-white text-gray-500 border-gray-200 hover:border-pink-300"
          }`}
        >
          {isActive ? "✅ Visible en home" : "🙈 Oculta"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 p-6 flex flex-col gap-5">
        {/* Preview / zona de imagen */}
        {img ? (
          <div className="relative group rounded-xl overflow-hidden border border-gray-100">
            <img
              src={img}
              alt="Banner adopciones"
              className="w-full object-cover max-h-72"
            />
            <button
              onClick={handleDelete}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow opacity-0 group-hover:opacity-100 transition"
            >
              ✕ Eliminar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-pink-200 rounded-xl py-12 flex flex-col items-center gap-2 text-pink-400 hover:border-pink-400 hover:bg-pink-50 transition disabled:opacity-60"
          >
            <span className="text-3xl">🖼️</span>
            <span className="text-sm font-semibold">
              {uploading ? "Subiendo..." : "Subir foto"}
            </span>
            <span className="text-xs text-gray-400">JPG, PNG, WEBP · máx 5 MB</span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

        {/* Cambiar imagen si ya hay una */}
        {img && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-xs text-pink-500 hover:text-pink-700 font-semibold px-3 py-1.5 rounded-lg border border-pink-200 hover:bg-pink-50 transition disabled:opacity-60 self-start"
          >
            {uploading ? "Subiendo..." : "↩ Cambiar imagen"}
          </button>
        )}

        {msg && (
          <div
            className={`text-sm px-4 py-3 rounded-xl border ${
              msg.type === "ok"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSave}
            disabled={saving || uploading || !isDirty}
            className={`text-sm font-semibold px-6 py-2.5 rounded-xl transition ${
              isDirty && !saving
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? "Guardando..." : "Guardar imagen"}
          </button>
        </div>
      </div>
    </div>
  );
}