"use client";
import React, { useState, useEffect } from "react";
import { useScrolled } from "@/app/lib/utils";
import { BiSolidDonateHeart } from "react-icons/bi";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Adopción", href: "/michis-en-adopcion" },
  { label: "Historias", href: "#historias" },
  { label: "Cómo ayudar", href: "#como-ayudar" },
  // { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "#contacto" },
];

const LOGO_URL =
  "https://res.cloudinary.com/dmtehcd5t/image/upload/v1779428896/BACKGROUND_FORM_ux2tku.png";

export default function Navbar() {
  const scrolled = useScrolled(20);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Detectar si es desktop para aplicar el resize del logo
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Tamaño del logo: móvil siempre 160×64; desktop cambia con scroll
  const logoW = isDesktop ? (scrolled ? "200px" : "250px") : "160px";
  const logoH = isDesktop ? (scrolled ? "80px" : "120px") : "64px";

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollProgress(Math.round(progress * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full overflow-hidden  z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white backdrop-blur-sm shadow-md"
            : "bg-white  lg:bg-transparent"
        }`}
      >
        <div className="w-full bg-gray-200/60" style={{ height: "3px" }}>
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${scrollProgress}%`,
              background: "#ff3ca5",
              borderRadius: "0 2px 2px 0",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="relative overflow-hidden transition-all duration-300"
              style={{ width: logoW, height: logoH }}
            >
              <img
                src={LOGO_URL}
                alt="Michi Paceños"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-sm font-semibold text-gray-600 hover:text-[#ff3ca5] transition-colors relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#00bcff] group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=61554151521513"
              target="_blank"
              rel="noreferrer noopener"
              className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors"
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

            <Link
              href="#donar"
              className="bg-[#ff3ca5] hover:bg-[#d42281] text-gray-900 font-bold px-5 py-2 rounded-xl text-sm transition-all hover:scale-105 hover:shadow-lg shadow-pink-200 flex items-center gap-1.5"
            >
              Donar
              <img
                src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947669/michipaceno-icono_4_rvttrm.png"
                alt="donar michi paceños"
                className="w-4 h-4 inline"
              />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          // className={`lg:hidden overflow-hidden transition-all duration-300 ${
          //   menuOpen ? 'h-full opacity-' : 'max-h-0 opacity-0'
          // }`}
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-semibold text-gray-700 hover:text-pink-500 py-2.5 px-2 rounded-xl hover:bg-pink-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 px-2 pt-2 pb-1">
              <a
                href="https://www.facebook.com/profile.php?id=61554151521513"
                target="_blank"
                rel="noreferrer noopener"
                className="text-blue-600"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#donar" className="text-pink-500" aria-label="Instagram">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
            <Link
              href="#donar"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 rounded-xl mt-1 transition-colors"
            >
              Donar ahora
              <img
                src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947669/michipaceno-icono_4_rvttrm.png"
                alt="donar michi paceños"
                className="w-4 h-4"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* Overlay para cerrar al tocar fuera */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
