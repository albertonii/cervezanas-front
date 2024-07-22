import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Beer Attributes
        const intensity = parseFloat(formData.get('intensity') as string);
        const fermentation = formData.get('fermentation') as string;
        const color = formData.get('color') as string;
        const aroma = formData.get('aroma') as string;
        const family = formData.get('family') as string;
        const is_gluten = (formData.get('is_gluten') as string) === 'true';
        const volume = parseFloat(formData.get('volume') as string);
        const format = formData.get('format') as string;
        const ibu = parseFloat(formData.get('ibu') as string);

        const productId = formData.get('product_id') as string;

        const supabase = await createServerClient();

        if (!productId) {
            return NextResponse.json(
                { message: 'Product ID is required' },
                { status: 400 },
            );
        }

        const { error: beerError } = await supabase
            .from('beers')
            .update({
                intensity,
                fermentation,
                color,
                aroma,
                family,
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
