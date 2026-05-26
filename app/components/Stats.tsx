"use client";
import React from 'react';
import { STATS } from '@/app/lib/data';
import { useIntersection } from '@/app/lib/utils';

export default function Stats() {
  const { ref, visible } = useIntersection();

  return (
    <section ref={ref} className="bg-white py-8 shadow-inner border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`text-center p-5 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-3xl">{s.icon}</span>
              <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}