import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const productId = formData.get(`product_id`) as string;
    const userId = formData.get(`owner_id`) as string;

    const supabase = await createServerClient();

    const { error } = await supabase
        .from('likes')
        .insert([{ product_id: productId, owner_id: userId }]);

    if (error) {
        return NextResponse.json(
            { message: 'Error inserting product like' },
            { status: 500 },
        );
    }

    return NextResponse.json(
        { message: 'Product like inserted successfully' },
        { status: 200 },
    );
}

export async function DELETE(request: NextRequest) {
    // Get the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('owner_id');
    const productId = searchParams.get('product_id');

    const supabase = await createServerClient();

    const { error } = await supabase
        .from('likes')
        .delete()
        .match({ product_id: productId, owner_id: userId });

    if (error) {
        return NextResponse.json(
            { message: 'Error deleting product like' },
            { status: 500 },
        );
    }

    return NextResponse.json(
        { message: 'Product like deleted successfully' },
        { status: 200 },
    );
}
