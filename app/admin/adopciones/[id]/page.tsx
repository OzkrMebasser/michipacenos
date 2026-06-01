'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import type { Adoption } from '../../../lib/types';
import { parseLocalDate } from '@/app/lib/utils';

export default function AdoptionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [adoption, setAdoption] = useState<Adoption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('adoptions')
      .select('*, cat:cats(name, image_url, age, gender, color)')
      .eq('id', id)
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

  return (
    <div className="min-h-screen bg-gray-50 pt-[6.5rem]">
      {/* Header */}
      <nav className="bg-white border-b border-t border-gray-300 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1 className="font-black text-gray-800 leading-tight">{adoption.adopter_name}</h1>
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
        {adoption.cat && (
          <div className="bg-white rounded-2xl border border-orange-100 p-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-orange-100 flex-shrink-0">
              {adoption.cat.image_url ? (
                <img src={adoption.cat.image_url} alt={adoption.cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🐱</div>
              )}
            </div>
            <div>
              <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-1">Michi adoptado</p>
              <p className="text-xl font-black text-gray-900">{adoption.cat.name}</p>
              <p className="text-sm text-gray-500">
                {(adoption.cat as any).age} · {(adoption.cat as any).gender} · {(adoption.cat as any).color}
              </p>
            </div>
          </div>
        )}

        {/* Info del adoptante */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6">
          <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-4">Datos del adoptante</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre" value={adoption.adopter_name} />
            <Field label="Correo" value={adoption.adopter_email} />
            <Field
              label="Teléfono / WhatsApp"
              value={adoption.adopter_phone}
              href={adoption.adopter_phone ? `https://wa.me/52${adoption.adopter_phone.replace(/\D/g, '')}` : undefined}
            />
            <Field label="Domicilio" value={adoption.adopter_address} />
            <Field
              label="Fecha de adopción"
              value={adoption.adoption_date
                ? parseLocalDate(adoption.adoption_date).toLocaleDateString('es-MX', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })
                : undefined}
            />
            <Field label="Lugar" value={adoption.adoption_place} />
          </div>
          {adoption.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Notas</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{adoption.notes}</p>
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
            <p className="text-sm text-gray-400 italic">Sin seguimientos registrados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {[...adoption.follow_ups].reverse().map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  {/* línea de tiempo */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-orange-400 mt-1" />
                    {i < adoption.follow_ups!.length - 1 && (
                      <div className="w-0.5 bg-orange-100 flex-1 mt-1" style={{ minHeight: 24 }} />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 pb-4">
                    <span className="text-xs text-orange-500 font-semibold">
                      {parseLocalDate(f.date).toLocaleDateString('es-MX', {
                        day: '2-digit', month: 'short', year: 'numeric'
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

function Field({ label, value, href }: { label: string; value?: string | null; href?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="text-sm text-green-600 hover:underline font-medium">
          {value}
        </a>
      ) : (
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      )}
    </div>
  );
}