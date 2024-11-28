'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery, UseQueryResult } from 'react-query';
import { IDistributionCost, IUser } from '@/lib/types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchDistributionCostByOwnerId = async (
    userId: string,
    supabase: SupabaseClient<any>,
) => {
    const { data: distributionCosts, error: distributionCostsError } =
        await supabase
            .from('distribution_costs')
            .select(
                `
                id,
                created_at,
                distributor_id,
                distribution_costs_in_product,
                selected_method,
                flatrate_cost!flatrate_cost_distribution_costs_id_fkey (
                    created_at,
                    distribution_costs_id,
                    local_distribution_cost,
                    national_distribution_cost,
                    europe_distribution_cost,
                    international_distribution_cost,
                    is_checked_local,
                    is_checked_national,
                    is_checked_europe,
                    is_checked_international
                ),
                flatrate_and_weight_cost (
                    id,
                    distribution_costs_id,
                    created_at,
                    updated_at,
                    weight_from,
                    weight_to,
                    base_cost
                ),
                area_and_weight_cost (
                    id,
                    distribution_costs_id,
                    cost_extra_per_kg,
                    area_and_weight_information (
                        id,
                        area_and_weight_cost_id,
                        coverage_area_id,
                        coverage_areas (
                            id,
                            country_iso_code,
                            country,
                            region,
                            sub_region,
                            city,
                            administrative_division,
                            distributor_id
                        ),
                        area_weight_cost_range (
                            id,
                            weight_from,
                            weight_to,
                            base_cost,
                            area_and_weight_information_id
                        )
                    )
                )
                `,
            )
            .eq('distributor_id', userId)
            .single();

    if (distributionCostsError) {
        console.error(distributionCostsError);
        throw distributionCostsError;
    }

    return distributionCosts as unknown as IDistributionCost;
};

const useFetchDistributionCostByOwnerId = (
    userId: string,
): UseQueryResult<IDistributionCost, unknown> => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'distribution_costs',
        queryFn: () => fetchDistributionCostByOwnerId(userId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchDistributionCostByOwnerId;
