import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import { Type } from '@/lib//productEnum';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();

        const productId = formData.get('product_id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const is_public = (formData.get('is_public') as string) === 'true';
        const is_available =
            (formData.get('is_available') as string) === 'true';
        const price = parseFloat(formData.get('price') as string);
        const weight = parseFloat(formData.get('weight') as string);
        const brewery_id = formData.get('brewery_id') as string;

        const supabase = await createServerClient();
        const session = await readUserSession();
        const userId = session?.id;

        if (!productId) {
            return NextResponse.json(
                { message: 'Product ID is required' },
                { status: 400 },
            );
        }

        const { error: errorProduct } = await supabase
            .from('products')
            .update({
                name,
                description,
                price: price,
                is_public,
                is_available,
                weight: weight,
                owner_id: userId,
                category: Type.BEER,
                type: Type.BEER,
                brewery_id: brewery_id !== '' ? brewery_id : null,
            })
            .eq('id', productId);

        if (errorProduct) {
            return NextResponse.json(
                { message: 'Error updating product' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Product successfully updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating product' },
            { status: 500 },
        );
    }
}
