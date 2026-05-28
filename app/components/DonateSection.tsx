"use client";
import React, { useState } from 'react';
import { DONATION_TIERS } from '../lib/data';
import { useIntersection } from '../lib/utils';

export default function DonateSection() {
  const { ref, visible } = useIntersection();
  const [custom, setCustom] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section ref={ref} id="donar" className="py-20 bg-green-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">

          {/* CTA text */}
          <div className={`lg:col-span-1 text-white space-y-4 text-center lg:text-left transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl lg:text-4xl font-black leading-tight">
              Tu ayuda puede salvar una vida hoy
            </h2>
            <p className="text-green-200 leading-relaxed">
              Con tu ayuda será posible rescatar a más gatitos de la calle, enfermos y/o abandonados.
            </p>

            <div className="pt-2 space-y-3">
              <p className="text-white font-bold">💳 Datos para transferencia</p>

              {/* Cuenta */}
              <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-green-300 text-xs">Número de tarjeta</p>
                    <p className="font-mono font-bold tracking-wider">4555 1130 1509 6623</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('4555113015096623', 'tarjeta')}
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition whitespace-nowrap"
                  >
                    {copied === 'tarjeta' ? '✅ Copiado' : 'Copiar'}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-2">
                  <div>
                    <p className="text-green-300 text-xs">CLABE</p>
                    <p className="font-mono font-bold text-xs tracking-wider">012040001248468859</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('012040001248468859', 'clabe')}
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition whitespace-nowrap"
                  >
                    {copied === 'clabe' ? '✅ Copiado' : 'Copiar'}
                  </button>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <p className="text-green-300 text-xs">A nombre de</p>
                  <p className="font-bold">Michipaceños</p>
                </div>
              </div>

              <p className="text-green-300 text-xs text-center">
                Donación mensual 🔄 — Dona cada mes y cambia más vidas.
              </p>
            </div>
          </div>

          {/* Donation tiers */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3 lg:gap-4">
            {DONATION_TIERS.map((tier, i) => (
              <div
                key={tier.amount}
                className={`bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl p-4 lg:p-5 cursor-pointer transition-all hover:scale-105 text-white duration-500 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <span className="text-3xl lg:text-4xl">{tier.icon}</span>
                <p className="text-2xl lg:text-3xl font-black text-pink-300 mt-2">${tier.amount}</p>
                <p className="font-bold text-base lg:text-lg">{tier.title}</p>
                <p className="text-green-200 text-xs lg:text-sm mt-1">{tier.description}</p>
              </div>
            ))}

            {/* Custom amount */}
            {/* <div className="col-span-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="number"
                placeholder="Otro monto ($MXN)"
                value={custom}
                onChange={e => setCustom(e.target.value)}
                className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button className="bg-pink-500 hover:bg-pink-400 text-white font-bold px-5 py-2.5 rounded-xl transition-all whitespace-nowrap">
                Donar {custom ? `$${custom}` : ''} ❤️
              </button>
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
}