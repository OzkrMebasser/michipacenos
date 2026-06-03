"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import type { Adoption } from "../../../lib/types";
import { parseLocalDate } from "@/app/lib/utils";

export default function AdoptionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [adoption, setAdoption] = useState<Adoption | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    supabase
      .from("adoptions")
      .select(
        "*, cat:cats(name, image_url, photos, age, gender, color, sterilized, sterilization_date, sterilization_reserved_date, ficha)",
      )
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setAdoption(data as Adoption);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!adoption) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Adopción no encontrada.</p>
      </div>
    );
  }

  const cat = adoption.cat as any;
  const catImageUrl = cat?.image_url ?? null;
  const catPhotos = cat?.photos ?? [];
  const allPhotos = [...(catImageUrl ? [catImageUrl] : []), ...catPhotos];
  const hasMultiple = allPhotos.length > 1;

  return (
    <div className="min-h-screen bg-gray-50 pt-[6.5rem]">
      {/* Header */}
      <nav className="bg-white border-b border-t border-gray-300 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1 className="font-black text-gray-800 leading-tight">
              {adoption.adopter_name}
            </h1>
            <p className="text-xs text-gray-400">Detalle de adopción</p>
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

        {/* Michi vinculado */}
        {cat && (
          <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Foto con galería */}
              <div className="relative sm:w-48 aspect-square bg-orange-50 flex-shrink-0">
                {allPhotos.length > 0 ? (
                  <img
                    src={allPhotos[currentPhoto]}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🐱
                  </div>
                )}

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

                {hasMultiple && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {allPhotos.map((_, i) => (
                      <button
                        key={i}
                        title={`Foto ${i + 1}`}
                        onClick={() => setCurrentPhoto(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentPhoto
                            ? "bg-white w-3"
                            : "bg-white/50 w-1.5"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info del michi */}
              <div className="p-6 flex flex-col gap-2">
                <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide">
                  Michi adoptado
                </p>

                {/* Nombre + ficha */}
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xl font-black text-gray-900">{cat.name}</p>
                  {cat.ficha && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-mono font-medium bg-orange-50 text-orange-600 border border-orange-200">
                      #{cat.ficha}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  {cat.age} · {cat.gender} · {cat.color}
                </p>

                {/* Esterilización */}
                {cat.sterilized ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-100 text-teal-800 w-fit mt-1">
                    {cat.sterilization_date
                      ? `✂️ Esterilizado/a · ${new Date(
                          cat.sterilization_date + "T12:00",
                        ).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}`
                      : "✂️ Esterilizado/a · sin fecha"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 w-fit mt-1 flex-wrap">
                    ✗ No esterilizado/a
                    {cat.sterilization_reserved_date && (
                      <>
                        <span className="w-px h-3 bg-gray-300" />
                        Reserva para esterilizar:
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

                {/* Miniaturas */}
                {hasMultiple && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {allPhotos.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPhoto(i)}
                        className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition ${
                          i === currentPhoto
                            ? "border-orange-400"
                            : "border-transparent opacity-60 hover:opacity-100"
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
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info del adoptante */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6">
          <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-4">
            Datos del adoptante
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre" value={adoption.adopter_name} />
            <Field label="Correo" value={adoption.adopter_email} />
            <Field
              label="Teléfono / WhatsApp"
              value={adoption.adopter_phone}
              href={
                adoption.adopter_phone
                  ? `https://wa.me/52${adoption.adopter_phone.replace(/\D/g, "")}`
                  : undefined
              }
            />
            <Field label="Domicilio" value={adoption.adopter_address} />
            <Field
              label="Fecha de adopción"
              value={
                adoption.adoption_date
                  ? parseLocalDate(adoption.adoption_date).toLocaleDateString(
                      "es-MX",
                      { day: "2-digit", month: "long", year: "numeric" },
                    )
                  : undefined
              }
            />
            <Field label="Lugar" value={adoption.adoption_place} />
          </div>
          {adoption.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Notas
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {adoption.notes}
              </p>
            </div>
          )}
        </div>

        {/* Seguimientos */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide">
              Seguimientos ({adoption.follow_ups?.length ?? 0})
            </p>
            <button
              onClick={() => router.push(`/admin/adopciones?edit=${id}`)}
              className="text-xs text-orange-500 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:bg-orange-50 transition"
            >
              + Agregar
            </button>
          </div>

          {!adoption.follow_ups || adoption.follow_ups.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              Sin seguimientos registrados.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {[...adoption.follow_ups].reverse().map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-orange-400 mt-1" />
                    {i < adoption.follow_ups!.length - 1 && (
                      <div
                        className="w-0.5 bg-orange-100 flex-1 mt-1"
                        style={{ minHeight: 24 }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 pb-4">
                    <span className="text-xs text-orange-500 font-semibold">
                      {parseLocalDate(f.date).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <p className="text-sm text-gray-700">{f.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value?: string | null;
  href?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-green-600 hover:underline font-medium"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      )}
    </div>
  );
}