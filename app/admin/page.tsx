'use client';

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import type { Session } from '@supabase/supabase-js';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-orange-700 font-medium text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return <Dashboard session={session} />;
}