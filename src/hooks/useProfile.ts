
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
    if (user?.id) {
      fetchData();
    } else {
      setProfile(null);
      setUserStats(null);
      setLoading(false);
    }
  }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log('Fetching profile and stats for user:', user.id);
      
      // Fetch both profile and stats concurrently
      const [profileResult, statsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      console.log('Profile result:', profileResult);
      console.log('Stats result:', statsResult);

      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileResult.error);
      } else {
        setProfile(profileResult.data);
      }

      if (statsResult.error && statsResult.error.code !== 'PGRST116') {
        console.error('User stats fetch error:', statsResult.error);
      } else {
        setUserStats(statsResult.data);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
