import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';

export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const formData = await request.formData();

    const user_id = formData.get('user_id') as string;
    const company_name = formData.get('company_name') as string;
    const document_id = formData.get('document_id') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const country = formData.get('country') as string;
    const region = formData.get('region') as string;
    const sub_region = formData.get('sub_region') as string;
    const city = formData.get('city') as string;
    const zipcode = formData.get('zipcode') as string;

    const { data: billingAddress, error: billingAddressError } = await supabase
        .from('billing_info')
        .insert({
            owner_id: user_id,
            name: company_name,
            lastname: '',
            document_id,
            phone,
            address,
            country,
            region,
            sub_region,
            city,
            zipcode,
            is_company: true,
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
