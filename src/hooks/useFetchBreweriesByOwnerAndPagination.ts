'use client';

import { useQuery } from 'react-query';
import { IBrewery } from '@/lib//types/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchBreweriesByOwner = async (
    currentPage: number,
    resultsPerPage: number,
    isArchived: boolean,
    ownerId: string,
    supabase: SupabaseClient<any>,
) => {
    const { data, error } = await supabase
        .from('breweries')
        .select(
            `
                *,
                producer_user (*)
            `,
        )
        .eq('producer_id', ownerId)
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        )
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data as IBrewery[];
};

const useFetchBreweriesByOwnerAndPagination = (
    currentPage: number,
    resultsPerPage: number,
    isArchived: boolean,
) => {
    const { supabase, user } = useAuth();

    return useQuery({
        queryKey: 'breweriesList',
        queryFn: () =>
            fetchBreweriesByOwner(
                currentPage,
                resultsPerPage,
                isArchived,
                user.id,
                supabase,
            ),
        enabled: true,
        refetchOnWindowFocus: false,
        // cacheTime: 0, // No caching
        // staleTime: 0,  // Datos siempre frescos
    });
};

export default useFetchBreweriesByOwnerAndPagination;
