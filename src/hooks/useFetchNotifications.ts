'use client';

import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { INotification } from '@/lib//types/types';

const fetchNotifications = async (ownerId: string, supabase: any) => {
    const { data, error } = await supabase
        .from('notifications')
        .select(
            `
      *
    `,
        )
        .eq('user_id', ownerId)
        .eq('read', false);

    if (error) throw error;
    return data as INotification[];
};

const useFetchNotifications = (ownerId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => fetchNotifications(ownerId, supabase),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchNotifications;
