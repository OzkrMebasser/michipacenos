"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../admin/lib/supabase";
import type { Cat } from "../../lib/types";

const WHATSAPP_NUMBER = "5219841681509";

const STATUS_CONFIG = {
  disponible: { label: "Disponible", color: "bg-green-500" },
  en_proceso: { label: "En proceso", color: "bg-yellow-400" },
  adoptado: { label: "Adoptado", color: "bg-blue-500" },
};

export default function CatDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("cats")
      .select("*")
      .eq("id", id as string)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setCat(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <p className="text-5xl mb-4">😿</p>
          <p className="text-gray-600 font-semibold">No encontramos este michi</p>
          {/* <button onClick={() => router.push("/")} className="mt-4 text-green-600 font-bold hover:underline">
            ← Volver al inicio
          </button> */}
        </div>
      </div>
    );
  }

  const allPhotos = [
    ...(cat.image_url ? [cat.image_url] : []),
    ...(cat.photos ?? []),
  ];
  const hasMultiple = allPhotos.length > 1;
  const status = STATUS_CONFIG[cat.status];
  const genderIcon = cat.gender === "hembra" ? "♀️" : "♂️";
  const genderColor = cat.gender === "hembra" ? "text-pink-500" : "text-blue-500";

  const handleWhatsApp = () => {
    const genderText = cat.gender === "hembra" ? "hembra" : "macho";
    const message =
      `¡Hola! Me interesa adoptar a *${cat.name}* 🐱\n\n` +
      `• Edad: ${cat.age}\n` +
      `• Género: ${genderText}\n` +
      `• Color: ${cat.color}\n` +
      `• Estado: ${status.label}\n\n` +
      `¿Me pueden dar más información sobre el proceso de adopción?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">

  
      <div className="max-w-4xl mx-auto px-8 py-8 mt-[8rem]">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200 lg:flex lg:items-stretch hover:shadow-2xl transition scale-110">

          {/* Photo slider — mitad izquierda en lg */}
          <div className="relative aspect-square lg:aspect-auto lg:w-1/2 lg:flex-shrink-0 bg-orange-100">
            {allPhotos.length > 0 ? (
              <img
                src={allPhotos[currentPhoto]}
                alt={`${cat.name} foto ${currentPhoto + 1}`}
                className="w-full h-full object-cover object-center transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🐱</div>
            )}

            {/* Status badge */}
            <span className={`absolute top-4 right-4 ${status.color} text-white text-sm font-bold px-3 py-1.5 rounded-full`}>
              {status.label}
            </span>

            {/* Arrows */}
            {hasMultiple && (
              <>
                <button
                  onClick={() => setCurrentPhoto(p => (p - 1 + allPhotos.length) % allPhotos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition text-xl"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentPhoto(p => (p + 1) % allPhotos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition text-xl"
                >
                  ›
                </button>
              </>
            )}

            {/* Dots */}
            {hasMultiple && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allPhotos.map((_, i) => (
                  <button
                    title={`Foto ${i + 1}`}
                    key={i}
                    onClick={() => setCurrentPhoto(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentPhoto ? "bg-white w-4" : "bg-white/50 w-2"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnails */}
            {hasMultiple && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 px-3">
                {allPhotos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPhoto(i)}
                    title={`Foto ${i + 1}`}
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                      i === currentPhoto ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover object-center" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info — mitad derecha en lg */}
          <div className="p-6 sm:p-8 space-y-6 lg:w-1/2 lg:overflow-y-auto">

            <div>
              <h1 className="text-3xl font-black text-gray-900">
                {cat.name} <span className={genderColor}>{genderIcon}</span>
              </h1>
              <p className="text-gray-500 mt-1">{cat.age} · {cat.color}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 font-medium mb-1">Edad</p>
                <p className="font-bold text-gray-800">{cat.age}</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 font-medium mb-1">Género</p>
                <p className="font-bold text-gray-800 capitalize">{cat.gender}</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 font-medium mb-1">Color</p>
                <p className="font-bold text-gray-800">{cat.color}</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 font-medium mb-1">Estado</p>
                <p className="font-bold text-gray-800">{status.label}</p>
              </div>
            </div>

            {cat.description && (
              <div>
                <h2 className="font-bold text-gray-800 mb-2">Sobre {cat.name}</h2>
                <p className="text-gray-600 leading-relaxed">{cat.description}</p>
              </div>
            )}

            {cat.status !== "adoptado" ? (
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Quiero adoptar a {cat.name}
              </button>
            ) : (
              <div className="w-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold py-4 rounded-2xl text-center">
                🏠 {cat.name} ya encontró hogar
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}