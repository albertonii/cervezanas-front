import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';

export async function PUT(request: NextRequest) {
    const formData = await request.formData();

    const areaAndWeightInformationId = formData.get(
        `area_weight_range[${0}].area_and_weight_information_id`,
    ) as string;
    const areaWeightRangeSize = parseInt(
        formData.get('area_weight_range_size') as string,
    );

    let areaWeightRange = [];

    for (let i = 0; i < areaWeightRangeSize; i++) {
        const weightFrom = parseFloat(
            formData.get(`area_weight_range[${i}].weight_from`) as string,
        );
        const weightTo = parseFloat(
            formData.get(`area_weight_range[${i}].weight_to`) as string,
        );
        const baseCost = parseFloat(
            formData.get(`area_weight_range[${i}].base_cost`) as string,
        );
        const areaAndWeightInformationId = formData.get(
            `area_weight_range[${i}].area_and_weight_information_id`,
        ) as string;

        areaWeightRange.push({
            weight_from: weightFrom,
            weight_to: weightTo,
            base_cost: baseCost,
            area_and_weight_information_id: areaAndWeightInformationId,
        });
    }

    console.log(areaAndWeightInformationId);

    const supabase = await createServerClient();

    // Delete previous area and weight costs linked with the area_and_weight_information_id
    const { error: deleteAreaAndWeightCostsError } = await supabase
        .from('area_weight_cost_range')
        .delete()
        .eq('area_and_weight_information_id', areaAndWeightInformationId);

    if (deleteAreaAndWeightCostsError) {
        return NextResponse.json(
            { message: 'Error deleting area and weight costs' },
            { status: 500 },
        );
    }

    // Insert all the area and weight costs linked with the area_and_weight_information_id
    areaWeightRange.map(async (range) => {
        const { error: areaAndWeightCostsError } = await supabase
            .from('area_weight_cost_range')
            .insert({
                area_and_weight_information_id: areaAndWeightInformationId,
                weight_from: range.weight_from,
                weight_to: range.weight_to,
                base_cost: range.base_cost,
            });

        if (areaAndWeightCostsError) {
            return NextResponse.json(
                { message: 'Error creating area and weight costs' },
                { status: 500 },
            );
        }
    });

    return NextResponse.json(
        { message: 'Area and weight costs created successfully' },
        { status: 200 },
    );
}
