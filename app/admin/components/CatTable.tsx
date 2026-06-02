"use client";

import { useState } from "react";
import type { Cat } from "../../lib/types";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<Cat["status"], { label: string; class: string }> = {
  disponible: { label: "Disponible", class: "bg-green-100 text-green-800" },
  en_recuperacion: {
    label: "En Recuperación",
    class: "bg-yellow-100 text-yellow-800",
  },
  adoptado: { label: "Adoptado", class: "bg-blue-100 text-blue-800" },
};

const STATUS_FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "disponible", label: "Disponible" },
  { key: "en_recuperacion", label: "En Recuperación" },
  { key: "adoptado", label: "Adoptado" },
] as const;

const GENDER_FILTERS = [
  { key: "todos", label: "Ambos" },
  { key: "macho", label: "Machos ♂️" },
  { key: "hembra", label: "Hembras ♀️" },
] as const;

const STERILIZED_FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "si", label: "✂️ Esterilizados" },
  { key: "no", label: "✗ No esterilizados" },
] as const;

interface CatTableProps {
  cats: Cat[];
  loading: boolean;
  onEdit: (cat: Cat) => void;
  onDelete: (id: string) => void;
}

function SterilizedBadge({ cat }: { cat: Cat }) {
  if (!cat.sterilized) {
    const reservedLabel = cat.sterilization_reserved_date
      ? new Date(cat.sterilization_reserved_date + "T12:00").toLocaleDateString(
          "es-MX",
          {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          },
        )
      : null;

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">
        ✗ No
        {reservedLabel && (
          <>
            <span className="w-px h-3 bg-gray-300" />
            <span className="text-orange-500 font-semibold">
              🗓️ {reservedLabel}
            </span>
          </>
        )}
      </span>
    );
  }

  const label = cat.sterilization_date
    ? `✂️ ${new Date(cat.sterilization_date + "T12:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}`
    : "✂️ Sí · sin fecha";
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-100 text-teal-800">
      {label}
    </span>
  );
}
export default function CatTable({
  cats,
  loading,
  onEdit,
  onDelete,
}: CatTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [genderFilter, setGenderFilter] = useState<string>("todos");
  const [sterilizedFilter, setSterilizedFilter] = useState<string>("todos");
  const router = useRouter();
  const filtered = cats.filter((cat) => {
    const matchStatus = statusFilter === "todos" || cat.status === statusFilter;
    const matchGender = genderFilter === "todos" || cat.gender === genderFilter;
    const matchSterilized =
      sterilizedFilter === "todos" ||
      (sterilizedFilter === "si" && cat.sterilized) ||
      (sterilizedFilter === "no" && !cat.sterilized);
    return matchStatus && matchGender && matchSterilized;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-orange-100 p-12 flex justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Cargando michis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Status */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                statusFilter === f.key
                  ? f.key === "disponible"
                    ? "bg-green-500 text-white border-green-500"
                    : f.key === "en_recuperacion"
                      ? "bg-yellow-400 text-yellow-900 border-yellow-400"
                      : f.key === "adoptado"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-px bg-gray-200 self-stretch hidden sm:block" />

        {/* Gender */}
        <div className="flex flex-wrap gap-1.5">
          {GENDER_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setGenderFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                genderFilter === f.key
                  ? f.key === "macho"
                    ? "bg-[#0bbaf7] text-gray-900 border-[#08a4dd]"
                    : f.key === "hembra"
                      ? "bg-[#ff3ca5] text-gray-900 border-[#d42281]"
                      : "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-px bg-gray-200 self-stretch hidden sm:block" />

        {/* Sterilized */}
        <div className="flex flex-wrap gap-1.5">
          {STERILIZED_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setSterilizedFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                sterilizedFilter === f.key
                  ? f.key === "si"
                    ? "bg-teal-500 text-white border-teal-500"
                    : f.key === "no"
                      ? "bg-gray-400 text-white border-gray-400"
                      : "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 self-center ml-auto">
          {filtered.length} {filtered.length === 1 ? "michi" : "michis"}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">😿</div>
            <p className="text-gray-500 font-medium">
              No hay michis con estos filtros
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-50 border-b border-orange-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Michi
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Edad
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Género
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Estado
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Esterilización
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {filtered.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-orange-50/50 transition"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-orange-100 flex-shrink-0">
                            {cat.image_url ? (
                              <img
                                src={cat.image_url}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                🐱
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {cat.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">
                              {cat.color}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{cat.age}</td>
                      <td className="px-5 py-4 text-gray-600 capitalize">
                        {cat.gender}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_LABELS[cat.status].class}`}
                        >
                          {STATUS_LABELS[cat.status].label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <SterilizedBadge cat={cat} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/michis/${cat.id}`)
                            }
                            className="text-blue-500 hover:text-blue-700 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => onEdit(cat)}
                            className="text-orange-600 hover:text-orange-800 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-orange-100 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => onDelete(cat.id)}
                            className="text-red-500 hover:text-red-700 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-orange-50">
              {filtered.map((cat) => (
                <div key={cat.id} className="p-4 flex gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-orange-100 flex-shrink-0">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🐱
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-gray-900">{cat.name}</p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium flex-shrink-0 ${STATUS_LABELS[cat.status].class}`}
                      >
                        {STATUS_LABELS[cat.status].label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {cat.age} · {cat.gender} · {cat.color}
                    </p>
                    <div className="mt-1">
                      <SterilizedBadge cat={cat} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
  onClick={() => router.push(`/admin/michis/${cat.id}`)}
  className="text-blue-500 font-medium text-xs"
>
  Ver
</button>
                      <button
                        onClick={() => onEdit(cat)}
                        className="text-orange-600 font-medium text-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(cat.id)}
                        className="text-red-500 font-medium text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
