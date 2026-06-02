"use client";

import { useState } from "react";
import type { Adoption } from "../../lib/types";
import { useRouter } from "next/navigation";
import { parseLocalDate } from "@/app/lib/utils";

interface AdoptionTableProps {
  adoptions: Adoption[];
  loading: boolean;
  onEdit: (adoption: Adoption) => void;
  onDelete: (id: string) => void;
}

const STERILIZED_FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'si', label: '✂️ Esterilizados' },
  { key: 'no', label: '✗ No esterilizados' },
  { key: 'sin_michi', label: 'Sin michi' },
] as const;

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function SterilizedBadge({ cat }: { cat?: Adoption['cat'] }) {
  if (!cat) return <span className="text-gray-300 text-xs">—</span>;
  if (!cat.sterilized) {
    const reservedLabel = cat.sterilization_reserved_date
      ? new Date(cat.sterilization_reserved_date + 'T12:00').toLocaleDateString('es-MX', {
          day: '2-digit', month: '2-digit', year: '2-digit',
        })
      : null;
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">
        ✗ No
        {reservedLabel && (
          <>
            <span className="w-px h-3 bg-gray-300" />
            <span className="text-orange-500 font-semibold">🗓️ {reservedLabel}</span>
          </>
        )}
      </span>
    );
  }
  const label = cat.sterilization_date
    ? `✂️ ${new Date(cat.sterilization_date + 'T12:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}`
    : '✂️ Sí · sin fecha';
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-teal-100 text-teal-800">
      {label}
    </span>
  );
}

// Genera lista de meses con adopciones (año + mes únicos)
function getAvailableMonths(adoptions: Adoption[]) {
  const seen = new Set<string>();
  const result: { key: string; label: string }[] = [];
  for (const a of adoptions) {
    const [year, month] = a.adoption_date.split('-').map(Number);
    const key = `${year}-${String(month).padStart(2, '0')}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ key, label: `${MONTHS[month - 1]} ${year}` });
    }
  }
  return result.sort((a, b) => b.key.localeCompare(a.key)); // más reciente primero
}

export default function AdoptionTable({ adoptions, loading, onEdit, onDelete }: AdoptionTableProps) {
  const [search, setSearch] = useState("");
  const [sterilizedFilter, setSterilizedFilter] = useState<string>("todos");
  const [monthFilter, setMonthFilter] = useState<string>("todos");
  const router = useRouter();

  const availableMonths = getAvailableMonths(adoptions);

  const filtered = adoptions.filter(a => {
    const matchSearch =
      a.adopter_name.toLowerCase().includes(search.toLowerCase()) ||
      a.adopter_email?.toLowerCase().includes(search.toLowerCase()) ||
      a.adopter_phone?.includes(search) ||
      a.cat?.name?.toLowerCase().includes(search.toLowerCase());

    const matchSterilized =
      sterilizedFilter === 'todos' ||
      (sterilizedFilter === 'sin_michi' && !a.cat_id) ||
      (sterilizedFilter === 'si' && a.cat?.sterilized === true) ||
      (sterilizedFilter === 'no' && a.cat_id && a.cat?.sterilized === false);

    const matchMonth = (() => {
      if (monthFilter === 'todos') return true;
      const [year, month] = a.adoption_date.split('-').map(Number);
      const key = `${year}-${String(month).padStart(2, '0')}`;
      return key === monthFilter;
    })();

    return matchSearch && matchSterilized && matchMonth;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-orange-100 p-12 flex justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Cargando adopciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, correo, teléfono o michi..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-400 whitespace-nowrap">
          {filtered.length} {filtered.length === 1 ? "adopción" : "adopciones"}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-2">

        {/* Filtro mes */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-gray-400 font-medium mr-1">Mes:</span>
          <button
            onClick={() => setMonthFilter('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              monthFilter === 'todos'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-500 border-gray-200 hover:border-orange-200'
            }`}
          >
            Todos
          </button>
          {availableMonths.map(m => (
            <button
              key={m.key}
              onClick={() => setMonthFilter(m.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                monthFilter === m.key
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-orange-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Filtro esterilización */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-gray-400 font-medium mr-1">Esterilización:</span>
          {STERILIZED_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setSterilizedFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                sterilizedFilter === f.key
                  ? f.key === 'si' ? 'bg-teal-500 text-white border-teal-500'
                  : f.key === 'no' ? 'bg-gray-400 text-white border-gray-400'
                  : f.key === 'sin_michi' ? 'bg-gray-200 text-gray-700 border-gray-300'
                  : 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-orange-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">😿</div>
            <p className="text-gray-500 font-medium">
              {search || sterilizedFilter !== 'todos' || monthFilter !== 'todos'
                ? "No hay resultados para estos filtros"
                : "No hay adopciones registradas aún"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-50 border-b border-orange-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">Adoptante</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">Contacto</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">Michi</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">Esterilización</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">Fecha</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">Lugar</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-orange-700 uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-orange-50/50 transition">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{a.adopter_name}</p>
                        {a.follow_ups && a.follow_ups.length > 0 && (
                          <span className="text-xs text-orange-500 font-medium">
                            {a.follow_ups.length} seguimiento{a.follow_ups.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {a.adopter_email && <p className="text-gray-600 text-xs">{a.adopter_email}</p>}
                        {a.adopter_phone && (
                          <a
                            href={`https://wa.me/52${a.adopter_phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-green-600 hover:underline font-medium"
                          >
                            📱 {a.adopter_phone}
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {a.cat ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-orange-100 flex-shrink-0">
                              {a.cat.image_url ? (
                                <img src={a.cat.image_url} alt={a.cat.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm">🐱</div>
                              )}
                            </div>
                            <span className="font-medium text-gray-800">{a.cat.name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <SterilizedBadge cat={a.cat} />
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-xs whitespace-nowrap">
                        {parseLocalDate(a.adoption_date).toLocaleDateString("es-MX", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-xs">
                        {a.adoption_place || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => router.push(`/admin/adopciones/${a.id}`)} className="text-blue-500 hover:text-blue-700 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">Ver</button>
                          <button onClick={() => onEdit(a)} className="text-orange-600 hover:text-orange-800 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-orange-100 transition">Editar</button>
                          <button onClick={() => onDelete(a.id)} className="text-red-500 hover:text-red-700 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-orange-50">
              {filtered.map((a) => (
                <div key={a.id} className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{a.adopter_name}</p>
                      <p className="text-xs text-gray-400">
                        {parseLocalDate(a.adoption_date).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                        {a.adoption_place ? ` · ${a.adoption_place}` : ""}
                      </p>
                    </div>
                    {a.cat && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-orange-100">
                          {a.cat.image_url ? (
                            <img src={a.cat.image_url} alt={a.cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">🐱</div>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{a.cat.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {a.adopter_email && <p className="text-xs text-gray-500">{a.adopter_email}</p>}
                    {a.adopter_phone && (
                      <a href={`https://wa.me/52${a.adopter_phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 font-medium">
                        📱 {a.adopter_phone}
                      </a>
                    )}
                  </div>
                  <SterilizedBadge cat={a.cat} />
                  <div className="flex gap-3 mt-1">
                    <button onClick={() => router.push(`/admin/adopciones/${a.id}`)} className="text-blue-500 font-medium text-xs">Ver</button>
                    <button onClick={() => onEdit(a)} className="text-orange-600 font-medium text-xs">Editar</button>
                    <button onClick={() => onDelete(a.id)} className="text-red-500 font-medium text-xs">Eliminar</button>
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