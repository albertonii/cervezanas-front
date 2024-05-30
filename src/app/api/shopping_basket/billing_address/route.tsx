import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';

export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const formData = await request.formData();

    const user_id = formData.get('user_id') as string;
    const name = formData.get('name') as string;
    const lastname = formData.get('lastname') as string;
    const document_id = formData.get('document_id') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const country = formData.get('country') as string;
    const zipcode = formData.get('zipcode') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const is_default = formData.get('is_default') === 'true';

    const { data: billingAddress, error: billingAddressError } = await supabase
        .from('billing_info')
        .insert({
            owner_id: user_id,
            name: name,
            lastname,
            document_id,
            phone,
            address,
            country,
            zipcode,
            city,
            state,
            is_default,
        });

    if (billingAddressError) {
        return NextResponse.json(
            { message: 'Error creating billing address' },
            { status: 500 },
        );
    }

    return NextResponse.json(
        { message: 'Billing Address successfully created', billingAddress },
        { status: 201 },
    );
}

export async function DELETE(request: NextRequest) {
    const supabase = await createServerClient();

    const formData = await request.formData();
    const billingAddressId = formData.get('billing_address_id') as string;

    const { error: billingAddressError } = await supabase
        .from('billing_info')
        .delete()
        .eq('id', billingAddressId);

    if (billingAddressError) {
        return NextResponse.json(
            { message: 'Error deleting billing address' },
            { status: 500 },
        );
    }

    return NextResponse.json(
        { message: 'Billing Address successfully deleted' },
        { status: 200 },
    );
}
