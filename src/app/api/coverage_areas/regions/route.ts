import createServerClient from '../../../../utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { ICoverageArea } from '../../../../lib/types/types';
import { DistributionDestinationType } from '../../../../lib/enums';

export async function PUT(request: NextRequest) {
    const formData = await request.formData();

    const areaAndWeightCostId = formData.get(
        'area_and_weight_cost_id',
    ) as string;

    if (!areaAndWeightCostId) {
        return NextResponse.json(
            { message: 'No area_and_weight_cost_id provided' },
            { status: 400 },
        );
    }

    const selectedRegions = formData.get('regions') as string;
    const toDeleteRegions = formData.get('to_delete_regions') as string;
    const toAddRegions = formData.get('to_add_regions') as string;

    // Convert JSON to string[]
    const selectedRegionsArray = JSON.parse(selectedRegions);
    const toDeleteRegionsArray = JSON.parse(toDeleteRegions);
    const toAddRegionsArray = JSON.parse(toAddRegions);

    const supabase = await createServerClient();

    // Delete regions from array toDeleteRegionsArray
    for (const region of toDeleteRegionsArray) {
        const { error } = await supabase
            .from('coverage_areas')
            .delete()
            .eq('country_iso_code', region.country_iso_code)
            .eq('region', region.region)
            .eq('distributor_id', region.distributor_id);

        if (error) {
            return NextResponse.json(
                { message: 'Error deleting regions' },
                { status: 500 },
            );
        }
    }

    if (toAddRegionsArray.length > 0) {
        const { data: toAddRegionsData, error: errorAddRegions } =
            await supabase
                .from('coverage_areas')
                .insert(
                    toAddRegionsArray.map((region: ICoverageArea) => ({
                        distributor_id: region.distributor_id,
                        country_iso_code: region.country_iso_code,
                        country: region.country,
                        region: region.region,
                        administrative_division:
                            DistributionDestinationType.REGION,
                    })),
                )
                .select('id, distributor_id');

        if (errorAddRegions) {
            // Rollback
            toAddRegionsArray.forEach(async (region: ICoverageArea) => {
                const regionId = region.id;

                if (!regionId) {
                    return NextResponse.json(
                        {
                            message:
                                'Error adding regions. Region ID not found',
                        },
                        { status: 500 },
                    );
                }

                const { error: errorRollbackCoverageAreasDelete } =
                    await supabase
                        .from('coverage_areas')
                        .delete()
                        .eq('id', regionId);

                if (errorRollbackCoverageAreasDelete) {
                    return NextResponse.json(
                        { message: 'Error in rollback delete regions' },
                        { status: 500 },
                    );
                }
            });

            return NextResponse.json(
                { message: 'Error adding regions' },
                { status: 500 },
            );
        }

        const toAddRegionsSelect = toAddRegionsData as ICoverageArea[];

        // Por cada region -> Habrá una entrada en la tabla AREA AND WEIGHT INFORMATION
        // que vincula las regions con el rango de precios por pesos y área
        if (toAddRegionsSelect && toAddRegionsSelect.length > 0) {
            const { error: errorAddRegions } = await supabase
                .from('area_and_weight_information')
                .insert(
                    toAddRegionsSelect.map((region: ICoverageArea) => ({
                        area_and_weight_cost_id: areaAndWeightCostId,
                        coverage_area_id: region.id,
                        distributor_id: region.distributor_id,
                    })),
                );

            if (errorAddRegions) {
                // Rollback
                for (const region of toAddRegionsSelect) {
                    const regionId = region.id;

                    if (!regionId) {
                        return NextResponse.json(
                            {
                                message:
                                    'Error adding regions. Region ID not found',
                            },
                            { status: 500 },
                        );
                    }

                    const { error: errorRollbackCoverageAreasDelete } =
                        await supabase
                            .from('coverage_areas')
                            .delete()
                            .eq('id', regionId);

                    if (errorRollbackCoverageAreasDelete) {
                        return NextResponse.json(
                            { message: 'Error in rollback delete regions' },
                            { status: 500 },
                        );
                    }
                }

                return NextResponse.json(
                    { message: 'Error adding regions' },
                    { status: 500 },
                );
            }
        }
    }

    return NextResponse.json(
        { message: 'Coverage area for Regions updated' },
        {
            status: 201,
        },
    );
}
