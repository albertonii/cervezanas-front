import { NextRequest, NextResponse } from 'next/server';
import { DistributionCostType } from '@/lib//enums';
import { IAreaAndWeightInformation, IShippingInfo } from '@/lib//types/types';
import { normalizeAddress } from '@/utils/distribution';
import { createBrowserClient } from '@/utils/supabaseBrowser';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const distributorId = searchParams.get('distributor_id');
    const totalWeight = parseFloat(
        searchParams.get('total_weight') ?? '0',
    ) as number;
    const address = searchParams.get('address');
    const city = searchParams.get('city');
    const sub_region = searchParams.get('sub_region');
    const region = searchParams.get('region');
    const country = searchParams.get('country');

    if (!distributorId) {
        return NextResponse.json(
            { message: 'Missing distributor id' },
            { status: 400 },
        );
    }

    if (!totalWeight) {
        return NextResponse.json(
            { message: 'Missing total weight' },
            { status: 400 },
        );
    }

    if (!address || !city || !sub_region || !region || !country) {
        return NextResponse.json(
            { message: 'Missing shipping info ' },
            { status: 400 },
        );
    }

    const supabase = createBrowserClient();

    const { data: distributionCosts, error: distributionCostsError } =
        await supabase
            .from('distribution_costs')
            .select(
                `
                    id, 
                    distribution_costs_in_product, 
                    selected_method
                `,
            )
            .eq('distributor_id', distributorId)
            .single();

    if (distributionCostsError) {
        return NextResponse.json(
            { message: 'Error fetching distribution costs' },
            { status: 500 },
        );
    }

    if (distributionCosts.distribution_costs_in_product) {
        return NextResponse.json({ cost: null }, { status: 200 });
    }

    if (
        distributionCosts.selected_method ===
        DistributionCostType.FLATRATE_AND_WEIGHT
    ) {
        return NextResponse.json({ cost: null }, { status: 200 });
    } else if (
        distributionCosts.selected_method ===
        DistributionCostType.AREA_AND_WEIGHT
    ) {
        const countryNormalized = normalizeAddress(country);

        const regionNormalized = normalizeAddress(region);

        const subRegionNormalized = normalizeAddress(sub_region);

        const cityNormalized = normalizeAddress(city);

        const { data: areaWeightInfoData, error: areaWeightInfoError } =
            await supabase
                .from('area_and_weight_information')
                .select(
                    `   
                        *,
                        coverage_areas (*),
                        area_weight_cost_range (*),
                        area_and_weight_cost (
                            cost_extra_per_kg
                        )
                    `,
                )
                .eq('distributor_id', distributorId);

        if (areaWeightInfoError) {
            return NextResponse.json(
                { message: 'Error fetching area and weight information' },
                { status: 500 },
            );
        }

        const areaAndWeightInfo =
            areaWeightInfoData as IAreaAndWeightInformation[];

        // Buscar el área coincidente
        const matchingArea = areaAndWeightInfo.find((area) => {
            if (
                !area.coverage_areas ||
                !area.coverage_areas.country ||
                !area.coverage_areas.region ||
                !area.coverage_areas.sub_region
            ) {
                return false;
            }

            const normalizedCountry = normalizeAddress(
                area.coverage_areas.country,
            );

            const normalizedRegion = normalizeAddress(
                area.coverage_areas.region,
            );
            const normalizedSubRegion = normalizeAddress(
                area.coverage_areas.sub_region,
            );

            return (
                normalizedCountry === countryNormalized &&
                normalizedRegion === regionNormalized &&
                normalizedSubRegion === subRegionNormalized
            );
        });

        if (matchingArea) {
            // Buscamos el rango de peso que coincida con el peso total o el rango de peso que supere el peso total para aplicar precio por KG extra
            const areaCostRange =
                matchingArea.area_weight_cost_range?.find(
                    (range) =>
                        totalWeight >= range.weight_from &&
                        totalWeight <= range.weight_to,
                ) ||
                matchingArea.area_weight_cost_range?.find(
                    (range) => totalWeight > range.weight_to,
                );

            // Use the coverageAreas data as needed
            if (areaCostRange) {
                const baseCost = areaCostRange.base_cost || 0;
                const costExtraPerKg =
                    matchingArea.area_and_weight_cost?.cost_extra_per_kg || 0;

                // Para obtener cuanto más se cobrará por cada kg adicional, hay que saber cual es el margen final de peso entre el último rango de peso (ramge.weight_to) y el peso total (totalWeight)
                // Luego se multiplica ese margen por el costo extra por kg
                const extraWeight = totalWeight - areaCostRange.weight_to;

                // Redondear una unidad por arriba el peso extra
                const extraWeightRounded = Math.ceil(extraWeight);

                // Si el valor de extraCost es negativo, se establece en 0
                const extraCost = Math.max(
                    0,
                    extraWeightRounded * costExtraPerKg,
                );

                const shippingCost = baseCost + extraCost;

                return NextResponse.json(
                    { cost: shippingCost },
                    { status: 200 },
                );
            }
        }

        return NextResponse.json(
            { message: 'No matching area found' },
            { status: 404 },
        );
    }

    return NextResponse.json(
        { message: 'Unknown distribution cost type' },
        { status: 501 },
    );
}
