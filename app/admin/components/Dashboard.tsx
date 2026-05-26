'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import CatForm from './CatForm';
import CatTable from './CatTable';
import type { Session } from '@supabase/supabase-js';

export interface Cat {
  id: string;
  name: string;
  age: string;
  gender: 'macho' | 'hembra';
  color: string;
  description: string;
  status: 'disponible' | 'adoptado' | 'en_proceso';
  image_url: string | null;
  created_at: string;
}

interface DashboardProps {
  session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [stats, setStats] = useState({ total: 0, disponible: 0, adoptado: 0, en_proceso: 0 });

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCats(data);
      setStats({
        total: data.length,
        disponible: data.filter(c => c.status === 'disponible').length,
        adoptado: data.filter(c => c.status === 'adoptado').length,
        en_proceso: data.filter(c => c.status === 'en_proceso').length,
      });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleEdit = (cat: Cat) => {
    setEditingCat(cat);
    setView('edit');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este michi?')) return;
    await supabase.from('cats').delete().eq('id', id);
    fetchCats();
  };

  const handleSave = () => {
    setView('list');
    setEditingCat(null);
    fetchCats();
  };

  const handleCancel = () => {
    setView('list');
    setEditingCat(null);
  };

  return (
    <div className="min-h-screen bg-orange-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-orange-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐱</span>
          <div>
            <h1 className="font-bold text-orange-900 leading-tight">Panel Admin</h1>
            <p className="text-xs text-orange-400">{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-orange-600 hover:text-orange-800 font-medium px-4 py-2 rounded-xl hover:bg-orange-50 transition"
        >
          Cerrar sesión
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total michis" value={stats.total} emoji="🐾" color="orange" />
          <StatCard label="Disponibles" value={stats.disponible} emoji="💚" color="green" />
          <StatCard label="En proceso" value={stats.en_proceso} emoji="🔄" color="yellow" />
          <StatCard label="Adoptados" value={stats.adoptado} emoji="🏠" color="blue" />
        </div>

        {/* Header bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-orange-900">
            {view === 'list' ? 'Michis registrados' : view === 'add' ? 'Agregar michi' : 'Editar michi'}
          </h2>

          {view === 'list' ? (
            <button
              onClick={() => setView('add')}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
            >
              <span>+</span> Agregar michi
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-white transition"
            >
              ← Volver
            </button>
          )}
        </div>

        {/* Content */}
        {view === 'list' ? (
          <CatTable
            cats={cats}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <CatForm
            cat={editingCat}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, emoji, color }: {
  label: string;
  value: number;
  emoji: string;
  color: 'orange' | 'green' | 'yellow' | 'blue';
}) {
  const colors = {
    orange: 'bg-orange-100 text-orange-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-4 flex flex-col gap-1">
      <span className="text-xl">{emoji}</span>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}