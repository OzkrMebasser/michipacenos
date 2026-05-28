"use client";
import React, { useState, useEffect } from 'react';
import { STATS } from '@/app/lib/data';
import { useIntersection } from '@/app/lib/utils';

function useCountUp(target: number, duration = 1500, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

function StatCard({ s, index, visible }: { s: typeof STATS[0]; index: number; visible: boolean }) {
  const numeric = parseInt(s.value.replace(/\D/g, ''), 10) || 0;
  const suffix = s.value.replace(/[0-9]/g, '');
  const count = useCountUp(numeric, 1800, visible);

  return (
    <div
      className={`text-center p-5 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <span className="text-3xl">{s.icon}</span>
      <p className={`text-3xl font-black mt-1 ${s.color}`}>
        {visible ? `${count}${suffix}` : '0'}
      </p>
      <p className="text-sm text-gray-500 font-medium mt-0.5">{s.label}</p>
    </div>
  );
}

export default function Stats() {
  const { ref, visible } = useIntersection();

  return (
    <section ref={ref} className="bg-white py-8 shadow-inner border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <StatCard key={s.label} s={s} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}