import { useState, useEffect } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { Profile } from './types';
import Auth from './components/Auth';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import ConfigPortal from './components/ConfigPortal';
import { Loader2 } from 'lucide-react';
import React from 'react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const configured = isConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  async function fetchProfile(uid: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5A5A40]" />
      </div>
    );
  }

  if (!configured) {
    return <ConfigPortal />;
  }

  if (!session) {
    return <Auth />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full text-center">
          <h2 className="text-2xl font-serif mb-4">Configurando seu perfil...</h2>
          <p className="text-gray-600 mb-6">Estamos preparando tudo para você começar.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#5A5A40] text-white rounded-full"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {profile.role === 'admin' ? (
        <AdminDashboard profile={profile} />
      ) : (
        <ClientDashboard profile={profile} />
      )}
    </div>
  );
}
