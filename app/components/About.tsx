"use client";
import React from 'react';
import { CATS } from '@/app/lib/data';
import { useIntersection } from '@/app/lib/utils';

export default function About() {
  const { ref, visible } = useIntersection();

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div
          className={`space-y-5 transition-all duration-700 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          <h2 className="text-4xl font-black text-gray-900">
            ¿Quiénes somos? <span className="text-green-500">💚</span>
          </h2>
          {/* <p className="text-lg font-semibold text-gray-700">
            Somos un grupo de personas que creemos en un mundo más compasivo para los gatos.
          </p> */}
          <p className="text-gray-600 leading-relaxed">
            Somos una organización que se creó en enero del 2024, con un grupo de 10 personas que coincidimos con la misma sensibilidad, amor y pasión por el bienestar de los gatos. Al ver la situación social en la que actualmente vivimos, decidimos voluntariamente ayudar a los gatos más vulnerables de la calle brindándoles hogar temporal, cuidado y protección para posteriormente buscarles un hogar. Así es como nació Michipaceños.
          </p>
          <p className="text-green-600 font-bold italic text-lg">
            Cada rescate es una historia de esperanza.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-all hover:scale-105">
            Conócenos más 🐾
          </button>
        </div>

        {/* Photo grid */}
        <div
          className={`grid grid-cols-2 gap-3 transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <img src={CATS[3].image_url} alt={CATS[3].name} className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform" />
          <img src={CATS[4].image_url} alt={CATS[4].name} className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform mt-6" />
          <img src={CATS[5].image_url} alt={CATS[5].name} className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform -mt-6" />
          <img src={CATS[6].image_url} alt={CATS[6].name} className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform" />
        </div>
      </div>
    </section>
  );
}