import { NextRequest, NextResponse } from 'next/server';
import {
    DistributionCostType,
    DistributionDestinationType,
} from '../../../lib/enums';
import { IAreaAndWeightInformation } from '../../../lib/types/types';
import { createBrowserClient } from '../../../utils/supabaseBrowser';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const distributorId = searchParams.get('distributor_id');
    const totalWeight = searchParams.get('total_weight');
    const shippingInfoId = searchParams.get('shipping_info_id');

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

    if (!shippingInfoId) {
        return NextResponse.json(
            { message: 'Missing shipping info id' },
            { status: 400 },
        );
    }

    const supabase = createBrowserClient();

    const { data: distributionCosts, error: distributionCostsError } =
        await supabase
            .from('distribution_costs')
            .select(
                'id, cost_extra_per_kg, distribution_costs_in_product, selected_method',
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
        return NextResponse.json(0, { status: 200 });
    }

    if (
        distributionCosts.selected_method ===
        DistributionCostType.FLATRATE_AND_WEIGHT
    ) {
        return NextResponse.json(0, { status: 200 });
    } else if (
        distributionCosts.selected_method ===
        DistributionCostType.AREA_AND_WEIGHT
    ) {
        const { data: areaAndWeightCost, error: areaAndWeightCostError } =
            await supabase
                .from('area_and_weight_cost')
                .select(
                    `
                        id,
                        distribution_costs_id,
                        cost_extra_per_kg,
                        area_and_weight_information (
                            id,
                            type,
                            name,
                            coverage_area_id,
                            area_and_weight_cost_id,
                            area_weight_cost_range (
                                *,
                                id,
                                weight_from,
                                weight_to,
                                base_cost,
                                area_and_weight_information_id
                            )
                        )
                    `,
                )
                .eq('distribution_costs_id', distributionCosts.id)
                .single();

        if (areaAndWeightCostError) {
            return NextResponse.json(
                { message: 'Error fetching area and weight cost' },
                { status: 500 },
            );
        }

        // Obtener dirección de envío para calcular el costo de envío
        const { data: shippingInfo, error: shippingInfoError } = await supabase
            .from('shipping_info')
            .select(
                `
                    *
                `,
            )
            .eq('id', shippingInfoId)
            .single();

        if (shippingInfoError) {
            return NextResponse.json(
                { message: 'Error fetching shipping info' },
                { status: 500 },
            );
        }

        // Sort area_and_weight_information by type (city, province, region, country)
        // 1. City
        const areaTypeCity =
            areaAndWeightCost.area_and_weight_information.filter(
                (area: any) => area.type === DistributionDestinationType.CITY,
            );

        const cityFound = areaTypeCity.find((area: any) => {
            console.log('AREA', area.name);
            console.log('AREA', shippingInfo.city);
            console.log(area.name === shippingInfo.city);

            // Convertir a minúsculas y quitar acentos y espacios en blanco extra para comparar
            const areaName = area.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '');

            const shippingCity = shippingInfo
                .city!.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '');

            return areaName === shippingCity;
        });

        // console.log(
        //     'AREA AND  WEIGHT INFO',
        //     areaAndWeightCost.area_and_weight_information,
        // );
        // console.log('AREA TYPE CITY', areaTypeCity);
        // console.log('SHIPPING CITY NAME', shippingInfo.city);

        if (cityFound) {
            // Comprobar que no esté vacío los rangos de peso y peso
            if (cityFound.area_weight_cost_range.length === 0) {
                return NextResponse.json(
                    { message: 'Area and weight cost range is empty' },
                    { status: 500 },
                );
            }

            const areaAndWeightCostRange =
                cityFound.area_weight_cost_range.find(
                    (range: any) =>
                        totalWeight >= range.weight_from &&
                        totalWeight <= range.weight_to,
                );

            console.log('AREA AND WEIGHT COST RANGE', areaAndWeightCostRange);

            if (!areaAndWeightCostRange) {
                return NextResponse.json(
                    { message: 'Area and weight cost range not found' },
                    { status: 500 },
                );
            }

            const baseCost = areaAndWeightCostRange.base_cost || 0;
            const costExtraPerKg = areaAndWeightCost.cost_extra_per_kg || 0;

            // TODO: PARA PODER APLICAR EL COSTE EXTRA HAY QUE SABER SI NOS
            // ESTAMOS PASANDO DE PESO Y CUÁNTO NOS ESTAMOS PASANDO DE PESO

            const shippingCost =
                baseCost + costExtraPerKg * parseFloat(totalWeight);

            return NextResponse.json(shippingCost, { status: 200 });
        }

        return NextResponse.json({ message: 'OK' }, { status: 200 });

        // 2. Province
        const areaTypeProvince =
            areaAndWeightCost.area_and_weight_information.filter(
                (area: any) =>
                    area.type === DistributionDestinationType.PROVINCE,
            );

        // 3. Region
        const areaTypeRegion =
            areaAndWeightCost.area_and_weight_information.filter(
                (area: any) => area.type === DistributionDestinationType.REGION,
            );

        // 4. Country
        const areaTypeCountry =
            areaAndWeightCost.area_and_weight_information.filter(
                (area: any) =>
                    area.type === DistributionDestinationType.INTERNATIONAL,
            );

        const weight = parseFloat(totalWeight);

        // const areaAndWeightCostRange =
        //     areaAndWeightCost.area_and_weight_information.area_weight_cost_range.find(
        //         (range: IAreaAndWeightCostRange) =>
        //             weight >= range.weight_from && weight <= range.weight_to,
        //     );

        // const shippingCost =
        //     areaAndWeightCostRange.base_cost +
        //     areaAndWeightCost.cost_extra_per_kg * weight;

        return NextResponse.json(
            { message: 'Area and weight shipping cost not implemented' },
            { status: 501 },
        );
    }

    return NextResponse.json(
        { message: 'Unknown distribution cost type' },
        { status: 501 },
    );
}
