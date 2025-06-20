
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
        
        // Handle profile checking for signed in users
        if (event === 'SIGNED_IN' && session?.user && !profileChecked && mounted) {
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('full_name, age, occupation')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('Profile check:', profile, error);
              
              // Only redirect if profile is incomplete AND we're not already on onboarding
              if (!error && profile && (!profile.full_name || !profile.age || !profile.occupation)) {
                const currentPath = window.location.pathname;
                if (currentPath !== '/onboarding' && mounted) {
                  console.log('Redirecting to onboarding...');
                  window.location.href = '/onboarding';
                }
              }
              
              if (mounted) {
                setProfileChecked(true);
              }
            } catch (error) {
              console.error('Error checking profile:', error);
              if (mounted) {
                setProfileChecked(true);
              }
            }
          }, 1000);
        }

        // Reset profile check on sign out
        if (event === 'SIGNED_OUT' && mounted) {
          setProfileChecked(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [profileChecked]);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting sign up process...');
      
      // Use the current origin for redirect
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      console.log('Sign up response:', { data, error });

      if (error) {
        console.error('Sign up error:', error);
        
        // Handle specific Supabase error codes
        if (error.code === 'over_email_send_rate_limit') {
          return { error: 'Too many sign-up attempts. Please wait before trying again.' };
        } else if (error.code === 'signup_disabled') {
          return { error: 'Sign-ups are currently disabled. Please contact support.' };
        } else if (error.message.includes('already registered')) {
          return { error: 'This email is already registered. Please sign in instead.' };
        }
        
        return { error: error.message };
      }

      console.log('Sign up successful');
      return { error: null };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      return { error: error.message || 'An unexpected error occurred during sign up' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        
        // Handle specific Supabase error codes
        if (error.code === 'invalid_credentials') {
          return { error: 'Invalid email or password' };
        } else if (error.code === 'email_not_confirmed') {
          return { error: 'Please check your email and confirm your account' };
        } else if (error.code === 'too_many_requests') {
          return { error: 'Too many sign-in attempts. Please wait before trying again.' };
        }
        
        return { error: error.message };
      }

      console.log('Sign in successful');
      return { error: null };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      return { error: error.message || 'An unexpected error occurred during sign in' };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      await supabase.auth.signOut();
      setProfileChecked(false);
      console.log('Sign out successful');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
