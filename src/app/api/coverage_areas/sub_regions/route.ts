import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';
import { DistributionDestinationType } from '../../../../lib/enums';
import { ICoverageArea_ } from '../../../../lib/types/types';

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

    const selectedSubRegions = formData.get('sub_regions') as string;
    const toDeleteSubRegions = formData.get('to_delete_sub_regions') as string;
    const toAddSubRegions = formData.get('to_add_sub_regions') as string;

    // Convert JSON to string[]
    const selectedSubRegionsArray: ICoverageArea_[] =
        JSON.parse(selectedSubRegions);
    const toDeleteSubRegionsArray: ICoverageArea_[] =
        JSON.parse(toDeleteSubRegions);
    const toAddSubRegionsArray: ICoverageArea_[] = JSON.parse(toAddSubRegions);

    console.log('SELECTED SUB REGIONS', selectedSubRegionsArray);
    console.log('REMOVE SUB REGIONS', toDeleteSubRegionsArray);
    console.log('ADD SUB REGIONS', toAddSubRegionsArray);

    const supabase = await createServerClient();

    // Delete sub_regions from array toDeleteSubRegionsArray
    for (const subRegion of toDeleteSubRegionsArray) {
        const { data: toDeleteSubRegionsSelect, error: deleteError } =
            await supabase
                .from('coverage_areas_')
                .delete()
                .eq('country_iso_code', subRegion.country_iso_code)
                .eq('region', subRegion.region)
                .eq('sub_region', subRegion.sub_region!)
                .eq('distributor_id', subRegion.distributor_id)
                .single();

        if (deleteError) {
            return NextResponse.json(
                { message: 'Error deleting sub_regions' },
                { status: 500 },
            );
        }
    }

    if (toAddSubRegionsArray.length > 0) {
        const { data: toAddSubRegionsData, error: errorAddSubRegions } =
            await supabase
                .from('coverage_areas_')
                .insert(
                    toAddSubRegionsArray.map((sub_region: ICoverageArea_) => ({
                        distributor_id: sub_region.distributor_id,
                        country_iso_code: sub_region.country_iso_code,
                        country: sub_region.country,
                        region: sub_region.region,
                        sub_region: sub_region.sub_region,
                        administrative_division:
                            DistributionDestinationType.SUB_REGION,
                    })),
                )
                .select('id');

        const toAddSubRegionsSelect = toAddSubRegionsData as ICoverageArea_[];

        // Por cada sub region -> Habrá una entrada en la tabla AREA AND WEIGHT INFORMATION
        // que vincula las sub regiones con el rango de precios por pesos y área
        if (toAddSubRegionsSelect && toAddSubRegionsSelect.length > 0) {
            const { error: errorAddSubRegions } = await supabase
                .from('area_and_weight_information_')
                .insert(
                    toAddSubRegionsSelect.map((sub_region: ICoverageArea_) => ({
                        coverage_area_id: sub_region.id,
                        area_and_weight_cost_id: areaAndWeightCostId,
                    })),
                );

            if (errorAddSubRegions) {
                return NextResponse.json(
                    { message: 'Error adding new sub_regions' },
                    { status: 500 },
                );
            }
        }
    }

    return NextResponse.json(
        { message: 'Coverage area for SubRegions updated' },
        {
            status: 201,
        },
    );
}
