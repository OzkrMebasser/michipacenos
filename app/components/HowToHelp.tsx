"use client";
import React from "react";
import { HOW_TO_HELP } from "../lib/data";
import { useIntersection } from "../lib/utils";

export default function HowToHelp() {
  const { ref, visible } = useIntersection();

  return (
    <section
      ref={ref}
      id="como-ayudar"
      className="py-20 bg-[#50990b] relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="/cactus-michipacenos.png"
          className="absolute top-4 right-2 lg:right-16 w-32 h-32 "
          style={{ filter: "brightness(0) invert(1)", mixBlendMode: "screen" }}
          alt=""
        />

        <img
          src="/cactus-michipacenos.png"
          className="absolute bottom-0 left-16 w-24 h-24 "
          style={{ filter: "brightness(0) invert(1)", mixBlendMode: "screen" }}
          alt=""
        />

        <img
          src="/cat-footprint-svgrepo-com.svg"
          className="absolute top-3 left-3 lg:left-[35rem] w-16 h-16 lg:w-24 lg:h-24 rotate-12"
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-left mb-12">
          <h2 className="text-2xl lg:text-4xl font-black text-[#ffffff] font-logo  ">
            Otras formas de ayudar
            <img
              src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947672/michipaceno-icono_2_gyo21j.png"
              alt="gatito como ayudar"
              className="inline-block w-8 h-8 ml-2 scale-x-[-1]"
            />
          </h2>
          <p className="text-gray-100 text-md font-semibold leading-relaxed">
            Hay muchas maneras de ser parte del cambio
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {HOW_TO_HELP.map((item, i) => (
            <div
              key={item.title}
              className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 group ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 bg-green-100 group-hover:bg-green-200 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-black text-gray-800 text-lg mb-1">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
