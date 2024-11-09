import createServerClient from '@/utils/supabaseServer'; // Ajusta la ruta según tu estructura de proyecto
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerClient();

        // Parsear y validar los parámetros de la solicitud
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json(
                {
                    isValid: false,
                    message: 'Código promocional no proporcionado.',
                },
                { status: 400 },
            );
        }

        // Obtener la información del código promocional
        const { data: promoCode, error: promoCodeError } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('code', code)
            .single();

        if (promoCodeError || !promoCode) {
            return NextResponse.json(
                { isValid: false, message: 'Código promocional inválido.' },
                { status: 400 },
            );
        }

        // Devolver los detalles del código promocional
        return NextResponse.json(
            {
                id: promoCode.id,
                code: promoCode.code,
                discountType: promoCode.discount_type,
                discountValue: promoCode.discount_value,
                isActive: promoCode.is_active,
                startDate: promoCode.start_date,
                expirationDate: promoCode.expiration_date,
                maxUses: promoCode.max_uses,
                uses: promoCode.uses,
                maxUsagePerUser: promoCode.max_usage_per_user,
                product_id: promoCode.product_id ?? null,
                product_pack_id: promoCode.product_pack_id ?? null,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(
            'Error al obtener la información del código promocional:',
            error,
        );

        // Manejo general de errores
        return NextResponse.json(
            {
                isValid: false,
                message:
                    'Ocurrió un error al obtener la información del código promocional.',
            },
            { status: 500 },
        );
    }
}
