import createServerClient from '@/utils/supabaseServer'; // Ajusta la ruta según tu estructura de proyecto
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const validatePromoCodeSchema = z.object({
    code: z.string().nonempty(),
    user_id: z.string().uuid(),
});

// Implementar limitación de tasa básica (rate limiting)
// Para producción, considera utilizar una solución distribuida como Redis
const rateLimitStore: {
    [key: string]: { count: number; lastRequestTime: number };
} = {};

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto en milisegundos
const MAX_REQUESTS_PER_WINDOW = 10;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerClient();

        // Parsear y validar el cuerpo de la solicitud
        const body = await request.json();
        const { code, user_id } = validatePromoCodeSchema.parse(body);

        // Implementar limitación de tasa por dirección IP
        const ip =
            request.headers.get('x-forwarded-for') || request.ip || 'unknown';
        const currentTime = Date.now();

        if (!rateLimitStore[ip]) {
            rateLimitStore[ip] = { count: 1, lastRequestTime: currentTime };
        } else {
            const timePassed = currentTime - rateLimitStore[ip].lastRequestTime;

            if (timePassed < RATE_LIMIT_WINDOW) {
                rateLimitStore[ip].count += 1;
            } else {
                rateLimitStore[ip] = { count: 1, lastRequestTime: currentTime };
            }

            if (rateLimitStore[ip].count > MAX_REQUESTS_PER_WINDOW) {
                return NextResponse.json(
                    {
                        isValid: false,
                        message:
                            'Demasiadas solicitudes. Por favor, inténtalo más tarde.',
                    },
                    { status: 429 },
                );
            }
        }

        // Saneamiento básico del código promocional
        const sanitizedCode = code.trim().toUpperCase();

        // Iniciar una transacción para garantizar la atomicidad si se requiere
        // Supabase aún no soporta transacciones en RPC, así que manejamos la lógica cuidadosamente
        const { data: promoCode, error: promoCodeError } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('code', sanitizedCode)
            .single();

        if (promoCodeError || !promoCode) {
            return NextResponse.json(
                { isValid: false, message: 'Código promocional inválido.' },
                { status: 400 },
            );
        }

        // Verificar si el código promocional está activo
        if (!promoCode.is_active) {
            return NextResponse.json(
                {
                    isValid: false,
                    message: 'Este código promocional no está activo.',
                },
                { status: 400 },
            );
        }

        const currentDate = new Date();

        // Verificar la validez de las fechas
        if (
            promoCode.start_date &&
            currentDate < new Date(promoCode.start_date)
        ) {
            return NextResponse.json(
                {
                    isValid: false,
                    message: 'Este código promocional aún no es válido.',
                },
                { status: 400 },
            );
        }

        if (
            promoCode.expiration_date &&
            currentDate > new Date(promoCode.expiration_date)
        ) {
            return NextResponse.json(
                {
                    isValid: false,
                    message: 'Este código promocional ha expirado.',
                },
                { status: 400 },
            );
        }

        // Verificar el límite de uso global
        if (
            promoCode.max_uses !== null &&
            promoCode.uses !== null &&
            promoCode.uses >= promoCode.max_uses
        ) {
            return NextResponse.json(
                {
                    isValid: false,
                    message:
                        'Este código promocional ha alcanzado su límite de uso.',
                },
                { status: 400 },
            );
        }

        // Verificar el límite de uso por usuario
        const { count: userUsageCount, error: userPromoCodeError } =
            await supabase
                .from('user_promo_codes')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user_id)
                .eq('promo_code_id', promoCode.id);

        if (userPromoCodeError) {
            console.error(
                'Error al obtener el uso del código promocional por el usuario:',
                userPromoCodeError,
            );
            return NextResponse.json(
                {
                    isValid: false,
                    message: 'Error al validar el uso del código promocional.',
                },
                { status: 500 },
            );
        }

        if (
            promoCode.max_usage_per_user !== null &&
            userUsageCount !== null &&
            userUsageCount >= promoCode.max_usage_per_user
        ) {
            return NextResponse.json(
                {
                    isValid: false,
                    message: 'Ya has utilizado este código promocional.',
                },
                { status: 400 },
            );
        }

        // Validaciones adicionales (por ejemplo, precio mínimo del pedido)

        // Todas las validaciones han pasado, devolver los detalles del descuento
        return NextResponse.json(
            {
                id: promoCode.id,
                isValid: true,
                discountType: promoCode.discount_type,
                discountValue: promoCode.discount_value,
                message: 'Código promocional aplicado con éxito.',
                code: promoCode.code,
                uses: promoCode.uses,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error al validar el código promocional:', error);

        // Manejo general de errores
        return NextResponse.json(
            {
                isValid: false,
                message: 'Ocurrió un error al validar el código promocional.',
            },
            { status: 500 },
        );
    }
}
