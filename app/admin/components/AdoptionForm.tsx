"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Adoption, AdoptionInsert } from "../../lib/types";
import type { Cat } from "../../lib/types";

interface AdoptionFormProps {
  adoption: Adoption | null;
  onSave: () => void;
  onCancel: () => void;
}

const EMPTY: AdoptionInsert = {
  cat_id: null,
  adopter_name: "",
  adopter_email: "",
  adopter_phone: "",
  adopter_address: "",
  adoption_date: new Date().toISOString().split("T")[0],
  adoption_place: "",
  notes: "",
};

export default function AdoptionForm({
  adoption,
  onSave,
  onCancel,
}: AdoptionFormProps) {
  const isEditing = !!adoption;
  const [form, setForm] = useState<AdoptionInsert>(
    adoption
      ? {
          cat_id: adoption.cat_id,
          adopter_name: adoption.adopter_name,
          adopter_email: adoption.adopter_email ?? "",
          adopter_phone: adoption.adopter_phone ?? "",
          adopter_address: adoption.adopter_address ?? "",
          adoption_date: adoption.adoption_date,
          adoption_place: adoption.adoption_place ?? "",
          notes: adoption.notes ?? "",
        }
      : EMPTY,
  );
  const [cats, setCats] = useState<Cat[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [followUps, setFollowUps] = useState<FollowUp[]>(
    adoption?.follow_ups ?? [],
  );
  const [newFollowUp, setNewFollowUp] = useState({
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [addingFollowUp, setAddingFollowUp] = useState(false);

  const handleAddFollowUp = () => {
    if (!newFollowUp.note.trim()) return;
    setFollowUps((prev) => [...prev, { ...newFollowUp }]);
    setNewFollowUp({ date: new Date().toISOString().split("T")[0], note: "" });
    setAddingFollowUp(false);
  };

  const handleRemoveFollowUp = (index: number) => {
    setFollowUps((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Cargar todos los gatos para el selector
    supabase
      .from("cats")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data }) => {
        if (data) setCats(data);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: AdoptionInsert = {
      cat_id: form.cat_id || null,
      adopter_name: form.adopter_name.trim(),
      adopter_email: form.adopter_email?.trim() ?? "",
      adopter_phone: form.adopter_phone?.trim() ?? "",
      adopter_address: form.adopter_address?.trim() ?? "",
      adoption_date: form.adoption_date,
      adoption_place: form.adoption_place?.trim() ?? "",
      notes: form.notes?.trim() ?? "",
       follow_ups: followUps,
    };

    let dbError = null;

    if (isEditing) {
      const { error } = await supabase
        .from("adoptions")
        .update(payload)
        .eq("id", adoption.id);
      dbError = error;
    } else {
      const { error } = await supabase.from("adoptions").insert([payload]);
      dbError = error;

      // Si hay gato seleccionado, actualizar su estado a "adoptado"
      if (!error && payload.cat_id) {
        await supabase
          .from("cats")
          .update({ status: "adoptado" })
          .eq("id", payload.cat_id);
      }
    }

    if (dbError) {
      setError("Error al guardar. Revisa los datos e intenta de nuevo.");
      setSaving(false);
      return;
    }

    onSave();
  };

  const fields: {
    name: keyof AdoptionInsert;
    label: string;
    placeholder: string;
    type?: string;
    required?: boolean;
    multi?: boolean;
  }[] = [
    {
      name: "adopter_name",
      label: "Nombre del adoptante *",
      placeholder: "Ej. María García",
      type: "text",
      required: true,
    },
    {
      name: "adopter_email",
      label: "Correo electrónico",
      placeholder: "maria@ejemplo.com",
      type: "email",
    },
    {
      name: "adopter_phone",
      label: "Teléfono / WhatsApp",
      placeholder: "Ej. 612 123 4567",
      type: "tel",
    },
    {
      name: "adopter_address",
      label: "Domicilio",
      placeholder: "Calle, colonia, ciudad",
      type: "text",
    },
    {
      name: "adoption_date",
      label: "Fecha de adopción *",
      placeholder: "",
      type: "date",
      required: true,
    },
    {
      name: "adoption_place",
      label: "Lugar de adopción",
      placeholder: "Ej. Feria en Plaza Paseo",
      type: "text",
    },
    {
      name: "notes",
      label: "Notas adicionales",
      placeholder: "Condiciones, seguimiento...",
      multi: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-6 sm:p-8 text-gray-900">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Selector de gato */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Michi adoptado
          </label>
          <select
            name="cat_id"
            value={form.cat_id ?? ""}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white"
          >
            <option value="">— Sin gato vinculado —</option>
            {cats.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} · {cat.age} · {cat.gender} · {cat.status}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400">
            Al registrar, el estado del michi cambiará automáticamente a
            "Adoptado".
          </p>
        </div>

        <hr className="border-orange-100" />

        {/* Campos del formulario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((f) => (
            <div
              key={f.name as string}
              className={`flex flex-col gap-1.5 ${f.multi ? "sm:col-span-2" : ""}`}
            >
              <label className="text-sm font-medium text-gray-700">
                {f.label}
              </label>
              {f.multi ? (
                <textarea
                  name={f.name as string}
                  value={(form as any)[f.name] ?? ""}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  rows={3}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
                />
              ) : (
                <input
                  name={f.name as string}
                  type={f.type ?? "text"}
                  value={(form as any)[f.name] ?? ""}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required={f.required}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
{/* Seguimientos */}
<div className="flex flex-col gap-3 sm:col-span-2">
  <hr className="border-orange-100" />
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700">
      Seguimientos <span className="text-gray-400 font-normal">({followUps.length})</span>
    </label>
    <button
      type="button"
      onClick={() => setAddingFollowUp(true)}
      className="text-xs text-orange-500 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:bg-orange-50 transition"
    >
      + Agregar seguimiento
    </button>
  </div>

  {/* Form nuevo seguimiento */}
  {addingFollowUp && (
    <div className="bg-orange-50 rounded-xl p-4 flex flex-col gap-3 border border-orange-100">
      <input
        type="date"
        value={newFollowUp.date}
        onChange={e => setNewFollowUp(prev => ({ ...prev, date: e.target.value }))}
        className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <textarea
        value={newFollowUp.note}
        onChange={e => setNewFollowUp(prev => ({ ...prev, note: e.target.value }))}
        placeholder="¿Cómo está el michi? ¿Cómo va la adaptación?..."
        rows={2}
        className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setAddingFollowUp(false)}
          className="text-xs text-gray-500 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleAddFollowUp}
          disabled={!newFollowUp.note.trim()}
          className="text-xs bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-3 py-1.5 rounded-lg transition"
        >
          Guardar seguimiento
        </button>
      </div>
    </div>
  )}

  {/* Lista de seguimientos */}
  {followUps.length === 0 ? (
    <p className="text-xs text-gray-400 italic">Sin seguimientos aún.</p>
  ) : (
    <div className="flex flex-col gap-2">
      {followUps.map((f, i) => (
        <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 flex items-start justify-between gap-3 border border-gray-100 group">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-orange-500 font-semibold">
              {new Date(f.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <p className="text-sm text-gray-700">{f.note}</p>
          </div>
          <button
            type="button"
            onClick={() => handleRemoveFollowUp(i)}
            className="text-red-400 hover:text-red-600 text-xs opacity-0 group-hover:opacity-100 transition flex-shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}
</div>
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
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold transition"
          >
            {saving
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Registrar adopción"}
          </button>
        </div>
      </form>
    </div>
  );
}
