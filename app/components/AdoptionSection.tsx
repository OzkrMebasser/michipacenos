"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../admin/lib/supabase';
import type { Cat, FilterKey } from '../lib/types';
import CatCard from './CatCard';
import { useRouter } from 'next/navigation';

const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'todos',      label: 'Todos',       icon: '🐾' },
  { key: 'hembra',     label: 'Hembras',     icon: '♀️' },
  { key: 'macho',      label: 'Machos',      icon: '♂️' },
  { key: 'disponible', label: 'Disponibles', icon: '💚' },
  { key: 'en_proceso', label: 'En proceso',  icon: '🔄' },
];

export default function AdoptionSection() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('todos');
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.offsetWidth / 4;
    scrollRef.current.scrollBy({ left: dir === 'right' ? cardWidth : -cardWidth, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black text-gray-900">🐾 Michis en adopción</h2>
          <button
            onClick={() => router.push('/michis-en-adopcion')}
            className="text-green-600 font-semibold hover:underline text-sm"
          >
            Ver todos los michis →
          </button>
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

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Carousel */}
        {!loading && filtered.length > 0 && (
          <div className="relative">

            {/* Arrow left */}
            <button
              onClick={() => scroll('left')}
              className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center text-gray-600 hover:bg-green-50 transition"
            >
              ‹
            </button>

            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {filtered.map((cat, i) => (
                <div
                  key={cat.id}
                  className="flex-shrink-0 snap-start w-[85vw] sm:w-[45vw] lg:w-[calc(25%-15px)]"
                >
                  <CatCard cat={cat} index={i} />
                </div>
              ))}
            </div>

            {/* Arrow right */}
            <button
              onClick={() => scroll('right')}
              className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center text-gray-600 hover:bg-green-50 transition"
            >
              ›
            </button>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">😿</p>
            <p className="font-semibold">No hay michis con este filtro por ahora</p>
          </div>
        )}

        {/* Ver todos button — mobile */}
        {!loading && filtered.length > 0 && (
          <div className="mt-8 text-center lg:hidden">
            <button
              onClick={() => router.push('/michis-en-adopcion')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-full transition"
            >
              Ver todos los michis 🐾
            </button>
          </div>
        )}
      </div>
    </section>
  );
}