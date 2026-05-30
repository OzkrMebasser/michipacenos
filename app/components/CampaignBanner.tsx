"use client";

import { useEffect, useState } from "react";
import { supabase } from "../admin/lib/supabase"; // ajusta el path
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

  if (!campaign) return null; // si no hay campaña activa, no renderiza nada

  return (
    <section className="bg-[#f9a8c9] py-10 px-4">
      <div className="max-w-2xl mx-auto bg-[#fef6f0] rounded-2xl overflow-hidden shadow-md">
        {/* Header */}
        <div className="bg-white px-6 py-5 text-center border-b border-pink-100">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {campaign.title}
          </h2>
          {campaign.subtitle && (
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">
              {campaign.subtitle}
            </p>
          )}
          {campaign.month && (
            <>
              <hr className="my-3 border-gray-300 w-32 mx-auto" />
              <p className="font-bold text-gray-800 text-lg">
                {campaign.month}
              </p>
            </>
          )}
        </div>

        {/* Grid de datos */}
        <div className="grid grid-cols-2 gap-px bg-pink-200">
          {[
            {
              label: "Fecha",
              value: campaign.date_label,
              color: "bg-yellow-100",
            },
            { label: "Lugar", value: campaign.place, color: "bg-purple-100" },
            {
              label: "Cuota de recuperación",
              value: campaign.price,
              color: "bg-blue-100",
            },
            {
              label: "Citas e informes",
              value: campaign.contact,
              color: "bg-yellow-50",
            },
          ].map(({ label, value, color }) =>
            value ? (
              <div key={label} className={`${color} p-5 flex flex-col gap-2`}>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {label}
                </span>
                <span className="text-lg sm:text-xl font-black text-gray-900 leading-snug whitespace-pre-line">
                  {value}
                </span>
              </div>
            ) : null,
          )}
        </div>
        {/* Patrocinadores */}
        {campaign.sponsor_logos && campaign.sponsor_logos.length > 0 && (
          <div className="bg-white px-6 py-4 border-t border-pink-100">
            <p className="text-xs uppercase tracking-widest text-gray-400 text-center mb-3 font-semibold">
              Con el apoyo de
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {campaign.sponsor_logos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`patrocinador ${i + 1}`}
                  className="h-12 w-auto object-contain opacity-90"
                />
              ))}
            </div>
          </div>
        )}

        {/* Nota al pie */}
        {campaign.notes && (
          <div className="bg-pink-100 px-6 py-4 text-center">
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              {campaign.notes}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
