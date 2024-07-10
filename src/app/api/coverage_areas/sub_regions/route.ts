import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';
import { DistributionDestinationType } from '../../../../lib/enums';
import { ISubRegionCoverageAreas } from '../../../../lib/types/distribution_areas';

export async function PUT(request: NextRequest) {
    const formData = await request.formData();

    const areaAndWeightCostId = formData.get(
        'area_and_weight_cost_id',
    ) as string;

    const selectedSubRegions = formData.get('sub_regions') as string;
    const toDeleteSubRegions = formData.get('to_delete_sub_regions') as string;
    const toAddSubRegions = formData.get('to_add_sub_regions') as string;

    // Convert JSON to string[]
    const selectedSubRegionsArray: ISubRegionCoverageAreas[] =
        JSON.parse(selectedSubRegions);
    const toDeleteSubRegionsArray: ISubRegionCoverageAreas[] =
        JSON.parse(toDeleteSubRegions);
    const toAddSubRegionsArray: ISubRegionCoverageAreas[] =
        JSON.parse(toAddSubRegions);

    console.log('SELECTED SUB REGIONS', selectedSubRegionsArray);
    console.log('REMOVE SUB REGIONS', toDeleteSubRegionsArray);
    console.log('ADD SUB REGIONS', toAddSubRegionsArray);

    const supabase = await createServerClient();

    // Delete sub_regions from array toDeleteSubRegionsArray
    for (const subRegion of toDeleteSubRegionsArray) {
        const { error: deleteError } = await supabase
            .from('sub_region_coverage_areas')
            .delete()
            .eq('country_iso_code', subRegion.country_iso_code)
            .eq('region', subRegion.region)
            .eq('name', subRegion.name)
            .eq('distributor_id', subRegion.distributor_id);

        if (deleteError) {
            return NextResponse.json(
                { message: 'Error deleting sub_regions' },
                { status: 500 },
            );
        }
    }
    const { data: newSubRegions, error: errorAddSubRegions } = await supabase
        .from('sub_region_coverage_areas')
        .insert(
            toAddSubRegionsArray.map((sub_region: ISubRegionCoverageAreas) => ({
                distributor_id: sub_region.distributor_id,
                country_iso_code: sub_region.country_iso_code,
                country: sub_region.country,
                region: sub_region.region,
                name: sub_region.name,
            })),
        );

    if (errorAddSubRegions) {
        return NextResponse.json(
            { message: 'Error adding new sub_regions' },
            { status: 500 },
        );
    }

    // const { error } = await supabase
    //     .from('coverage_areas')
    //     .update({ sub_regions: selectedSubRegionsArray })
    //     .eq('id', coverageAreaId);

    // if (error) {
    //     return NextResponse.json(
    //         { message: 'Error updating cost extra per kg' },
    //         { status: 500 },
    //     );
    // }

    // if (toDeleteSubRegionsArray.length > 0) {
    //     const { error: error1 } = await supabase
    //         .from('area_and_weight_information')
    //         .delete()
    //         .in('name', toDeleteSubRegionsArray)
    //         .eq('coverage_area_id', coverageAreaId);

    //     if (error1) {
    //         return NextResponse.json(
    //             { message: 'Error deleting sub_regions' },
    //             { status: 500 },
    //         );
    //     }
    // }

    // if (toAddSubRegionsArray.length > 0) {
    //     // Check for existing entries to avoid duplicates
    //     const { data: existingEntries, error: checkError } = await supabase
    //         .from('area_and_weight_information')
    //         .select('name, type')
    //         .eq('area_and_weight_cost_id', areaAndWeightCostId)
    //         .in(
    //             'name',
    //             toAddSubRegionsArray.map((sub_region: string) => sub_region),
    //         );

    //     if (checkError) {
    //         return NextResponse.json(
    //             { message: 'Error checking existing sub_regions' },
    //             { status: 500 },
    //         );
    //     }

    //     const existingNames = existingEntries.map((entry) => entry.name);

    //     // Filter out the sub_regions that already exist
    //     const newSubRegions = toAddSubRegionsArray.filter(
    //         (sub_region: string) => !existingNames.includes(sub_region),
    //     );

    //     if (newSubRegions.length > 0) {
    //         const { error: error2 } = await supabase
    //             .from('area_and_weight_information')
    //             .upsert(
    //                 newSubRegions.map((sub_region: string) => ({
    //                     type: DistributionDestinationType.SUB_REGION,
    //                     name: sub_region,
    //                     area_and_weight_cost_id: areaAndWeightCostId,
    //                     coverage_area_id: coverageAreaId,
    //                 })),
    //             );

    //         if (error2) {
    //             return NextResponse.json(
    //                 { message: 'Error adding sub_regions' },
    //                 { status: 500 },
    //             );
    //         }
    //     }
    // }

    // if (
    //     toDeleteSubRegionsArray.length === 0 &&
    //     toAddSubRegionsArray.length === 0
    // ) {
    //     return NextResponse.json(
    //         { message: 'No changes made' },
    //         { status: 202 },
    //     );
    // }

    return NextResponse.json(
        { message: 'Coverage area for SubRegions updated' },
        {
            status: 201,
        },
    );
}
