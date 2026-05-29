'use client';

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import type { Session } from '@supabase/supabase-js';

const ALLOWED_EMAILS = (process.env.NEXT_PUBLIC_ALLOWED_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase());

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  const handleSession = async (session: Session | null) => {
    if (session) {
      const email = session.user.email?.toLowerCase() || '';
      if (!ALLOWED_EMAILS.includes(email)) {
        await supabase.auth.signOut();
        setSession(null);
        setDenied(true);
      } else {
        setDenied(false);
        setSession(session);
      }
    } else {
      setSession(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-white ">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-orange-700 font-medium text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="h-[80vh] mt-24 flex items-center justify-center bg-white">
        <div className="bg-white rounded-2xl border border-red-500 p-8 max-w-sm w-full text-center shadow-sm">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Acceso denegado</h2>
          <p className="text-sm text-gray-500 mb-6">
            Tu cuenta de Google no tiene permiso para acceder al panel.
          </p>
          <button
            onClick={() => setDenied(false)}
          className="text-sm text-[#ffffff] hover:text-[#ffffff] bg-[red] font-medium px-4 py-2 rounded-xl hover:bg-[#d40606] transition hover:scale-105"
          >
            Intentar con otra cuenta
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return <Dashboard session={session} />;
}