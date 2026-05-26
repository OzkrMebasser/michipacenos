"use client";
import React, { useState } from 'react';
import { CATS } from '../lib/data';
import type { FilterKey } from '../lib/types';
import CatCard from './CatCard';

const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'todos',     label: 'Todos',       icon: '🐾' },
  { key: 'hembra',   label: 'Hembras',     icon: '♀️' },
  { key: 'macho',    label: 'Machos',      icon: '♂️' },
  { key: 'cachorro', label: 'Cachorros',   icon: '🐱' },
  { key: 'adulto',   label: 'Adultos',     icon: '🐈' },
  { key: 'tranquila',label: 'Tranquilos',  icon: '😌' },
  { key: 'juguetona',label: 'Juguetones',  icon: '🎾' },
  { key: 'especial', label: 'Especiales',  icon: '✨' },
];

export default function AdoptionSection() {
  const [filter, setFilter] = useState<FilterKey>('todos');

  const filtered = CATS.filter(cat => {
    if (filter === 'todos') return true;
    if (filter === 'hembra' || filter === 'macho') return cat.gender === filter;
    if (filter === 'cachorro') return cat.age_months < 12;
    if (filter === 'adulto') return cat.age_months >= 12;
    if (filter === 'especial') return cat.special_needs;
    return cat.personalities.includes(filter as any);
  });

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black text-gray-900">🐾 Michis en adopción</h2>
          <a href="#" className="text-green-600 font-semibold hover:underline text-sm">
            Ver todos los michis →
          </a>
        </div>

        {/* Filter pills */}
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

        {/* Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((cat, i) => (
            <CatCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">😿</p>
            <p className="font-semibold">No hay michis con este filtro por ahora</p>
          </div>
        )}
      </div>
    </section>
  );
}