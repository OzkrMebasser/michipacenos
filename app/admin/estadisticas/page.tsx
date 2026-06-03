"use client";
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/admin/lib/supabase";
import {  useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────
interface StatRow {
  id: string;
  icon: string;
  value: string;
  label: string;
  color: string;
  sort_order: number;
  breakdown_a_label: string | null;
  breakdown_a_value: string | null;
  breakdown_b_label: string | null;
  breakdown_b_value: string | null;
}

const EMPTY_STAT: Omit<StatRow, "id"> = {
  icon: "🐱",
  value: "0",
  label: "",
  color: "text-pink-500",
  sort_order: 99,
  breakdown_a_label: null,
  breakdown_a_value: null,
  breakdown_b_label: null,
  breakdown_b_value: null,
};

const COLOR_OPTIONS = [
  { label: "Verde", value: "text-green-600" },
  { label: "Rosa", value: "text-pink-500" },
  { label: "Teal", value: "text-teal-500" },
  { label: "Rojo", value: "text-red-500" },
  { label: "Naranja", value: "text-orange-500" },
  { label: "Morado", value: "text-purple-500" },
  { label: "Azul", value: "text-blue-500" },
  { label: "Amarillo", value: "text-yellow-500" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers UI
// ─────────────────────────────────────────────────────────────────────────────
function colorDot(tw: string) {
  const map: Record<string, string> = {
    "text-green-600": "#16a34a",
    "text-pink-500": "#ec4899",
    "text-teal-500": "#14b8a6",
    "text-red-500": "#ef4444",
    "text-orange-500": "#f97316",
    "text-purple-500": "#a855f7",
    "text-blue-500": "#3b82f6",
    "text-yellow-500": "#eab308",
  };
  return map[tw] ?? "#6b7280";
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal de edición / creación
// ─────────────────────────────────────────────────────────────────────────────
function StatModal({
  stat,
  onClose,
  onSave,
}: {
  stat: StatRow | null; // null = nueva
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState<Omit<StatRow, "id">>(
    stat
      ? { ...stat }
      : { ...EMPTY_STAT }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    if (!form.label.trim() || !form.value.trim()) {
      setError("El valor y la etiqueta son obligatorios.");
      return;
    }
    setSaving(true);
    setError(null);

    // Limpiar breakdowns vacíos
    const payload = {
      ...form,
      breakdown_a_label: form.breakdown_a_label || null,
      breakdown_a_value: form.breakdown_a_value || null,
      breakdown_b_label: form.breakdown_b_label || null,
      breakdown_b_value: form.breakdown_b_value || null,
    };

    if (stat) {
      const { error: err } = await supabase
        .from("stats")
        .update(payload)
        .eq("id", stat.id);
      if (err) setError(err.message);
      else { onSave(); onClose(); }
    } else {
      const { error: err } = await supabase.from("stats").insert(payload);
      if (err) setError(err.message);
      else { onSave(); onClose(); }
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">
            {stat ? "Editar estadística" : "Nueva estadística"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm">
              {error}
            </div>
          )}

          {/* Icono + Valor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Icono (emoji)
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={form.icon}
                onChange={(e) => set("icon", e.target.value)}
                maxLength={4}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Valor (ej: 256+)
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
              />
            </div>
          </div>

          {/* Etiqueta */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Etiqueta
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={form.label}
              onChange={(e) => set("label", e.target.value)}
              placeholder="ej: Michis rescatados"
            />
          </div>

          {/* Color + Orden */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Color
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: colorDot(form.color) }}
                />
                <select
                  className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 appearance-none bg-white"
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Orden
              </label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={form.sort_order}
                onChange={(e) =>
                  set("sort_order", parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>

          {/* Breakdown */}
          <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Desglose (opcional)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Etiqueta A (ej: Hembras)
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  value={form.breakdown_a_label ?? ""}
                  onChange={(e) =>
                    set("breakdown_a_label", e.target.value || null)
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Valor A (ej: 150)
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  value={form.breakdown_a_value ?? ""}
                  onChange={(e) =>
                    set("breakdown_a_value", e.target.value || null)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Etiqueta B (ej: Machos)
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  value={form.breakdown_b_label ?? ""}
                  onChange={(e) =>
                    set("breakdown_b_label", e.target.value || null)
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Valor B (ej: 106)
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  value={form.breakdown_b_value ?? ""}
                  onChange={(e) =>
                    set("breakdown_b_value", e.target.value || null)
                  }
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Vista previa
            </p>
            <div className="inline-block text-center p-5 rounded-2xl bg-white shadow-md min-w-[140px]">
              <span className="text-3xl">{form.icon || "?"}</span>
              <p className={`text-3xl font-black mt-1 ${form.color}`}>
                {form.value || "0"}
              </p>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {form.label || "Etiqueta"}
              </p>
              {form.breakdown_a_label && form.breakdown_a_value && (
                <div className="mt-2 flex justify-center gap-3 text-xs text-gray-400">
                  <span>
                    {form.breakdown_a_label}:{" "}
                    <strong className="text-gray-600">
                      {form.breakdown_a_value}
                    </strong>
                  </span>
                  {form.breakdown_b_label && form.breakdown_b_value && (
                    <span>
                      {form.breakdown_b_label}:{" "}
                      <strong className="text-gray-600">
                        {form.breakdown_b_value}
                      </strong>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold transition disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────────────────────────────────────
export default function EstadisticasAdminPage() {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editStat, setEditStat] = useState<StatRow | null | undefined>(
    undefined
  ); // undefined = modal cerrado, null = nueva
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

 const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("stats")
      .select("*")
      .order("sort_order", { ascending: true });
    setStats((data as StatRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta estadística?")) return;
    setDeletingId(id);
    await supabase.from("stats").delete().eq("id", id);
    showToast("Estadística eliminada");
    await load();
    setDeletingId(null);
  }

  async function moveOrder(stat: StatRow, dir: -1 | 1) {
    const newOrder = stat.sort_order + dir;
    await supabase
      .from("stats")
      .update({ sort_order: newOrder })
      .eq("id", stat.id);
    await load();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-right">
          ✓ {toast}
        </div>
      )}

      {/* Modal */}
      {editStat !== undefined && (
        <StatModal
          stat={editStat}
          onClose={() => setEditStat(undefined)}
          onSave={() => {
            showToast(editStat ? "Cambios guardados" : "Estadística creada");
            load();
          }}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between mt-24">
        <div>
          <h1 className="text-xl font-bold text-gray-800">📊 Estadísticas</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Los números que aparecen en el sitio público
          </p>
        </div>
        {/* <button
          onClick={() => setEditStat(null)}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
        >
          <span className="text-lg leading-none">+</span> Nueva estadística
        </button> */}

        <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            ← Volver
          </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Vista previa del sitio */}
        {!loading && stats.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Vista previa — como se ve en el sitio
            </p>
            <div className="bg-white rounded-2xl shadow-inner border border-gray-100 py-6 px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div
                    key={s.id}
                    className="text-center p-4 rounded-xl bg-gray-50"
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <p className={`text-2xl font-black mt-1 ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {s.label}
                    </p>
                    {s.breakdown_a_label && s.breakdown_a_value && (
                      <div className="mt-1.5 flex justify-center gap-2 text-[10px] text-gray-400">
                        <span>
                          {s.breakdown_a_label}:{" "}
                          <strong className="text-gray-600">
                            {s.breakdown_a_value}
                          </strong>
                        </span>
                        {s.breakdown_b_label && s.breakdown_b_value && (
                          <span>
                            {s.breakdown_b_label}:{" "}
                            <strong className="text-gray-600">
                              {s.breakdown_b_value}
                            </strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabla de edición */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Gestionar estadísticas
        </p>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            Cargando…
          </div>
        ) : stats.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            No hay estadísticas aún.{" "}
            <button
              onClick={() => setEditStat(null)}
              className="text-pink-500 underline"
            >
              Crear la primera
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.map((s, idx) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
              >
                {/* Orden */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveOrder(s, -1)}
                    disabled={idx === 0}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none"
                    title="Subir"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveOrder(s, 1)}
                    disabled={idx === stats.length - 1}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none"
                    title="Bajar"
                  >
                    ▼
                  </button>
                </div>

                {/* Icono + número */}
                <div className="text-center min-w-[56px]">
                  <div className="text-2xl">{s.icon}</div>
                  <div className={`text-lg font-black ${s.color}`}>
                    {s.value}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm">
                    {s.label}
                  </p>
                  {s.breakdown_a_label && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {s.breakdown_a_label}: {s.breakdown_a_value}
                      {s.breakdown_b_label &&
                        `  ·  ${s.breakdown_b_label}: ${s.breakdown_b_value}`}
                    </p>
                  )}
                </div>

                {/* Color pill */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colorDot(s.color) }}
                  title={s.color}
                />

                {/* Acciones */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditStat(s)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {deletingId === s.id ? "…" : "Eliminar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}