"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../admin/lib/supabase';
import type { Cat, FilterKey } from '../lib/types';
import CatCard from '../components/CatCard';
import { useRouter } from 'next/navigation';

const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'todos',      label: 'Todos',       icon: '🐾' },
  { key: 'hembra',     label: 'Hembras',     icon: '♀️' },
  { key: 'macho',      label: 'Machos',      icon: '♂️' },
  { key: 'disponible', label: 'Disponibles', icon: '💚' },
  { key: 'en_proceso', label: 'En proceso',  icon: '🔄' },
];

export default function AllCatsPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('todos');
  const router = useRouter();

  useEffect(() => {
    supabase
      .from('cats')
      .select('*')
      .neq('status', 'adoptado')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setCats(data);
        setLoading(false);
      });
  }, []);

  const filtered = cats.filter(cat => {
    if (filter === 'todos') return true;
    if (filter === 'hembra' || filter === 'macho') return cat.gender === filter;
    if (filter === 'disponible' || filter === 'en_proceso') return cat.status === filter;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-36 pb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-800 font-medium text-sm mb-6 flex items-center gap-2 transition"
        >
          ← Volver
        </button>
        <h1 className="text-4xl font-black text-gray-900 mb-2">🐾 Todos los michis</h1>
        <p className="text-gray-500">Encuentra a tu compañero ideal</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                filter === f.key
                  ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
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
            <p className="font-semibold">No hay michis con este filtro por ahora</p>
          </div>
        )}
      </div>
    </div>
  );
}