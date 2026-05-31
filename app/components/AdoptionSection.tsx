"use client";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../admin/lib/supabase";
import type { Cat } from "../lib/types";
import CatCard from "./CatCard";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function AdoptionSection() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("cats")
      .select("*")
      .neq("status", "adoptado")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setCats(data);
        setLoading(false);
      });
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.offsetWidth / 2;
    scrollRef.current.scrollBy({
      left: dir === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between ">
          <h2 className="text-2xl lg:text-4xl font-black text-[#ff3ca5] font-logo text-left ">
            Michis en adopción
            <img
              src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947669/michipaceno-icono_5_yluzqc.png"
              alt="gatito en adopción"
              className="inline-block w-9 h-9 ml-2 scale-x-[-1]"
            />
          </h2>

          {/* <button
            onClick={() => router.push("/michis-en-adopcion")}
            className="text-green-600 font-semibold hover:underline text-sm hidden lg:block"
          >
            Ver todos los michis →
          </button> */}
        </div>
        <p className="text-gray-600 text-md font-semibold leading-relaxed mb-6">
          ¡Adoptar es salvar vidas!
        </p>
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Carousel */}
        {!loading && cats.length > 0 && (
          <div className="relative">
            {/* Arrow left */}
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white shadow-lg rounded-full items-center justify-center text-[#57971e] hover:bg-[#4a8a1a] hover:text-white transition-all border border-gray-100"
            >
              <FiChevronLeft size={20} strokeWidth={2.5} />
            </button>

            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory px-6 lg:px-0
    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ scrollPaddingLeft: "1.5rem" }}
            >
              {cats.map((cat, i) => (
                <div
                  key={cat.id}
                  className="flex-shrink-0 snap-start w-[85vw] sm:w-[45vw] lg:w-[calc(25%-15px)] mx-auto lg:mx-0"
                >
                  <CatCard cat={cat} index={i} />
                </div>
              ))}
            </div>

            {/* Arrow right */}
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white shadow-lg rounded-full items-center justify-center text-[#57971e] hover:bg-[#4a8a1a] hover:text-white transition-all border border-gray-100"
            >
              <FiChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {!loading && cats.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">😿</p>
            <p className="font-semibold">No hay michis disponibles por ahora</p>
          </div>
        )}

        {/* Ver todos button — siempre visible */}
        {!loading && cats.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/michis-en-adopcion")}
              className="group bg-[#57971e] hover:bg-[#4a8a1a] text-gray-900 font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:px-10"
            >
              Ver todos los michis
              <img
                src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1780042409/flecha-gatito_voq3x2.png"
                alt="gatito"
                className="w-12 h-6 inline-block ml-2 mb-2 transition-transform duration-300 group-hover:translate-x-2"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
