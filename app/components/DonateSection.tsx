"use client";
import React, { useState } from 'react';
import { DONATION_TIERS } from '../lib/data';
import { useIntersection } from '../lib/utils';

export default function DonateSection() {
  const { ref, visible } = useIntersection();
  const [custom, setCustom] = useState('');

  return (
    <section ref={ref} className="py-20 bg-green-700 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* CTA text */}
          <div
            className={`lg:col-span-1 text-white space-y-4 transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-black leading-tight">
              Tu ayuda puede salvar una vida hoy
            </h2>
            <p className="text-green-200 leading-relaxed">
              Con tu donación, podemos seguir rescatando y cuidando a más michis en La Paz, BCS.
            </p>
            <div className="pt-2 space-y-2">
              <p className="text-white font-bold">💳 Dona fácil y seguro</p>
              <button className="bg-pink-500 hover:bg-pink-400 text-white font-black px-8 py-3.5 rounded-full w-full text-lg transition-all hover:scale-105 shadow-lg">
                ❤️ Donar ahora
              </button>
              <p className="text-green-300 text-sm text-center">
                Donación mensual 🔄 — Dona cada mes y cambia más vidas.
              </p>
            </div>
          </div>

          {/* Donation tiers */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {DONATION_TIERS.map((tier, i) => (
              <div
                key={tier.amount}
                className={`bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl p-5 cursor-pointer transition-all hover:scale-105 text-white duration-500 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <span className="text-4xl">{tier.icon}</span>
                <p className="text-3xl font-black text-pink-300 mt-2">${tier.amount}</p>
                <p className="font-bold text-lg">{tier.title}</p>
                <p className="text-green-200 text-sm mt-1">{tier.description}</p>
              </div>
            ))}

            {/* Custom amount */}
            <div className="sm:col-span-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex gap-3 items-center">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}