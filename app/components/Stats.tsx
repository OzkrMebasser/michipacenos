"use client";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/admin/lib/supabase";
import { useIntersection } from "@/app/lib/utils";
import type { Stat } from "@/app/lib/types";

// ── tipos extendidos con breakdown ───────────────────────────────────────────
interface StatRow extends Stat {
  id: string;
  sort_order: number;
  breakdown_a_label?: string | null;
  breakdown_a_value?: string | null;
  breakdown_b_label?: string | null;
  breakdown_b_value?: string | null;
}

// ── hook contador animado ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1500, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const raf = { id: 0 };
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress < 1) raf.id = requestAnimationFrame(step);
    };
    raf.id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.id);
  }, [active, target, duration]);
  return count;
}

// ── tarjeta individual ────────────────────────────────────────────────────────
function StatCard({
  s,
  index,
  visible,
}: {
  s: StatRow;
  index: number;
  visible: boolean;
}) {
  const numeric = parseInt(s.value.replace(/\D/g, ""), 10) || 0;
  const suffix = s.value.replace(/[0-9]/g, "");
  const count = useCountUp(numeric, 1800, visible);
  const hasBreakdown = s.breakdown_a_label && s.breakdown_a_value;

  return (
    <div
      className={`text-center p-5 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <span className="text-3xl">{s.icon}</span>
      <p className={`text-3xl font-black mt-1 ${s.color}`}>
        {visible ? `${count}${suffix}` : "0"}
      </p>
      <p className="text-sm text-gray-500 font-medium mt-0.5">{s.label}</p>

      {hasBreakdown && (
        <div className="mt-2 flex justify-center gap-3 text-xs text-gray-400">
          <span>
            {s.breakdown_a_label}:{" "}
            <strong className="text-gray-600">{s.breakdown_a_value}</strong>
          </span>
          {s.breakdown_b_label && s.breakdown_b_value && (
            <span>
              {s.breakdown_b_label}:{" "}
              <strong className="text-gray-600">{s.breakdown_b_value}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── componente principal ──────────────────────────────────────────────────────
export default function Stats() {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);
  // visible propio basado en IntersectionObserver — se dispara cuando el
  // section entra al viewport, DESPUÉS de que los datos ya están montados
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    supabase
      .from("stats")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("[Stats] supabase error:", error.message);
        if (data && data.length > 0) setStats(data as StatRow[]);
        setLoading(false);
      });
  }, []);

  // Observamos el section UNA VEZ que los datos están listos
  useEffect(() => {
    if (loading || stats.length === 0) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, stats]);

  // Skeleton mientras carga — mantiene el espacio en el layout
  if (loading) {
    return (
      <section className="bg-white py-8 shadow-inner border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="text-center p-5 rounded-2xl bg-gray-100 animate-pulse h-24"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (stats.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="bg-white py-8 shadow-inner border-y border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <StatCard key={s.id} s={s} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}