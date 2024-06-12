import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';

export async function PUT(request: NextRequest) {}

export async function DELETE(request: NextRequest) {
    const supabase = await createServerClient();
    const formData = await request.formData();

    const packsSize = parseInt(formData.get('packs_size') as string);

    for (let i = 0; i < packsSize; i++) {
        const packUrl = formData.get(`packs[${i}].img_url`) as string;


        const { error: packError } = await supabase.storage
            .from('products')
            .remove([`${decodeURIComponent(packUrl)}`]);

        if (packError) {
            return NextResponse.json(
                { message: 'Error deleting pack image' },
                { status: 500 },
            );
        }
    }

    return NextResponse.json(
        { message: 'Pack successfully deleted' },
        { status: 200 },
    );
}
