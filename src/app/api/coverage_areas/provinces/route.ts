import createServerClient from '../../../../utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    console.log('tamos dentro wey');
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

    console.log('COVERAGE AREA ID', coverageAreaId);
    console.log('toDeleteProvincesArray', toDeleteProvincesArray);
    console.log('toAddProvincesrray', toAddProvincesArray);

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
        const { error: error2 } = await supabase
            .from('area_and_weight_information')
            .upsert(
                toAddProvincesArray.map((province: string) => ({
                    type: 'province',
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

    if (
        toDeleteProvincesArray.length === 0 &&
        toAddProvincesArray.length === 0
    ) {
        return NextResponse.json(
            { message: 'No changes made' },
            { status: 200 },
        );
    }

    return NextResponse.json(
        { message: 'Coverage area for Provinces updated' },
        {
            status: 200,
        },
    );
}
