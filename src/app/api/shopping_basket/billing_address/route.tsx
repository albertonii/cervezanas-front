import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';

export async function PUT(request: NextRequest) {}

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
