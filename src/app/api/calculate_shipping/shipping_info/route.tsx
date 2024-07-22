import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@/utils/supabaseBrowser';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const shippingInfoId = searchParams.get('shipping_info_id');

    if (!shippingInfoId) {
        return NextResponse.json(
            { message: 'Missing shipping info id' },
            { status: 400 },
        );
    }

    const supabase = createBrowserClient();

    const { data: shipping, error } = await supabase
        .from('shipping_info')
        .select(`*`)
        .eq('id', shippingInfoId)
        .single();

    if (error) {
        return NextResponse.json(
            { message: 'Error fetching shipping info' },
            { status: 500 },
        );
    }

    return NextResponse.json(shipping);
}
