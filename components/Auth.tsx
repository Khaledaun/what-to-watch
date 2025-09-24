"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AuthProps {
  onAuthChange?: (user: any) => void;
}

export function Auth({ onAuthChange }: AuthProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not available, skip auth
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      onAuthChange?.(session?.user || null);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        onAuthChange?.(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [onAuthChange]);

  const signInWithGoogle = async () => {
    if (!supabase) {
      console.error('Supabase not configured');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) console.error('Error signing in:', error);
  };

  const signOut = async () => {
    if (!supabase) {
      console.error('Supabase not configured');
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  };

  return {
    user,
    isLoading,
    signInWithGoogle,
    signOut
  };
}

// Simple auth button component
export function AuthButton() {
  const { user, isLoading, signInWithGoogle, signOut } = Auth({});

  // If Supabase is not configured, don't show auth button
  if (!supabase) {
    return null;
  }

  if (isLoading) {
    return (
      <button className="px-4 py-2 bg-gray-200 rounded-lg text-gray-600">
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {user.email}
        </span>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Sign In with Google
    </button>
  );
}
