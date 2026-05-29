"use client";
import React, { useState } from "react";
import { DONATION_TIERS } from "../lib/data";
import { useIntersection } from "../lib/utils";

export default function DonateSection() {
  const { ref, visible } = useIntersection();
  const [custom, setCustom] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section
      ref={ref}
      id="donar"
      className="py-20 bg-[#0bbaf7] relative overflow-hidden"
    >
      {/* decorative elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <img
          src="/cat-footprint-svgrepo-com.svg"
          className="absolute bottom-2 left-1/4 w-20 h-20 -rotate-20"
          style={{ filter: "brightness(0) invert(1)" }}
          alt=""
        />

        <img
          src="/cat-footprint-svgrepo-com.svg"
          className="absolute -top-3 left-16 w-28 h-28 rotate-6"
          style={{ filter: "brightness(0) invert(1)" }}
          alt=""
        />

        <img
          src="/cat-footprint-svgrepo-com.svg"
          className="absolute bottom-4 right-20 w-24 h-24 rotate-12"
          style={{ filter: "brightness(0) invert(1)" }}
          alt=""
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-8 items-center">
          {/* CTA text */}
          <div
            className={`lg:col-span-1 text-white space-y-4  lg:text-left transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-2xl lg:text-4xl font-black text-[#ffffff] font-logo">
              Salva una vida hoy{" "}
              <img
                src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947670/michipaceno-icono_7_lcgn5w.png"
                alt="gatito en adopción"
                className="inline-block w-9 h-9 ml-1 scale-x-[-1]"
              />
            </h2>
       <p className="text-gray-600 text-md font-semibold leading-relaxed ">
              Con tu ayuda será posible rescatar a más gatitos de la calle,
              enfermos y/o abandonados.
            </p>

            <div className="pt-2 space-y-3">
              <p className="text-white text-lg font-bold">
                💳 Datos para transferencia
              </p>

              {/* Cuenta */}
              <div className="bg-[#ffffff]/30 border border-white/80 rounded-xl px-4 py-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-gray-800 font-bold text-md">
                      Número de tarjeta
                    </p>
                    <p className="font-mono font-bold tracking-wider">
                      4555 1130 1509 6623
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard("4555113015096623", "tarjeta")
                    }
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition whitespace-nowrap"
                  >
                    {copied === "tarjeta" ? "✅ Copiado" : "Copiar"}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-white/80 pt-2">
                  <div>
                    <p className="text-gray-800 font-bold text-md">CLABE</p>
                    <p className="font-mono font-bold text-xs tracking-wider">
                      012040001248468859
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard("012040001248468859", "clabe")
                    }
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition whitespace-nowrap"
                  >
                    {copied === "clabe" ? "✅ Copiado" : "Copiar"}
                  </button>
                </div>
                <div className="border-t border-white/80 pt-2">
                  <p className="text-gray-800 font-bold text-md">A nombre de</p>
                  <p className="font-bold">Michipaceños</p>
                </div>
              </div>

              <p className="text-white-300 text-md text-center">
                {/* Donación mensual 🔄 —  */}
                Dona cada mes y cambia más vidas.{" "}
                <img
                  src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947669/michipaceno-icono_4_rvttrm.png"
                  alt="gatito donación mensual"
                  className="inline-block w-9 h-9 ml-2 scale-x-[-1]"
                />
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 lg:gap-4">
            {DONATION_TIERS.map((tier, i) => (
              <div
                key={tier.amount}
                className={`bg-white rounded-2xl p-4 lg:p-5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 group ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <div className="w-14 h-14 bg-[#0bbaf7]/20 group-hover:bg-[#0bbaf7]/60 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-colors">
                  {tier.icon}
                </div>
                <p className="text-2xl lg:text-3xl text-[#ff3ca5] font-black">
                  ${tier.amount}
                </p>
                <h3 className="font-black text-gray-800 text-lg mb-1">
                  {tier.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
