"use client";
import React from 'react';
import { STORIES } from '@/app/lib/data';
import { useIntersection } from '@/app/lib/utils';

export default function Stories() {
  const { ref, visible } = useIntersection();

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-2">Historias de amor 💚</h2>
          <p className="text-gray-500 text-lg">Familias que abrieron su corazón a un michi</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {STORIES.map((story, i) => (
            <div
              key={story.id}
              className={`bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <img
                src={story.image_url}
                alt={story.cat_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🐱</span>
                  <div>
                    <p className="font-black text-gray-800">{story.cat_name}</p>
                    <p className="text-xs text-gray-400">Adoptado por {story.adopter_name}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{story.text}"</p>
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}