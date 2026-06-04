"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import AdoptionBannerAdmin from "../components/AdoptionBannerAdmin";
import type { Campaign } from "../../lib/types";
import { useRouter } from "next/navigation";

const FALLBACK: Omit<Campaign, "id" | "created_at"> = {
  title: "Campaña de esterilización felina",
  subtitle: "Bajo costo",
  month: "Mayo",
  date_label: "Domingo 17",
  place: "Plaza Paseo La Paz",
  price: "$200 por gato",
  contact: "WhatsApp\n612 176 7890",
  notes: "Solo se recibirán gatos con cita | Cupo limitado",
  is_active: false,
  sponsor_logos: [],
  facebook_url: "",
};

const FIELDS: {
  name: keyof typeof FALLBACK;
  label: string;
  multi?: boolean;
}[] = [
  { name: "title",        label: "Título" },
  { name: "subtitle",     label: "Subtítulo" },
  { name: "month",        label: "Mes / periodo" },
  { name: "date_label",   label: "Fecha" },
  { name: "place",        label: "Lugar" },
  { name: "price",        label: "Cuota de recuperación" },
  { name: "contact",      label: "Contacto / citas",           multi: true },
  { name: "notes",        label: "Nota al pie",                multi: true },
  { name: "facebook_url", label: "Link de Facebook para compartir" },
];

type Tab = "esterilizaciones" | "banner-adopciones";

