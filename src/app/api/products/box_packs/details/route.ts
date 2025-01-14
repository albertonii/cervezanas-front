import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';
import { Type } from '@/lib//productEnum';
import readUserSession from '@/lib/actions';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();

        const productId = formData.get('product_id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const is_public = (formData.get('is_public') as string) === 'true';
        const is_available =
            (formData.get('is_available') as string) === 'true';
        const is_for_event =
            (formData.get('is_for_event') as string) === 'true';
        const price = parseFloat(formData.get('price') as string);
        const weight = parseFloat(formData.get('weight') as string);
        const slots_per_box = parseFloat(
            formData.get('slots_per_box') as string,
        );

        const supabase = await createServerClient();
        const session = await readUserSession();
        const userId = session?.id;

        const { error: errorProduct } = await supabase
            .from('products')
            .update({
                name,
                description,
                is_public,
                is_available,
                is_for_event,
                category: Type.BOX_PACK,
                type: Type.BOX_PACK,
                owner_id: userId,
                price: price,
                weight: weight,
            })
            .eq('id', productId);

        if (errorProduct) {
            return NextResponse.json(
                { message: 'Error updating product' },
                { status: 500 },
            );
        }

        const { error: errorBoxPack } = await supabase
            .from('box_packs')
            .update({
                slots_per_box,
            })
            .eq('product_id', productId);

        if (errorBoxPack) {
            return NextResponse.json(
                { message: 'Error updating box pack' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Box Pack successfully updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating product' },
            { status: 500 },
        );
    }
}
