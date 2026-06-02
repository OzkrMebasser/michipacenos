"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import type { Cat } from "../../../lib/types";
import { parseLocalDate } from "@/app/lib/utils";

const STATUS_CONFIG = {
  disponible: { label: "Disponible", class: "bg-green-100 text-green-800" },
  en_recuperacion: {
    label: "En Recuperación",
    class: "bg-yellow-100 text-yellow-800",
  },
  adoptado: { label: "Adoptado", class: "bg-blue-100 text-blue-800" },
};

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
}

export default function CatDetailAdminPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [adoption, setAdoption] = useState<{
    adopter_name: string;
    adopter_phone?: string;
    adopter_email?: string;
    adoption_date: string;
    adoption_place?: string;
    notes?: string;
  } | null>(null);

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

    // Buscar adopción vinculada
    supabase
      .from("adoptions")
      .select(
        "adopter_name, adopter_phone, adopter_email, adoption_date, adoption_place, notes",
      )
      .eq("cat_id", id as string)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setAdoption(data);
      });
  }, [id]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Michi no encontrado.</p>
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
  const genderColor =
    cat.gender === "hembra" ? "text-pink-500" : "text-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pt-[6.5rem]">
      {/* Navbar */}
      <nav className="bg-white border-b border-t border-gray-300 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐱</span>
          <div>
            <h1 className="font-black text-gray-800 leading-tight">
              {cat.name}
            </h1>
            <p className="text-xs text-gray-400">Detalle del michi</p>
          </div>
        </div>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition"
        >
          ← Volver
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Foto + info básica */}
        <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Foto */}
            <div className="relative sm:w-64 aspect-square bg-orange-50 flex-shrink-0">
              {allPhotos.length > 0 ? (
                <img
                  src={allPhotos[currentPhoto]}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🐱
                </div>
              )}

              {/* Badge status */}
              <span
                className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full text-white ${
                  cat.status === "disponible"
                    ? "bg-green-500"
                    : cat.status === "en_recuperacion"
                      ? "bg-yellow-400 text-yellow-900"
                      : "bg-blue-500"
                }`}
              >
                {status.label}
              </span>

              {/* Arrows */}
              {hasMultiple && (
                <>
                  <button
                    onClick={() =>
                      setCurrentPhoto(
                        (p) => (p - 1 + allPhotos.length) % allPhotos.length,
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-lg"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPhoto((p) => (p + 1) % allPhotos.length)
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-lg"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Dots */}
              {hasMultiple && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {allPhotos.map((_, i) => (
                    <button
                      key={i}
                      title={`Foto ${i + 1}`}
                      onClick={() => setCurrentPhoto(i)}
                      className={`h-1.5 rounded-full transition-all ${i === currentPhoto ? "bg-white w-3" : "bg-white/50 w-1.5"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info básica */}
            <div className="p-6 flex flex-col gap-4 flex-1">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  {cat.name} <span className={genderColor}>{genderIcon}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {cat.age} · {cat.color}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Edad" value={cat.age} />
                <Field label="Género" value={cat.gender} />
                <Field label="Color" value={cat.color} />
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    Estado
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium w-fit ${status.class}`}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 col-span-2 sm:col-span-1">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    Esterilización
                  </p>
                  {cat.sterilized ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-100 text-teal-800 w-fit">
                      {cat.sterilization_date
                        ? `✂️ ${new Date(cat.sterilization_date + "T12:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}`
                        : "✂️ Sí · sin fecha"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 w-fit">
                      ✗ No
                      {cat.sterilization_reserved_date && (
                        <>
                          <span className="w-px h-3 bg-gray-300" />
                          <span className="text-orange-500 font-semibold">
                            🗓️{" "}
                            {new Date(
                              cat.sterilization_reserved_date + "T12:00",
                            ).toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}
                          </span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        {cat.description && (
          <div className="bg-white rounded-2xl border border-orange-100 p-6">
            <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-3">
              Descripción
            </p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {cat.description}
            </p>
          </div>
        )}

        {/* Galería */}
        {allPhotos.length > 1 && (
          <div className="bg-white rounded-2xl border border-orange-100 p-6">
            <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-3">
              Fotos ({allPhotos.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {allPhotos.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPhoto(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    i === currentPhoto
                      ? "border-orange-400"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={url}
                    alt={`foto ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Adoptante — solo si está adoptado y hay registro */}
        {cat.status === "adoptado" && adoption && (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-4">
              🏠 Adoptado por
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nombre" value={adoption.adopter_name} />
              <Field
                label="Fecha de adopción"
                value={new Date(
                  adoption.adoption_date + "T12:00",
                ).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              />
              <Field label="Lugar" value={adoption.adoption_place} />
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                  Teléfono / WhatsApp
                </p>
                {adoption.adopter_phone ? (
                  <a
                    href={`https://wa.me/52${adoption.adopter_phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-green-600 hover:underline font-medium"
                  >
                    📱 {adoption.adopter_phone}
                  </a>
                ) : (
                  <p className="text-sm text-gray-400 italic">—</p>
                )}
              </div>
              <Field label="Correo" value={adoption.adopter_email} />
              {adoption.notes && (
                <div className="flex flex-col gap-0.5 sm:col-span-2">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    Notas
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {adoption.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Metadata */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6">
          <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-3">
            Info del registro
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="ID" value={cat.id} />
            <Field
              label="Registrado el"
              value={
                cat.created_at
                  ? new Date(cat.created_at).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
