import createServerClient from '../../../../utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    const formData = await request.formData();

    const coverageAreaId = formData.get('coverage_area_id') as string;
    const areaAndWeightCostId = formData.get(
        'area_and_weight_cost_id',
    ) as string;

    const selectedCities = formData.get('cities') as string;
    const toDeleteCities = formData.get('to_delete_cities') as string;
    const toAddCities = formData.get('to_add_cities') as string;

    // Convert JSON to string[]
    const selectedCitiesArray = JSON.parse(selectedCities);
    const toDeleteCitiesArray = JSON.parse(toDeleteCities);
    const toAddCitiesArray = JSON.parse(toAddCities);

    const supabase = await createServerClient();

    const { error } = await supabase
        .from('coverage_areas')
        .update({ cities: selectedCitiesArray })
        .eq('id', coverageAreaId);

    if (error) {
        return NextResponse.json(
            { message: 'Error updating cost extra per kg' },
            { status: 500 },
        );
    }

    if (toDeleteCitiesArray.length > 0) {
        const { error: error1 } = await supabase
            .from('area_and_weight_information')
            .delete()
            .in('name', toDeleteCitiesArray)
            .eq('coverage_area_id', coverageAreaId);

        if (error1) {
            return NextResponse.json(
                { message: 'Error deleting cities' },
                { status: 500 },
            );
        }
    }

    if (toAddCitiesArray.length > 0) {
        const { error: error2 } = await supabase
            .from('area_and_weight_information')
            .upsert(
                toAddCitiesArray.map((city: string) => ({
                    type: 'city',
                    name: city,
                    area_and_weight_cost_id: areaAndWeightCostId,
                    coverage_area_id: coverageAreaId,
                })),
            );

        if (error2) {
            return NextResponse.json(
                { message: 'Error adding cities' },
                { status: 500 },
            );
        }
    }

    if (toDeleteCitiesArray.length === 0 && toAddCitiesArray.length === 0) {
        return NextResponse.json(
            { message: 'No changes made' },
            { status: 200 },
        );
    }

    return NextResponse.json(
        { message: 'Coverage area for Cities updated' },
        {
            status: 200,
        },
    );
}
