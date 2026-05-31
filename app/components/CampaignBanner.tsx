"use client";

import { useEffect, useState } from "react";
import { supabase } from "../admin/lib/supabase";
import { Campaign } from "../lib/types";

export default function CampaignBanner() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    supabase
      .from("campaigns")
      .select("*")
      .eq("is_active", true)
      .single()
      .then(({ data }) => setCampaign(data));
  }, []);

  if (!campaign) return null;

  return (
    <section className="bg-[#ff3ca5] py-10 px-4 relative">
      {/* decorative elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <img
          src="/cat-footprint-svgrepo-com.svg"
          className="absolute -bottom-6 right-0 lg:bottom-24 lg:right-16 w-36 h-36 -rotate-20"
          style={{ filter: "brightness(0) invert(1)" }}
          alt=""
        />
        <img
          src="/cat-footprint-svgrepo-com.svg"
          className="absolute -top-4 right-0 lg:top-3 lg:right-16 w-28 h-28 -rotate-12"
          style={{ filter: "brightness(0) invert(1)" }}
          alt=""
        />
        <img
          src="/cat-footprint-svgrepo-com.svg"
          className="absolute -bottom-3 left-0 lg:bottom-4 lg:left-20 w-24 h-24 rotate-12"
          style={{ filter: "brightness(0) invert(1)" }}
          alt=""
        />
      </div>

      {/* Header */}
      <div className="text-left mb-12">
        <h2 className="text-2xl lg:text-4xl font-black text-[#ffffff] font-logo">
          Proxima campaña
          <img
            src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779937846/domestic-cat-shape-svgrepo-com_fsl7kr.svg"
            alt="gatito campañas"
            className="inline-block w-8 h-8 ml-2 "
          />
        </h2>
        <p className="text-gray-100 text-md font-semibold leading-relaxed">
          ¡Únete y comparte nuestra próxima campaña!
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-[#ffffff] rounded-xl px-6 shadow-md hover:shadow-2xl transition-shadow scale-100 hover:scale-[1.02]">
        {/* ── Header blanco ─────────────────────────────────────── */}
        <div className="bg-[#ffffff] rounded-xl px-6 py-5 flex items-start gap-8">
          <div className="flex-1 text-center">
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 leading-tight">
              {campaign.title}
            </h2>
            {campaign.subtitle && (
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1 font-semibold">
                {campaign.subtitle}
              </p>
            )}
            {campaign.month && (
              <>
                <div className="border-t-2 border-gray-400 w-40 mx-auto my-3" />
                <p className="text-xl font-bold text-gray-800">
                  {campaign.month}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Grid / Celdas apiladas ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch ">
          {/* Fecha */}
          <div className="border-2  border-gray-900 bg-[#ffffff] min-h-32 lg:min-h-40 flex flex-col shadow-md hover:shadow-2xl transition-shadow scale-100 hover:scale-[1.02]">
            <div className="bg-[#f6e27a] border-b-2 border-gray-900 px-4 py-1.5 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Fecha</span>
              <span className="flex gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-80  inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80   inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-80   inline-block" />
              </span>
            </div>
            <div className="px-4 py-4 flex flex-col justify-center items-center text-center flex-1">
              <p className="text-xl sm:text-2xl font-black text-gray-900 whitespace-pre-line leading-snug">
                {campaign.date_label}
              </p>
            </div>
          </div>

          {/* Lugar */}
          <div className="border-2  border-gray-900 bg-[#ffffff]] min-h-32 lg:min-h-40 flex flex-col shadow-md hover:shadow-2xl transition-shadow scale-100 hover:scale-[1.02]">
            {" "}
            <div className="bg-[#ffb3ee] border-b-2 border-gray-900 px-4 py-1.5 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Lugar</span>
              <span className="flex gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-80  inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80   inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-80   inline-block" />
              </span>
            </div>
            <div className="px-4 py-4 flex flex-col justify-center items-center text-center flex-1">
              <p className="text-xl sm:text-2xl font-black text-gray-900 whitespace-pre-line leading-snug">
                {campaign.place}
              </p>
            </div>
          </div>

          {/* Cuota */}
          <div className="border-2  border-gray-900 bg-[#ffffff] min-h-32 lg:min-h-40 flex flex-col shadow-md hover:shadow-2xl transition-shadow scale-100 hover:scale-[1.02]">
            {" "}
            <div className="bg-[#add8f0] border-b-2 border-gray-900 px-4 py-1.5 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">
                Cuota de recuperación
              </span>
              <span className="flex gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-80  inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80   inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-80   inline-block" />
              </span>
            </div>
            <div className="px-4 py-4 flex flex-col justify-center items-center text-center flex-1">
              <p className="text-xl sm:text-2xl font-black text-gray-900 whitespace-pre-line leading-snug">
                {campaign.price}
              </p>
            </div>
          </div>

          {/* Contacto */}
          <div className="border-2  border-gray-900 bg-[#ffffff] min-h-32 lg:min-h-40 flex flex-col shadow-md hover:shadow-2xl transition-shadow scale-100 hover:scale-[1.02]">
            {" "}
            <div className="bg-[#d5ffc4] border-b-2 border-gray-900 px-4 py-1.5 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">
                Citas e informes
              </span>
              <span className="flex gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-80  inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80   inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-80   inline-block" />
              </span>
            </div>
            <div className="px-4 py-4 flex flex-col justify-center items-center text-center flex-1">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${campaign.contact}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Contactar por WhatsApp"
                  className="w-8 h-8 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 flex-shrink-0"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <p className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                  {campaign.contact}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Nota al pie ───────────────────────────────────────── */}
        {campaign.notes && (
          <div className="bg-[#ffffff] border-x-4 border-b-4 border-[#ffffff] rounded-b-xl px-5  text-center py-8">
            <p className="text-sm font-black text-yellow-400">
              Notas importantes
            </p>
            <p className="text-sm font-black text-gray-900">{campaign.notes}</p>
          </div>
        )}

        {/* Patrocinadores */}
        {campaign.sponsor_logos && campaign.sponsor_logos.length > 0 && (
          <div className="bg-white px-6 py-4 border-t border-pink-100 mb-2">
            <p className="text-xs uppercase tracking-widest text-gray-400 text-center mb-3 font-semibold">
              Con el apoyo de
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {campaign.sponsor_logos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`patrocinador ${i + 1}`}
                  className="h-18 lg:h-24  w-auto object-contain opacity-90"
                />
              ))}
            </div>
          </div>
        )}

        {/* Botón Facebook */}
        {campaign.facebook_url && (
          <div className="flex justify-center py-8">
            <a
              href={campaign.facebook_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition hover:scale-105 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Compartir en Facebook
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
