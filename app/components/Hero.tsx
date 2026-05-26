"use client";
import React from 'react';

export default function Hero() {
  return (
    <section className="relative w-full flex items-center overflow-hidden pt-20 bg-gradient-to-br from-green-50 via-white to-pink-50">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-green-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className=" mx-auto px-8 lg:px-0 lg:pl-16 grid lg:grid-cols-2 gap-12 items-center  overflow-hidden">
        {/* Text */}
        <div className="space-y-8 mb-12">
         
          <h1 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900 font-[var(--font-heading)]">
           <span className="text-pink-500 font-black italic">Protegiendo </span> gatos vulnerables{' '}
            
            
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
            Michipaceños es una asociación el cual brinda campañas de esterilización a bajo costo, ferias de adopción y TNR (atrapar, esterilizar y soltar) como nuestra principal actividad.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-green-200">
              🐾 Adoptar un michi
            </button>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3.5 rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-pink-200">
              ❤️ Donar
            </button>
            <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-3.5 rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-teal-200">
              🤝 Ser voluntario
            </button>
          </div>
        </div>

        {/* Image collage */}
        <div className="relative ">
          <div className="relative w-full h-full overflow-hidden">
            <img
              src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779422759/michi-cute_ovgwxi.webp"
              alt="imagen gatito tierno"
                className="w-full h-full object-cover "
            />
            {/* Floating decorations */}
            {/* <div className="absolute top-8 left-16 text-4xl animate-bounce">💚</div>
            <div className="absolute top-40 right-4 text-3xl animate-pulse text-pink-400">♥</div>
            <div className="absolute bottom-8 right-24 text-2xl animate-bounce delay-300">🐾</div> */}
          </div>
        </div>
      </div>
    </section>
  );
}