import { NextRequest, NextResponse } from 'next/server';
import { ONLINE_ORDER_STATUS } from '../../../../constants';
import createServerClient from '../../../../utils/supabaseServer';

export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const formData = await request.formData();

    const user_id = formData.get('user_id') as string;
    const name = formData.get('name') as string;
    const lastname = formData.get('lastname') as string;
    const total = Number(formData.get('total'));
    const subtotal = Number(formData.get('subtotal'));
    const deliveryCost = Number(formData.get('delivery_cost'));
    const discount = Number(formData.get('discount'));
    const discountCode = formData.get('discount_code') as string;
    const currency = formData.get('currency') as string;
    const orderNumber = formData.get('order_number') as string;
    const type = formData.get('type') as string;
    const tax = Number(formData.get('tax'));
    const shippingInfoId = formData.get('shipping_info_id') as string;
    const billingInfoId = formData.get('billing_info_id') as string;

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            owner_id: user_id,
            customer_name: `${name} ${lastname}`,
            status: ONLINE_ORDER_STATUS.PENDING,
            tracking_id: '123456789',
            issue_date: new Date().toISOString(),
            estimated_date: new Date(
                new Date().getTime() + 1000 * 60 * 60 * 24 * 3,
            ).toISOString(), // 3 days
            total: total,
            subtotal: subtotal,
            shipping: deliveryCost,
            discount: discount,
            discount_code: discountCode,
            currency: currency,
            order_number: orderNumber,
            type: type,
            tax: tax,
            shipping_info_id: shippingInfoId,
            billing_info_id: billingInfoId,
        })
        .select('id')
        .single();

    if (orderError) {
        return NextResponse.json(
            { message: 'Error creating online order' },
            { status: 500 },
        );
    }

    return NextResponse.json({ message: order.id }, { status: 201 });
}
