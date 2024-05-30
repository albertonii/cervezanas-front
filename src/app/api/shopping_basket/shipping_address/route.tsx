import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';

export async function PUT(request: NextRequest) {}

export async function DELETE(request: NextRequest) {
    const supabase = await createServerClient();

    const formData = await request.formData();
    const shippingAddressId = formData.get('shipping_address_id') as string;

    const { error: shippingAddressError } = await supabase
        .from('shipping_info')
        .delete()
        .eq('id', shippingAddressId);

    if (shippingAddressError) {
        return NextResponse.json(
            { message: 'Error deleting shipping address' },
            { status: 500 },
        );
    }

    return NextResponse.json(
        { message: 'Shipping Address successfully deleted' },
        { status: 200 },
    );
}
