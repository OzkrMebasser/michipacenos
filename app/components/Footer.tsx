"use client";
import React, { useState } from "react";
import Link from "next/link";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61554151521513";
const WHATSAPP_NUMBER = "526121234567"; // ← cambia por el número real con código de país

export default function Contact() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [ayuda, setAyuda] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleEnviar = () => {
    const texto = `
Nuevo mensaje - Michi Paceños

Nombre: ${nombre || "No especificado"}
Email: ${email || "No especificado"}
Como quiere ayudar: ${ayuda || "No especificado"}
Mensaje: ${mensaje || "Sin mensaje"}
  `.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };
  return (
    <footer className="py-20 bg-white text-white px-4" id="contacto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl lg:text-4xl font-black text-[#ff3ca5] font-logo text-left">
          Contáctanos
          <img
            src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947669/michipaceno-icono_5_yluzqc.png"
            alt="gatito en adopción"
            className="inline-block w-9 h-9 ml-2 scale-x-[-1]"
          />
        </h2>
      </div>
      <p className="text-gray-600 text-md font-semibold leading-relaxed mb-6">
        ¿Quieres adoptar, ser voluntario/a, reportar un michi o simplemente
        saludar? ¡Escríbenos!
      </p>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-black text-xl">📬 Contáctanos</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
              <input
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <select
              title="¿Cómo quieres ayudar?"
              value={ayuda}
              onChange={(e) => setAyuda(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
            >
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
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
            />
            <button
              onClick={handleEnviar}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar por WhatsApp
            </button>
          </div>

          {/* Brand + social */}
          <div className="space-y-5 flex flex-col items-center text-center lg:text-left">
            <img
              src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779427098/LOGO_MICHI_PACE%C3%91OS_FONDO_TRANSPARENTE_1_cstx1q.png"
              alt="logo fundacion Michi Paceños"
              className="w-48 h-48 object-contain"
            />
            <p className="text-gray-400 leading-relaxed max-w-md text-center lg:text-left">
              Somos una organización rescatista independiente ubicada en La Paz,
              Baja California Sur, México. Trabajamos con amor para encontrar un
              hogar a cada michi.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61554151521513"
                target="_blank"
                rel="noreferrer noopener"
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg
                  viewBox="0 0 512 512"
                  className="w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="20"
                    strokeMiterlimit="10"
                    d="M440.46,195.72c-4.65,13.85-14.67,27.17-24.36,40.05-6.68,8.87-15.21,20.09-19.53,28.84v-41.73c.29-.38,.58-.77,.87-1.15,22.91-30.45,28.6-43.24,14.85-54.37-5.01-4.06-5.79-11.41-1.73-16.42,4.05-5.01,11.4-5.78,16.41-1.73,14.98,12.13,19.64,28.2,13.49,46.51Z"
                  />
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="20"
                    strokeMiterlimit="10"
                    d="M309.72,391.32h17.03c38.2,0,69.17-30.97,69.17-69.17v-119.18c0-30.74-20.05-56.79-47.77-65.8-1.75-.57-3.11-1.94-3.7-3.68l-11.81-34.97c-1.32-3.92-6.37-4.98-9.16-1.92l-32.04,35.09-.02,.02c-1.16,1.28-2.75,2.09-4.48,2.09h-59.52c-1.73,0-3.32-.81-4.48-2.09l-.02-.02-32.04-35.09c-2.79-3.06-7.84-2-9.16,1.92l-11.88,35.16c-.58,1.72-1.93,3.08-3.65,3.66-27.46,9.17-47.25,35.08-47.25,65.63v119.18c0,38.2,30.97,69.17,69.17,69.17h79.69"
                  />
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M309.72,391.32v-87.37h20.75l7.56-35.1h-28.31v-17.41c0-3.57,.94-6.45,2.83-8.63s4.33-3.26,7.33-3.26h17.24v-41.63h-23.48c-14.41,0-25.65,3.55-33.73,10.66-8.07,7.1-12.11,16.9-12.11,29.37v30.9h-14.8v35.1h14.8v87.37"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="px-8 border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-gray-500 text-sm">
          <p>
            © 2024 <Link href="/admin">Michi Paceños</Link> · La Paz, BCS, México
          </p>
          <p className="flex items-center gap-1.5">
            Hecho con <span className="text-pink-500">❤️</span> para los michis
            de La Paz
          </p>
        </div>
      </div>
    </footer>
  );
}
