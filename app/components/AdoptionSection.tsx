"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../admin/lib/supabase';
import type { Cat } from '../lib/types';
import CatCard from './CatCard';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function AdoptionSection() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
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

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Carousel */}
        {!loading && cats.length > 0 && (
          <div className="relative">

            {/* Arrow left */}
            <button
              onClick={() => scroll('left')}
              className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all border border-gray-100"
            >
              <FiChevronLeft size={24} strokeWidth={2.5} />
            </button>

            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {cats.map((cat, i) => (
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
              className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all border border-gray-100"
            >
              <FiChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {!loading && cats.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">😿</p>
            <p className="font-semibold">No hay michis disponibles por ahora</p>
          </div>
        )}

        {/* Ver todos button — mobile */}
        {!loading && cats.length > 0 && (
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