export default function CampanaPage() {
  const [tab, setTab] = useState<Tab>("esterilizaciones");

  const [placeholders, setPlaceholders] = useState<Omit<Campaign, "id" | "created_at">>(FALLBACK);
  const [form, setForm] = useState<Omit<Campaign, "id" | "created_at">>({
    ...FALLBACK,
    title: "", subtitle: "", month: "", date_label: "",
    place: "", price: "", contact: "", notes: "", facebook_url: "",
  });
  const [campaignId, setCampaignId]         = useState<string | null>(null);
  const [saving, setSaving]                 = useState(false);
  const [uploadingLogos, setUploadingLogos] = useState(false);
  const [isDirty, setIsDirty]               = useState(false);
  const [msg, setMsg]                       = useState<{ text: string; type: "ok" | "err" } | null>(null);
  const logosInputRef                       = useRef<HTMLInputElement>(null);
  const savedRef                            = useRef<Omit<Campaign, "id" | "created_at"> | null>(null);
  const router                              = useRouter();

  useEffect(() => {
    supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          const loaded: Omit<Campaign, "id" | "created_at"> = {
            title:         data.title         ?? FALLBACK.title,
            subtitle:      data.subtitle      ?? FALLBACK.subtitle,
            month:         data.month         ?? FALLBACK.month,
            date_label:    data.date_label    ?? FALLBACK.date_label,
            place:         data.place         ?? FALLBACK.place,
            price:         data.price         ?? FALLBACK.price,
            contact:       data.contact       ?? FALLBACK.contact,
            notes:         data.notes         ?? FALLBACK.notes,
            is_active:     data.is_active     ?? FALLBACK.is_active,
            sponsor_logos: data.sponsor_logos ?? [],
            facebook_url:  data.facebook_url  ?? FALLBACK.facebook_url,
          };
          setPlaceholders(loaded);
          setForm(loaded);
          setCampaignId(data.id);
          savedRef.current = loaded;
        }
      });
  }, []);

  const checkDirty = (next: Omit<Campaign, "id" | "created_at">) => {
    if (!savedRef.current) { setIsDirty(true); return; }
    const s = savedRef.current;
    const textChanged =
      next.title        !== s.title        ||
      next.subtitle     !== s.subtitle     ||
      next.month        !== s.month        ||
      next.date_label   !== s.date_label   ||
      next.place        !== s.place        ||
      next.price        !== s.price        ||
      next.contact      !== s.contact      ||
      next.notes        !== s.notes        ||
      next.facebook_url !== s.facebook_url;
    const logosChanged =
      JSON.stringify(next.sponsor_logos) !== JSON.stringify(s.sponsor_logos);
    setIsDirty(textChanged || logosChanged);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => {
      const next = { ...prev, [e.target.name]: e.target.value };
      checkDirty(next);
      return next;
    });
  };

  const toggleActive = async () => {
    const next = !form.is_active;
    setForm((prev) => ({ ...prev, is_active: next }));
    if (campaignId) {
      await supabase.from("campaigns").update({ is_active: next }).eq("id", campaignId);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);

    const resolve = (field: keyof typeof FALLBACK) => {
      const val = (form as any)[field];
      return typeof val === "string"
        ? val.trim() || (placeholders as any)[field]
        : val;
    };

    const payload = {
      title:         resolve("title"),
      subtitle:      resolve("subtitle"),
      month:         resolve("month"),
      date_label:    resolve("date_label"),
      place:         resolve("place"),
      price:         resolve("price"),
      contact:       resolve("contact"),
      notes:         resolve("notes"),
      is_active:     form.is_active,
      sponsor_logos: form.sponsor_logos ?? [],
      facebook_url:  resolve("facebook_url"),
    };

    let dbError = null;

    if (campaignId) {
      const { error } = await supabase.from("campaigns").update(payload).eq("id", campaignId);
      dbError = error;
    } else {
      const { data, error } = await supabase.from("campaigns").insert([payload]).select().single();
      dbError = error;
      if (data) setCampaignId(data.id);
    }

    if (!dbError) {
      savedRef.current = { ...form, ...payload };
      setPlaceholders((prev) => ({ ...prev, ...payload }));
      setIsDirty(false);
    }

    setSaving(false);
    setMsg(
      dbError
        ? { text: "Error al guardar. Intenta de nuevo.", type: "err" }
        : { text: "¡Guardado correctamente! 🎉", type: "ok" },
    );
  };

  const handleLogosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const current   = form.sponsor_logos ?? [];
    const remaining = 4 - current.length;

    if (remaining <= 0) { setMsg({ text: "Ya tienes el máximo de 4 logos.", type: "err" }); return; }

    const toUpload = files.slice(0, remaining);
    if (files.length > remaining) {
      setMsg({ text: `Solo se subirán ${remaining} logo(s) — límite de 4 alcanzado.`, type: "err" });
    }

    setUploadingLogos(true);
    const urls: string[] = [];

    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        setMsg({ text: "Un archivo supera 5 MB y fue omitido.", type: "err" });
        continue;
      }
      const ext      = file.name.split(".").pop();
      const fileName = `sponsors/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("cat-photos").upload(fileName, file, { upsert: true });
      if (error) continue;
      const { data: { publicUrl } } = supabase.storage.from("cat-photos").getPublicUrl(fileName);
      urls.push(publicUrl);
    }

    setForm((prev) => {
      const next = { ...prev, sponsor_logos: [...(prev.sponsor_logos ?? []), ...urls] };
      checkDirty(next);
      return next;
    });
    setUploadingLogos(false);
    if (logosInputRef.current) logosInputRef.current.value = "";
  };

  const removeLogo = (index: number) => {
    setForm((prev) => {
      const next = { ...prev, sponsor_logos: (prev.sponsor_logos ?? []).filter((_, i) => i !== index) };
      checkDirty(next);
      return next;
    });
  };

  // ── Estilos de tab ─────────────────────────────────────────────────────────
  const tabClass = (t: Tab) =>
    `py-3 px-1 border-b-2 text-sm font-medium transition cursor-pointer ${
      tab === t
        ? t === "esterilizaciones"
          ? "border-orange-500 text-orange-600"
          : "border-pink-500 text-pink-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="w-full mx-auto px-6 py-8 pt-36 max-w-3xl">

      {/* Nav sticky */}
      <nav className="bg-white border-b border-t border-gray-300 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <h2 className="text-lg font-bold text-orange-900">
              Gestionar Campaña o Banner de Adopciones
            </h2>
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            ← Volver
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-t border-gray-200 flex gap-6">
          <button className={tabClass("esterilizaciones")} onClick={() => setTab("esterilizaciones")}>
            Esterilizaciones
          </button>
          <button className={tabClass("banner-adopciones")} onClick={() => setTab("banner-adopciones")}>
            Banner Adopciones
          </button>
        </div>
      </nav>

      {/* ── TAB: Esterilizaciones ─────────────────────────────────────────── */}
      {tab === "esterilizaciones" && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-orange-900">Campaña en el home</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Los cambios se reflejan en la página principal al guardar.
              </p>
            </div>
            <button
              onClick={toggleActive}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                form.is_active
                  ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-orange-300"
              }`}
            >
              {form.is_active ? "✅ Visible en home" : "🙈 Oculta"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 p-6 flex flex-col gap-5">
            {FIELDS.map((f) => (
              <div key={f.name as string} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">{f.label}</label>
                {f.multi ? (
                  <textarea
                    name={f.name as string}
                    value={(form as any)[f.name] ?? ""}
                    onChange={handleChange}
                    placeholder={(placeholders as any)[f.name] ?? ""}
                    rows={2}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
                  />
                ) : (
                  <input
                    name={f.name as string}
                    value={(form as any)[f.name] ?? ""}
                    onChange={handleChange}
                    placeholder={(placeholders as any)[f.name] ?? ""}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                )}
              </div>
            ))}

            <hr className="border-orange-100" />

            {/* Logos patrocinadores */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Logos patrocinadores{" "}
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
                    {uploadingLogos ? "Subiendo..." : "+ Agregar logo"}
                  </button>
                )}
              </div>

              <input
                title="Logos patrocinadores"
                ref={logosInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleLogosUpload}
                className="hidden"
              />

              {(form.sponsor_logos ?? []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">Sin logos aún. Puedes agregar entre 1 y 4.</p>
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
                disabled={saving || uploadingLogos || !isDirty}
                className={`text-sm font-semibold px-6 py-2.5 rounded-xl transition ${
                  isDirty && !saving
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Banner Adopciones ────────────────────────────────────────── */}
      {tab === "banner-adopciones" && (
        <div className="mt-8">
          <AdoptionBannerAdmin />
        </div>
      )}

    </div>
  );
}