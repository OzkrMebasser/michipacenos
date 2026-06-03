"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import CatForm from "./CatForm";
import CatTable from "./CatTable";
import type { Cat } from "../../lib/types";
import type { Session } from "@supabase/supabase-js";

interface DashboardProps {
  session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    disponible: 0,
    adoptado: 0,
    en_recuperacion: 0,
  });

  const fetchCats = useCallback(async () => {
    const { data, error } = await supabase
      .from("cats")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCats(data);
      setStats({
        total: data.length,
        disponible: data.filter((c) => c.status === "disponible").length,
        adoptado: data.filter((c) => c.status === "adoptado").length,
        en_recuperacion: data.filter((c) => c.status === "en_recuperacion")
          .length,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleEdit = (cat: Cat) => {
    setEditingCat(cat);
    setView("edit");
  };

  // const handleDelete = async (id: string) => {
  //   if (!confirm("¿Eliminar este michi?")) return;
  //   await supabase.from("cats").delete().eq("id", id);
  //   fetchCats();
  // };
  //   const handleDelete = async (id: string) => {
  //   if (!confirm("¿Eliminar este michi? Quedará archivado 3 meses antes de borrarse definitivamente.")) return;
  //   await supabase
  //     .from("cats")
  //     .update({ deleted_at: new Date().toISOString() })
  //     .eq("id", id);
  //   fetchCats();
  // };
  const handleDelete = async (id: string) => {
    if (
      !confirm("¿Archivar este michi? Se borrará definitivamente en 6 meses.")
    )
      return;
    await supabase
      .from("cats")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    fetchCats();
  };

  const handleSave = () => {
    setView("list");
    setEditingCat(null);
    fetchCats();
  };

  const handleCancel = () => {
    setView("list");
    setEditingCat(null);
  };

  return (
    <div className="min-h-screen bg-white mt-[6.5rem]">
      {/* Navbar */}
      <nav className="bg-white border-b border-t border-gray-300 px-4 sm:px-6 py-4 sticky top-0 z-10">
        {/* Fila principal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐱</span>
            <div>
              <h1 className="font-black text-gray-800 leading-tight text-sm sm:text-base">
                Panel Administrativo
              </h1>
              <p className="text-xs text-gray-400 truncate max-w-[160px] sm:max-w-none">
                {session.user.email}
              </p>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/admin/estadisticas"
              className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              📊 Estadisticas
            </Link>   
            <Link
              href="/admin/campana"
              className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              📣 Crear campaña
            </Link>
            <Link
              href="/admin/adopciones"
              className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              🏠 Adopciones
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-white bg-red-500 font-medium px-4 py-2 rounded-xl hover:bg-red-600 transition hover:scale-105"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="sm:hidden p-2 rounded-xl hover:bg-gray-100 transition"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu desplegable */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
        >
          <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
               <Link
              href="/admin/estadisticas"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-2 rounded-xl hover:bg-gray-100 transition"
            >
               📊 Estadisticas
            </Link>
            <Link
              href="/admin/campana"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              📣 Crear campaña
            </Link>
            <Link
              href="/admin/adopciones"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              🏠 Adopciones
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="text-left text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-xl hover:bg-red-50 transition"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total michis"
            value={stats.total}
            emoji="🐾"
            color="orange"
          />
          <StatCard
            label="Disponibles"
            value={stats.disponible}
            emoji="💚"
            color="green"
          />
          <StatCard
            label="En Recuperación"
            value={stats.en_recuperacion}
            emoji="🔄"
            color="yellow"
          />
          <StatCard
            label="Adoptados"
            value={stats.adoptado}
            emoji="🏠"
            color="blue"
          />
        </div>

        {/* Header bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-orange-900">
            {view === "list"
              ? "Michis registrados"
              : view === "add"
                ? "Agregar michi"
                : "Editar michi"}
          </h2>

          {view === "list" ? (
            <button
              onClick={() => setView("add")}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
            >
              <span>+</span> Agregar michi
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-white transition"
            >
              ← Volver
            </button>
          )}
        </div>

        {/* Content */}
        {view === "list" ? (
          <CatTable
            cats={cats}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <CatForm
            cat={editingCat}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  emoji,
  color,
}: {
  label: string;
  value: number;
  emoji: string;
  color: "orange" | "green" | "yellow" | "blue";
}) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-4 flex flex-col gap-1">
      <span className="text-xl">{emoji}</span>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
