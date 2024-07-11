import createServerClient from '../../../../utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { DistributionDestinationType } from '../../../../lib/enums';

export async function PUT(request: NextRequest) {
    const formData = await request.formData();

    const coverageAreaId = formData.get('coverage_area_id') as string;
    const areaAndWeightCostId = formData.get(
        'area_and_weight_cost_id',
    ) as string;

    const selectedRegions = formData.get('regions') as string;
    const toDeleteRegions = formData.get('to_delete_regions') as string;
    const toAddRegions = formData.get('to_add_regions') as string;

    // Convert JSON to string[]
    const selectedRegionsArray = JSON.parse(selectedRegions);
    const toDeleteRegionsArray = JSON.parse(toDeleteRegions);
    const toAddRegionsArray = JSON.parse(toAddRegions);

    const supabase = await createServerClient();

    // const { error } = await supabase
    //     .from('coverage_areas')
    //     .update({ regions: selectedRegionsArray })
    //     .eq('id', coverageAreaId);

    // if (error) {
    //     return NextResponse.json(
    //         { message: 'Error updating cost extra per kg' },
    //         { status: 500 },
    //     );
    // }

    if (toDeleteRegionsArray.length > 0) {
        const { error: error1 } = await supabase
            .from('area_and_weight_information')
            .delete()
            .in('name', toDeleteRegionsArray)
            .eq('coverage_area_id', coverageAreaId);

        if (error1) {
            return NextResponse.json(
                { message: 'Error deleting regions' },
                { status: 500 },
            );
        }
    }

    if (toAddRegionsArray.length > 0) {
        // Check for existing entries to avoid duplicates
        const { data: existingEntries, error: checkError } = await supabase
            .from('area_and_weight_information')
            .select('name, type')
            .eq('area_and_weight_cost_id', areaAndWeightCostId)
            .in(
                'name',
                toAddRegionsArray.map((region: string) => region),
            );

        if (checkError) {
            return NextResponse.json(
                { message: 'Error checking existing regions' },
                { status: 500 },
            );
        }

        // const existingNames = existingEntries.map((entry) => entry.name);

        // // Filter out the regions that already exist
        // const newRegions = toAddRegionsArray.filter(
        //     (region: string) => !existingNames.includes(region),
        // );

        // if (newRegions.length > 0) {
        //     const { error: error2 } = await supabase
        //         .from('area_and_weight_information')
        //         .upsert(
        //             newRegions.map((region: string) => ({
        //                 type: DistributionDestinationType.REGION,
        //                 name: region,
        //                 area_and_weight_cost_id: areaAndWeightCostId,
        //                 coverage_area_id: coverageAreaId,
        //             })),
        //         );

        //     if (error2) {
        //         return NextResponse.json(
        //             { message: 'Error adding regions' },
        //             { status: 500 },
        //         );
        //     }
        // }
    }

    if (toDeleteRegionsArray.length === 0 && toAddRegionsArray.length === 0) {
        return NextResponse.json(
            { message: 'No changes made' },
            { status: 202 },
        );
    }

    return NextResponse.json(
        { message: 'Coverage area for Regions updated' },
        {
            status: 201,
        },
    );
}
