import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { INotification } from '@/lib/types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const useNotifications = () => {
    const { user, supabase } = useAuth();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [openNotification, setOpenNotification] = useState(false);

    const { data, isLoading } = useQuery(
        'notifications',
        () => fetchNotifications(user.id, supabase),
        {
            enabled: !!user,
            refetchOnWindowFocus: false,
        },
    );

    useEffect(() => {
        if (data) {
            setNotifications(data as INotification[]);
        }
    }, [data]);

    useEffect(() => {
        if (user) {
            const channel = supabase
                .channel('notifications')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        setNotifications((prevState) => [
                            payload.new as INotification,
                            ...prevState,
                        ]);
                    },
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [supabase, user, setNotifications]);

    const markAsRead = async (notificationId: string) => {
        await markNotificationAsRead(notificationId, supabase);
        setNotifications((prevState) =>
            prevState.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification,
            ),
        );
    };

    return {
        notifications,
        setNotifications,
        openNotification,
        setOpenNotification,
        isLoading,
        markAsRead,
    };
};

export default useNotifications;

async function fetchNotifications(ownerId: string, supabase: any) {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', ownerId)
        .eq('read', false)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as INotification[];
}

async function markNotificationAsRead(notificationId: string, supabase: any) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    if (error) throw error;
}
