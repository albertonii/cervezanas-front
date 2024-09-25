'use client';

import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IBrewery } from '@/lib//types/types';

const fetchBreweriesByOwnerId = async (ownerId: string, supabase: any) => {
    const { data, error } = await supabase
        .from('breweries')
        .select(
            `
            *
        `,
        )
        .eq('producer_id', 'f98edabe-8c36-4501-a234-7fcd2349240c');

    if (error) throw error;
    return data as IBrewery[];
};

const useFetchBreweriesByOwnerId = (producer_id: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'breweries',
        queryFn: () => fetchBreweriesByOwnerId(producer_id, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchBreweriesByOwnerId;
