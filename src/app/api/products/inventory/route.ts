import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();

        const productId = formData.get('product_id') as string;
        const stockQuantity = parseFloat(
            formData.get('stock_quantity') as string,
        );
        const stockLimitNotification = parseFloat(
            formData.get('stock_limit_notification') as string,
        );

        const supabase = await createServerClient();

        if (!productId) {
            return NextResponse.json(
                { message: 'Product ID is required' },
                { status: 400 },
            );
        }

        const { error: stockError } = await supabase
            .from('product_inventory')
            .update({
                product_id: productId,
                quantity: stockQuantity,
                limit_notification: stockLimitNotification,
            })
            .eq('product_id', productId);

        if (stockError) {
            return NextResponse.json(
                { message: 'Error updating stock', error: stockError },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Stock successfully updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating stock' },
            { status: 500 },
        );
    }
}
