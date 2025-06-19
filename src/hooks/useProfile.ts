
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setProfile(null);
      setUserStats(null);
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Fetch both profile and stats concurrently
      const [profileResult, statsResult] = await Promise.all([
        fetchProfile(),
        fetchUserStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user?.id) return null;

    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        return null;
      }

      console.log('Profile data fetched:', data);
      setProfile(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.code !== 'PGRST116') {
        toast.error('Error loading profile');
      }
      return null;
    }
  };

  const fetchUserStats = async () => {
    if (!user?.id) return null;

    try {
      console.log('Fetching user stats for user:', user.id);
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('User stats fetch error:', error);
        return null;
      }

      console.log('User stats data fetched:', data);
      setUserStats(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      if (error.code !== 'PGRST116') {
        toast.error('Error loading user statistics');
      }
      return null;
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user?.id) {
      throw new Error('No user ID available');
    }

    try {
      console.log('Updating profile with:', updates);
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      setProfile(data);
      toast.success('Profile updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile: ' + error.message);
      throw error;
    }
  };

  return {
    profile,
    userStats,
    loading,
    updateProfile,
    refetch: fetchData
  };
};
