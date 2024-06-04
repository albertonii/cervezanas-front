import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Beer Attributes
        const intensity = parseFloat(formData.get('beer.intensity') as string);
        const fermentation = formData.get('beer.fermentation') as string;
        const color = formData.get('beer.color') as string;
        const aroma = formData.get('beer.aroma') as string;
        const family = formData.get('beer.family') as string;
        const origin = formData.get('beer.origin') as string;
        const era = formData.get('beer.era') as string;
        const is_gluten = (formData.get('beer.is_gluten') as string) === 'true';
        const volume = parseFloat(formData.get('beer.volume') as string);
        const format = formData.get('beer.format') as string;
        const ibu = parseFloat(formData.get('beer.ibu') as string);
        const productId = formData.get('product_id') as string;

        const supabase = await createServerClient();

        const { error: beerError } = await supabase
            .from('beers')
            .update({
                intensity,
                fermentation,
                color,
                aroma,
                family,
                origin,
                era,
                is_gluten,
                volume,
                format,
                ibu,
            })
            .eq('product_id', productId);

        if (beerError) {
            return NextResponse.json(
                { message: 'Error updating beer attributes' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Beer Attributes successfully updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating beer attributes' },
            { status: 500 },
        );
    }
}
