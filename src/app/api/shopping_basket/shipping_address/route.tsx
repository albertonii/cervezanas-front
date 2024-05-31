import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';

export async function GET(request: NextRequest) {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);

    // Extract shipping_info_id from url
    const shippingInfoId = searchParams.get('shipping_info_id');

    if (!shippingInfoId)
        return NextResponse.json(
            { message: 'Shipping address id is required' },
            { status: 400 },
        );

    const { data: shipping, error } = await supabase
        .from('shipping_info')
        .select(`*`)
        .eq('id', shippingInfoId)
        .single();

    if (error) {
        return NextResponse.json(
            { message: 'Error fetching shipping address' },
            { status: 500 },
        );
    }

    return NextResponse.json({ shipping });
}

export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const formData = await request.formData();

    const user_id = formData.get('user_id') as string;
    const name = formData.get('name') as string;
    const lastname = formData.get('lastname') as string;
    const document_id = formData.get('document_id') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const address_extra = formData.get('address_extra') as string;
    const address_observations = formData.get('address_observations') as string;
    const country = formData.get('country') as string;
    const zipcode = formData.get('zipcode') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const is_default = formData.get('is_default') === 'true';

    const { data: shippingAddress, error: shippingAddressError } =
        await supabase.from('shipping_info').insert({
            owner_id: user_id,
            name: name,
            lastname,
            document_id,
            phone,
            address,
            address_extra,
            address_observations,
            country,
            zipcode,
            city,
            state,
            is_default,
        });

    if (shippingAddressError) {
        return NextResponse.json(
            { message: 'Error creating shipping address' },
            { status: 500 },
        );
    }

    return NextResponse.json(
        { message: 'Shipping Address successfully created', shippingAddress },
        { status: 201 },
    );
}

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
