import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { INotification } from '@/lib//types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const useNotifications = () => {
    const { user } = useAuth();
    const { supabase } = useAuth();
    const [notifications, setNotifications] = useState<INotification[]>([]);

    const { data, refetch, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => fetchNotifications(user.id, supabase),
        enabled: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (user) {
            refetch();
        }
    }, [user, refetch]);

    useEffect(() => {
        if (data) {
            setNotifications(data as INotification[]);
        }
    }, [data]);

    const markAsRead = async (notificationId: string) => {
        await markNotificationAsRead(notificationId, supabase).then(() => {
            refetch();
        });
    };

    return { notifications, setNotifications, isLoading, markAsRead };
};

const fetchNotifications = async (ownerId: string, supabase: any) => {
    const { data, error } = await supabase
        .from('notifications')
        .select(
            `
                *
            `,
        )
        .eq('user_id', ownerId)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(15);

    if (error) throw error;
    return data as INotification[];
};

const markNotificationAsRead = async (
    notificationId: string,
    supabase: any,
) => {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    if (error) throw error;
};

export default useNotifications;
