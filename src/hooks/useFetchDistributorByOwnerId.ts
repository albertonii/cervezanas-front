'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery, UseQueryResult } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IDistributorUser } from '@/lib/types/types';

const fetchDistributorByOwnerId = async (
    userId: string,
    supabase: SupabaseClient<any>,
) => {
    if (!userId) return;
    const { data, error } = await supabase
        .from('distributor_user')
        .select(
            `
              *,
              coverage_areas (
                id,
                country_iso_code,
                country,
                region,
                sub_region,
                city,
                administrative_division

              ),
              distribution_costs (
                id,
                area_and_weight_cost (
                    id, cost_extra_per_kg
                )
              )
            `,
        )
        .eq('user_id', userId)
        .single();

    if (error) throw error;
    return data as IDistributorUser;
};

const useFetchDistributorByOwnerId = (): UseQueryResult<
    IDistributorUser,
    unknown
> => {
    const { user, supabase } = useAuth();

    return useQuery({
        queryKey: 'distributor_user',
        queryFn: () => fetchDistributorByOwnerId(user?.id, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchDistributorByOwnerId;
