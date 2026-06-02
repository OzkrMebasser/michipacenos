"use client";

import type { Cat } from "../lib/types";
import { useIntersection } from "../lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface CatCardProps {
  cat: Cat;
  index: number;
}

const STATUS_CONFIG = {
  disponible: { label: "Disponible", color: "bg-green-500" },
  en_recuperacion: { label: "En Recuperación", color: "bg-yellow-400" },
  adoptado: { label: "Adoptado", color: "bg-blue-500" },
};

export default function CatCard({ cat, index }: CatCardProps) {
  const { ref, visible } = useIntersection();
  const router = useRouter();
  const genderIcon = cat.gender === "hembra" ? "♀️" : "♂️";
  const genderColor =
    cat.gender === "hembra" ? "text-pink-500" : "text-blue-500";
  const status = STATUS_CONFIG[cat.status];

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        {(cat.photos?.[0] ?? cat.image_url) ? (
          <img
            src={cat.photos?.[0] ?? cat.image_url!}
            alt={cat.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-orange-100 flex items-center justify-center text-5xl">
            🐱
          </div>
        )}
        <span
          className={`absolute top-2 right-2 ${status.color} text-white text-xs font-bold px-2 py-1 rounded-full`}
        >
          {status.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-gray-800 text-lg">
            {cat.name} <span className={genderColor}>{genderIcon}</span>
          </h3>
          <span className="text-xs text-gray-400 font-medium">{cat.age}</span>
        </div>

        <p className="text-xs text-gray-500">{cat.color}</p>

        {cat.description && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {cat.description}
          </p>
        )}

        {/* <button
          onClick={() => router.push(`/michi/${cat.id}`)}
          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-sm transition-all hover:scale-[1.02]"
        > */}
     <Link
  href={`/michi/${cat.id}`}
  className={`w-full justify-center font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg ${
    cat.gender === 'hembra'
      ? 'bg-[#ff3ca5] hover:bg-[#d42281] text-gray-900 shadow-pink-100'
      : 'bg-[#0bbaf7] hover:bg-[#08a4dd] text-gray-900 shadow-sky-100'
  }`}
>
  Ver detalles
</Link>
      </div>
    </div>
  );
}
