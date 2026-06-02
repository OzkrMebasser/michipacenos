"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import AdoptionForm from "../components/AdoptionForm";
import AdoptionTable from "../components/AdoptionTable";
import type { Adoption } from "../../lib/types";

export default function AdopcionesPage() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingAdoption, setEditingAdoption] = useState<Adoption | null>(null);

  const fetchAdoptions = useCallback(async () => {
    const { data, error } = await supabase
      .from("adoptions")
      .select("*, cat:cats(name, image_url, sterilized, sterilization_date)")
      .order("adoption_date", { ascending: false });

    if (!error && data) setAdoptions(data as Adoption[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAdoptions();
  }, [fetchAdoptions]);

  const handleEdit = (adoption: Adoption) => {
    setEditingAdoption(adoption);
    setView("edit");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este registro de adopción?")) return;
    await supabase.from("adoptions").delete().eq("id", id);
    fetchAdoptions();
  };

  const handleSave = () => {
    setView("list");
    setEditingAdoption(null);
    fetchAdoptions();
  };

  const handleCancel = () => {
    setView("list");
    setEditingAdoption(null);
  };

  return (
    <div className="min-h-screen bg-white mt-[6.5rem]">
      {/* Navbar interno */}
      <nav className="bg-white border-b border-t border-gray-300 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1 className="font-black text-gray-800 leading-tight">
              Registro de Adopciones
            </h1>
            <p className="text-xs text-gray-400">
              Historial de michis adoptados
            </p>
          </div>
        </div>
        <a
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition"
        >
          ← Panel
        </a>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stat rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-orange-100 p-4 flex flex-col gap-1">
            <span className="text-xl">🏠</span>
            <span className="text-2xl font-bold text-gray-900">
              {adoptions.length}
            </span>
            <span className="text-xs text-gray-500">Total adopciones</span>
          </div>
          <div className="bg-white rounded-2xl border border-orange-100 p-4 flex flex-col gap-1">
            <span className="text-xl">📅</span>
            {/* <span className="text-2xl font-bold text-gray-900">
              {adoptions.filter(a => {
                const d = new Date(a.adoption_date);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </span> */}
            <span className="text-2xl font-bold text-gray-900">
              {
                adoptions.filter((a) => {
                  const [year, month] = a.adoption_date.split("-").map(Number);
                  const now = new Date();
                  return (
                    month - 1 === now.getMonth() && year === now.getFullYear()
                  );
                }).length
              }
            </span>{" "}
            <span className="text-xs text-gray-500">Este mes</span>
          </div>
          <div className="bg-white rounded-2xl border border-orange-100 p-4 flex flex-col gap-1">
            <span className="text-xl">🐱</span>
            <span className="text-2xl font-bold text-gray-900">
              {adoptions.filter((a) => a.cat_id).length}
            </span>
            <span className="text-xs text-gray-500">Con michi vinculado</span>
          </div>
        </div>

        {/* Header bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-orange-900">
            {view === "list"
              ? "Adopciones registradas"
              : view === "add"
                ? "Nueva adopción"
                : "Editar adopción"}
          </h2>
          {view === "list" ? (
            <button
              onClick={() => setView("add")}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
            >
              <span>+</span> Registrar adopción
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              ← Volver
            </button>
          )}
        </div>

        {/* Contenido */}
        {view === "list" ? (
          <AdoptionTable
            adoptions={adoptions}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <AdoptionForm
            adoption={editingAdoption}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
