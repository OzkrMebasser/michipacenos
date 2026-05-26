"use client";

import type { Cat } from '../lib/types';
import { formatAge, useIntersection } from '../lib/utils';

interface CatCardProps {
  cat: Cat;
  index: number;
}

export default function CatCard({ cat, index }: CatCardProps) {
  const { ref, visible } = useIntersection();
  const genderIcon = cat.gender === 'hembra' ? '♀️' : '♂️';
  const genderColor = cat.gender === 'hembra' ? 'text-pink-500' : 'text-blue-500';

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={cat.image_url}
          alt={cat.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {cat.special_needs && (
          <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Especial ✨
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-gray-800 text-lg">
            {cat.name} <span className={genderColor}>{genderIcon}</span>
          </h3>
          <span className="text-xs text-gray-400 font-medium">{formatAge(cat.age_months)}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {cat.personalities.map(p => (
            <span
              key={p}
              className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full capitalize"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="flex gap-2 text-xs text-gray-500 pt-1">
          {cat.sterilized && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Esterilizado/a
            </span>
          )}
          {cat.vaccinated && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-teal-500 rounded-full" />
              Vacunado/a
            </span>
          )}
        </div>

        <button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-sm transition-all hover:scale-[1.02]">
          Quiero adoptarle 🏠
        </button>
      </div>
    </div>
  );
}