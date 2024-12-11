import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';

// ANOTACIóN: Esta función se encarga de buscar una orden de compra por el correo electrónico y el número de orden.
// Ahora mismo no lo estamos usando
export async function GET(request: NextRequest) {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('order_number');

    // Validaciones básicas
    if (!email || !orderNumber) {
        return NextResponse.json(
            {
                message:
                    'El correo electrónico y el número de orden son requeridos.',
            },
            { status: 400 },
        );
    }

    try {
        const { data: order, error } = await supabase
            .from('event_orders')
            .select(
                `
                *,
                event_order_cps (
                    *,
                    event_order_items (
                        *,
                        product_pack_event_item (
                            *,
                            product_pack (
                                *,
                                product (
                                    *
                                )
                            )
                        )
                    )
                )
            `,
            )
            .or(`guest_email.eq.${email}`) // Si tienes usuarios registrados con email
            .eq('order_number', orderNumber)
            .single();

        if (error || !order) {
            throw new Error(
                'No se encontró la orden con los detalles proporcionados.',
            );
        }

        console.log('ORDER', order);

        return NextResponse.json({ order }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: error.message || 'Error al buscar la orden.' },
            { status: 500 },
        );
    }
}
