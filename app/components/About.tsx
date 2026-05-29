"use client";
import React from "react";
import { useIntersection } from "@/app/lib/utils";

const ABOUT_PHOTOS = [
  {
    src: "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779870976/equipo-michi-pacenos_3_n2hhqg.jpg",
    alt: "Michi 1",
  },
  {
    src: "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779870976/equipo-michi-pacenos_1_aaoxot.jpg",
    alt: "Michi 2",
  },
  {
    src: "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779870976/equipo-michi-pacenos_2_ltw2tc.jpg",
    alt: "Michi 3",
  },
  {
    src: "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779870976/equipo-michi-pacenos_4_bcsfoy.jpg",
    alt: "Michi 4",
  },
];

export default function About() {
  const { ref, visible } = useIntersection();

  return (
    <section ref={ref} className="py-20 bg-white" id="nosotros">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div
          className={`space-y-5 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-2xl lg:text-4xl font-black text-[#ff3ca5] font-logo">
            ¿Quiénes somos?{" "}
            <img
              src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1780017073/michipaceno-icono-logo_gy5zl4.png"
              alt="gatito quienes somos"
              className="inline-block w-8 h-8 ml-1"
            />
          </h2>{" "}
          <p className="text-gray-600 text-md font-semibold leading-relaxed -mt-4">
            Cada rescate es una historia de esperanza.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Somos una organización que se creó en enero del 2024, con un grupo
            de 10 personas que coincidimos con la misma sensibilidad, amor y
            pasión por el bienestar de los gatos. Al ver la situación social en
            la que actualmente vivimos, decidimos voluntariamente ayudar a los
            gatos más vulnerables de la calle brindándoles hogar temporal,
            cuidado y protección para posteriormente buscarles un hogar. Así es
            como nació Michipaceños.
          </p>
          {/* <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-all hover:scale-105">
            Conócenos más 🐾
          </button> */}
        </div>

        {/* Photo grid */}
        <div
          className={`grid grid-cols-2 gap-3 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <img
            src={ABOUT_PHOTOS[0].src}
            alt={ABOUT_PHOTOS[0].alt}
            className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform"
          />
          <img
            src={ABOUT_PHOTOS[1].src}
            alt={ABOUT_PHOTOS[1].alt}
            className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform mt-6"
          />
          <img
            src={ABOUT_PHOTOS[2].src}
            alt={ABOUT_PHOTOS[2].alt}
            className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform -mt-6"
          />
          <img
            src={ABOUT_PHOTOS[3].src}
            alt={ABOUT_PHOTOS[3].alt}
            className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </section>
  );
}
