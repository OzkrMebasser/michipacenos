"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../admin/lib/supabase";
import type { Cat, FilterKey } from "../lib/types";
import CatCard from "../components/CatCard";
import { useRouter } from "next/navigation";

const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: "todos", label: "Todos", icon: "🐾" },
  { key: "hembra", label: "Hembras", icon: "♀️" },
  { key: "macho", label: "Machos", icon: "♂️" },
  { key: "disponible", label: "Disponibles", icon: "💚" },
  { key: "en_recuperacion", label: "En Recuperación", icon: "🔄" },
];

export default function AllCatsPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("todos");
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("cats")
      .select("*")
      .neq("status", "adoptado")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setCats(data);
        setLoading(false);
      });
  }, []);

  const filtered = cats.filter((cat) => {
    if (filter === "todos") return true;
    if (filter === "hembra" || filter === "macho") return cat.gender === filter;
    if (filter === "disponible" || filter === "en_recuperacion")
      return cat.status === filter;
    return true;
  });

  const MICHIS_ICONS = [
    "https://res.cloudinary.com/dmtehcd5t/image/upload/v1780017073/michipaceno-icono-logo_gy5zl4.png",
    "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947672/michipaceno-icono_2_gyo21j.png",
    "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947671/michipaceno-icono_1_ptlksg.png",
    "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947670/michipaceno-icono_7_lcgn5w.png",
    "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947670/michipaceno-icono_6_hgnn37.png",
    "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947669/michipaceno-icono_5_yluzqc.png",
    "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779938405/witch-cat-svgrepo-com_jlxohg.svg",

    "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779937846/domestic-cat-shape-svgrepo-com_fsl7kr.svg",

    "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779937857/cat-kitty-kitten-feline-svgrepo-com_zzecgd.svg",
  ];


  const filterBg: Record<FilterKey, string> = {
  todos:       "bg-[#57971e] hover:bg-[#4a8a1a]",
  disponible:  "bg-[#57971e] hover:bg-[#4a8a1a]",
  hembra:      "bg-[#ff3ca5] hover:bg-[#d42281]",
  macho:       "bg-[#0bbaf7] hover:bg-[#08a4dd]",
  en_recuperacion:  "bg-yellow-400 hover:bg-yellow-500",
  adoptado:    "bg-blue-500 hover:bg-blue-600",
};
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-24 lg:pt-[8rem] pb-8">
        <h1 className="text-3xl font-black text-[#ff3ca5] font-logo">
          Todos los michis
        </h1>
        <p className="text-gray-500">Encuentra a tu compañero ideal</p>
        {MICHIS_ICONS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Michi ${i + 1}`}
            className={`w-6 h-6 lg:w-10 lg:h-10 flex-shrink-0 inline-block ml-2 hover:scale-125 transition-transform ${
      i === MICHIS_ICONS.length - 1 ? "-scale-x-100" : ""
    }`}
            style={{
              animation: `michiPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
  key={f.key}
  onClick={() => setFilter(f.key)}
  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
    filter === f.key
      ? `${filterBg[f.key]} text-white shadow-md`
      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
  }`}
>
  {f.icon} {f.label}
</button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((cat, i) => (
              <CatCard key={cat.id} cat={cat} index={i} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">😿</p>
            <p className="font-semibold">
              No hay michis con este filtro por ahora
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
