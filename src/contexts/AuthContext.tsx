import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, Organization, OrganizationMembership, AppRole } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  organization: Organization | null;
  membership: OrganizationMembership | null;
  role: AppRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasOrganization: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  createOrganization: (name: string) => Promise<{ error: Error | null }>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [membership, setMembership] = useState<OrganizationMembership | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      setProfile(profileData as Profile | null);

      // Fetch membership with organization
      const { data: membershipData } = await supabase
        .from('organization_memberships')
        .select('*, organizations(*)')
        .eq('user_id', userId)
        .single();

      if (membershipData) {
        const { organizations, ...membershipOnly } = membershipData as any;
        setMembership(membershipOnly as OrganizationMembership);
        setOrganization(organizations as Organization);
      } else {
        setMembership(null);
        setOrganization(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setOrganization(null);
          setMembership(null);
        }
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName },
        },
      });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setOrganization(null);
    setMembership(null);
  };

  const createOrganization = async (name: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({ name })
        .select()
        .single();

      if (orgError) throw orgError;

      // Create membership as admin
      const { error: memberError } = await supabase
        .from('organization_memberships')
        .insert({
          organization_id: orgData.id,
          user_id: user.id,
          role: 'admin',
        });

      if (memberError) throw memberError;

      // Refresh user data
      await fetchUserData(user.id);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    organization,
    membership,
    role: membership?.role ?? null,
    isLoading,
    isAuthenticated: !!user,
    hasOrganization: !!organization,
    signUp,
    signIn,
    signOut,
    createOrganization,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
