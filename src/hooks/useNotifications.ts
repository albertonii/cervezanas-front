import { useState, useEffect } from 'react';
import { INotification } from '../lib/types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const useNotifications = () => {
    const { supabase, user } = useAuth();
    const [notifications, setNotifications] = useState<INotification[]>([]);

    const updateNotifications = async () => {
        const { data: newNotifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .limit(15);

        if (error) {
            console.error('Error fetching notifications:', error.message);
            return;
        }

        setNotifications(newNotifications as INotification[]);
    };

    useEffect(() => {
        if (user) {
            updateNotifications();
        }
    }, [user]);

    return { notifications, updateNotifications };
};

export default useNotifications;
