import createServerClient from '@/utils/supabaseServer';
import { ONLINE_ORDER_STATUS } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles GET requests to cancel expired orders.
 *
 * This route is intended to be called from the EDGE of Vercel as a CRON JOB.
 * It verifies the authorization token and cancels orders that have exceeded the expiration time.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object containing the result of the operation.
 *
 * Environment Variables:
 * - `NEXT_PUBLIC_CRON_JOB_TOKEN`: The token used to authorize the CRON JOB request.
 * - `NEXT_PUBLIC_ORDER_EXPIRATION_TIME`: The time in minutes after which an order is considered expired. Defaults to 30 minutes if not set.
 *
 * The function performs the following steps:
 * 1. Extracts and verifies the authorization token from the request headers.
 * 2. Creates a Supabase client instance.
 * 3. Calculates the expiration date and time based on the current time and the expiration time from the environment variable.
 * 4. Updates the status of orders that are pending and have a creation date earlier than the calculated expiration date.
 * 5. Returns a JSON response with the number of cancelled orders or an error message if the operation fails.
 *
 * Possible Responses:
 * - 401 Unauthorized: If the authorization token is missing or invalid.
 * - 500 Internal Server Error: If there is an error cancelling the expired orders or an unexpected error occurs.
 * - 200 OK: If the operation is successful, returns the number of cancelled orders.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    const authHeader = request.headers.get('authorization');
    const authHeaderWithoutBearer = authHeader?.replace('Bearer ', '');

    const CRON_JOB_TOKEN = process.env.CRON_SECRET;

    console.log('AUTH HEADER', authHeader);
    console.log('AUTH HEADER No bearer', authHeaderWithoutBearer);
    console.log('CRON JOB TOKEN', process.env.CRON_SECRET);

    if (
        !authHeaderWithoutBearer ||
        authHeaderWithoutBearer !== CRON_JOB_TOKEN
    ) {
        console.info('Unauthorized Token: ', authHeaderWithoutBearer);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = await createServerClient();

        // Definir el tiempo de expiración en minutos
        const expirationTime = parseInt(
            process.env.NEXT_PUBLIC_ORDER_EXPIRATION_TIME || '30',
            10,
        );

        // Calcular la fecha y hora límite
        const currentTime = new Date();
        const expirationDate = new Date(
            currentTime.getTime() - expirationTime * 60000,
        );

        // Formatear la fecha para comparar con 'created_at' en la base de datos
        const expirationDateISOString = expirationDate.toISOString();

        // Actualizar órdenes pendientes que han excedido el tiempo de expiración
        const { data, error } = await supabase
            .from('orders')
            .update({ status: ONLINE_ORDER_STATUS.CANCELLED_BY_EXPIRATION })
            .eq('status', ONLINE_ORDER_STATUS.PENDING)
            .lt('created_at', expirationDateISOString)
            .select('id');

        if (error) {
            console.error('Error cancelling expired orders:', error);
            return NextResponse.json(
                { error: 'Error cancelling expired orders' },
                { status: 500 },
            );
        }

        const cancelledOrdersCount = data.length;

        console.info(`Cancelled ${cancelledOrdersCount} expired orders.`);

        return NextResponse.json(
            {
                message: `Cancelled ${cancelledOrdersCount} expired orders.`,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Unexpected error' },
            { status: 500 },
        );
    }
}
