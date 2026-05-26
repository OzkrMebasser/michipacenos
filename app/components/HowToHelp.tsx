"use client";
import React from 'react';
import { HOW_TO_HELP } from '../lib/data';
import { useIntersection } from '../lib/utils';

export default function HowToHelp() {
  const { ref, visible } = useIntersection();

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-green-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-2">Otras formas de ayudar 💚</h2>
          <p className="text-gray-500 text-lg">Hay muchas maneras de ser parte del cambio</p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {HOW_TO_HELP.map((item, i) => (
            <div
              key={item.title}
              className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 group ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 bg-green-100 group-hover:bg-green-200 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-black text-gray-800 text-lg mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}