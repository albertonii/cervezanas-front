import createServerClient from '../../../../utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { DistributionDestinationType } from '../../../../lib/enums';

export async function PUT(request: NextRequest) {
    const formData = await request.formData();

    const coverageAreaId = formData.get('coverage_area_id') as string;
    const areaAndWeightCostId = formData.get(
        'area_and_weight_cost_id',
    ) as string;

    const selectedProvinces = formData.get('provinces') as string;
    const toDeleteProvinces = formData.get('to_delete_provinces') as string;
    const toAddProvinces = formData.get('to_add_provinces') as string;

    // Convert JSON to string[]
    const selectedProvincesArray = JSON.parse(selectedProvinces);
    const toDeleteProvincesArray = JSON.parse(toDeleteProvinces);
    const toAddProvincesArray = JSON.parse(toAddProvinces);

    const supabase = await createServerClient();

    const { error } = await supabase
        .from('coverage_areas')
        .update({ provinces: selectedProvincesArray })
        .eq('id', coverageAreaId);

    if (error) {
        return NextResponse.json(
            { message: 'Error updating cost extra per kg' },
            { status: 500 },
        );
    }

    if (toDeleteProvincesArray.length > 0) {
        const { error: error1 } = await supabase
            .from('area_and_weight_information')
            .delete()
            .in('name', toDeleteProvincesArray)
            .eq('coverage_area_id', coverageAreaId);

        if (error1) {
            return NextResponse.json(
                { message: 'Error deleting provinces' },
                { status: 500 },
            );
        }
    }

    if (toAddProvincesArray.length > 0) {
        // Check for existing entries to avoid duplicates
        const { data: existingEntries, error: checkError } = await supabase
            .from('area_and_weight_information')
            .select('name, type')
            .eq('area_and_weight_cost_id', areaAndWeightCostId)
            .in(
                'name',
                toAddProvincesArray.map((province: string) => province),
            );

        if (checkError) {
            return NextResponse.json(
                { message: 'Error checking existing provinces' },
                { status: 500 },
            );
        }

        const existingNames = existingEntries.map((entry) => entry.name);

        // Filter out the provinces that already exist
        const newProvinces = toAddProvincesArray.filter(
            (province: string) => !existingNames.includes(province),
        );

        if (newProvinces.length > 0) {
            const { error: error2 } = await supabase
                .from('area_and_weight_information')
                .upsert(
                    newProvinces.map((province: string) => ({
                        type: DistributionDestinationType.PROVINCE,
                        name: province,
                        area_and_weight_cost_id: areaAndWeightCostId,
                        coverage_area_id: coverageAreaId,
                    })),
                );

            if (error2) {
                return NextResponse.json(
                    { message: 'Error adding provinces' },
                    { status: 500 },
                );
            }
        }
    }

    if (
        toDeleteProvincesArray.length === 0 &&
        toAddProvincesArray.length === 0
    ) {
        return NextResponse.json(
            { message: 'No changes made' },
            { status: 202 },
        );
    }

    return NextResponse.json(
        { message: 'Coverage area for Provinces updated' },
        {
            status: 201,
        },
    );
}
