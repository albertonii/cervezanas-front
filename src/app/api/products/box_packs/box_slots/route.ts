import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createServerClient();

        const formData = await request.formData();

        const boxPackId = formData.get('box_pack_id') as string;

        const boxPackItems: {
            quantity: number;
            slots_per_product: number;
            product_id: string;
        }[] = JSON.parse(formData.get('box_packs') as string);

        // Remove all box pack items
        const { error: errorDeleteBoxPackItems } = await supabase
            .from('box_pack_items')
            .delete()
            .eq('box_pack_id', boxPackId);

        if (errorDeleteBoxPackItems) {
            return NextResponse.json(
                { message: 'Error deleting box pack items' },
                { status: 500 },
            );
        }

        boxPackItems.map(async (boxItem) => {
            const { error: errorBoxPackSlots } = await supabase
                .from('box_pack_items')
                .insert({
                    quantity: boxItem.quantity,
                    slots_per_product: boxItem.slots_per_product,
                    product_id: boxItem.product_id,
                    box_pack_id: boxPackId,
                });

            if (errorBoxPackSlots) {
                return NextResponse.json(
                    { message: 'Error updating box pack slots' },
                    { status: 500 },
                );
            }
        });

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
