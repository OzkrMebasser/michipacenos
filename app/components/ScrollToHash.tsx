"use client";
import { useEffect } from "react";

export default function ScrollToHash() {
  useEffect(() => {
    console.log("ScrollToHash montado");
    console.log("hash:", window.location.hash);
    
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      console.log("No hay hash, saliendo");
      return;
    }

    const tryScroll = (attempts = 0) => {
      console.log(`Intento ${attempts} buscando #${hash}`);
      const el = document.getElementById(hash);
      console.log("Elemento encontrado:", el);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (attempts < 15) {
        setTimeout(() => tryScroll(attempts + 1), 150);
      }
    };
    tryScroll();
  }, []);

  return null;
}