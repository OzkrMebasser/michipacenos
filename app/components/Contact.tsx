"use client";
import React from 'react';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61554151521513';

export default function Contact() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Brand + social */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-xl">
                🐱
              </div>
              <div>
                <p className="font-black text-xl">Michi Paceños</p>
                <p className="text-green-400 text-sm">Protegiendo gatos vulnerables</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Somos una organización rescatista independiente ubicada en La Paz, Baja California Sur,
              México. Trabajamos con amor para encontrar un hogar a cada michi.
            </p>
            <div className="flex gap-4">
              {/* Facebook */}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 hover:opacity-90 rounded-xl flex items-center justify-center transition-opacity"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-black text-xl">📬 Contáctanos</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                placeholder="Tu nombre"
                className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
              <input
                placeholder="Tu email"
                className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <select title="¿Cómo quieres ayudar?" className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors">
              <option value="">¿Cómo quieres ayudar?</option>
              <option>Adoptar un michi</option>
              <option>Hacer una donación</option>
              <option>Ser voluntario/a</option>
              <option>Hogar temporal</option>
              <option>Reportar un gato</option>
              <option>Otro</option>
            </select>
            <textarea
              rows={3}
              placeholder="Tu mensaje..."
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
            />
            <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02]">
              Enviar mensaje 🐾
            </button>
          </div>
        </div>

        {/* Footer bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-gray-500 text-sm">
          <p>© 2024 Michi Paceños · La Paz, BCS, México</p>
          <p className="flex items-center gap-1.5">
            Hecho con <span className="text-pink-500">❤️</span> para los michis de La Paz
          </p>
        </div>
      </div>
    </section>
  );
}