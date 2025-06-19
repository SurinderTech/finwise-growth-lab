
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'expense' | 'goal' | 'investment' | 'fraud' | 'achievement';
  created_at: string;
  read: boolean;
  user_id: string;
}

export const NotificationSystem: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    // Set up real-time notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast notification
          toast.info(newNotification.title, {
            description: newNotification.message,
            duration: 5000,
          });
        }
      )
      .subscribe();

    // Load existing notifications
    fetchNotifications();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) {
        setNotifications(data as Notification[]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return null; // This component only handles notifications, no UI
};

// Hook to send notifications from other components
export const useNotifications = () => {
  const { user } = useAuth();

  const sendNotification = async (title: string, message: string, type: Notification['type']) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title,
          message,
          type,
          read: false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return { sendNotification };
};
