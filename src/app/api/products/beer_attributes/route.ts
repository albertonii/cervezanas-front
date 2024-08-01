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
        const ingredients = formData.get('ingredients') as string;
        const pairing = formData.get('pairing') as string;
        const recommended_glass = formData.get('recommended_glass') as string;
        const brewers_note = formData.get('brewers_note') as string;
        const og = parseFloat(formData.get('og') as string);
        const fg = parseFloat(formData.get('fg') as string);
        const srm = parseFloat(formData.get('srm') as string);
        const ebc = parseFloat(formData.get('ebc') as string);
        const hops_type = formData.get('hops_type') as string;
        const malt_type = formData.get('malt_type') as string;
        const consumption_temperature = parseFloat(
            formData.get('consumption_temperature') as string,
        );

        // Transformar string a array separado por comas
        const ingredientsArray = ingredients.split(',');

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
                ingredients: ingredientsArray,
                pairing,
                recommended_glass,
                brewers_note,
                og,
                fg,
                srm,
                ebc,
                hops_type,
                malt_type,
                consumption_temperature,
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
