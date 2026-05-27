"use client";
import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full flex items-center overflow-x-hidden pt-16 lg:pt-24 bg-gradient-to-br from-white via-white to-pink-50">
    <div className="hidden lg:block absolute top-20 right-0 w-96 h-96 bg-green-200/40 rounded-full blur-3xl pointer-events-none" />
<div className="hidden lg:block absolute bottom-10 left-0 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full mx-auto lg:pl-16 grid lg:grid-cols-2 gap-12 items-center">

        {/* Text */}
        <div className="space-y-6 -mt-[2rem] lg:-mt-[5rem] px-4 lg:px-0 relative z-10 lg:static">
          <h1 className="text-4xl lg:text-6xl font-black lg:leading-tight text-gray-900 font-[var(--font-heading)]">
            <span className="text-pink-500 font-black italic">Protegiendo </span> <br />
            gatos vulnerables
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg lg:text-gray-600 text-gray-700">
            Michipaceños es una asociación el cual brinda campañas de
            esterilización a bajo costo, ferias de adopción y TNR (atrapar,
            esterilizar y soltar) como nuestra principal actividad.
          </p>
<div className="flex flex-wrap gap-2 pt-2 mb-8 lg:mb-0 justify-center lg:justify-start">            <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-green-200">
              🐾 Adoptar un michi
            </button>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3.5 rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-pink-200">
              ❤️ Donar
            </button>
           
          </div>
        </div>

        {/* Image — mobile: full width behind text, desktop: normal */}
        <div className="relative lg:static -order-1 lg:order-none">
          <div className="relative w-full overflow-hidden">
            <img
              src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp"
              alt="imagen gatito tierno"
              className="w-full h-64 lg:h-full object-cover object-top"
            />
            {/* Gradient overlay en mobile para que el texto se lea */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white lg:hidden mt-36" />
          </div>
        </div>

      </div>
    </section>
  );
}