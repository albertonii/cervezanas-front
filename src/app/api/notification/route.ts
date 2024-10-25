import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { APP_URLS, ONLINE_ORDER_STATUS } from '@/constants';
import { isResponseCodeOk, ResponseJSONSuccess } from 'redsys-easy';
import { processRestNotification } from '../../[locale]/components/TPV/redsysClient';

/**
 * Handles POST requests to receive payment status updates from Redsys.
 * Utilizes the notification URL to receive updates on payment statuses directly from Redsys,
 * regardless of user actions in the browser.
 *
 * @param {NextRequest} req - The incoming request object containing form data from Redsys.
 * @returns {Promise<NextResponse>} - A JSON response indicating the result of the payment processing.
 *
 * The function performs the following steps:
 * 1. Extracts the signature version, merchant parameters, and signature from the request form data.
 * 2. Constructs a `ResponseJSONSuccess` object with the extracted data.
 * 3. Processes the notification using `processRestNotification`.
 * 4. Checks the response code to determine if the payment was successful.
 * 5. If the payment is successful:
 *    - Updates the order status to `PAID` in the database.
 *    - Sends a notification to the producer associated with the order.
 * 6. If the payment fails:
 *    - Updates the order status to `CANCELLED` in the database.
 * 7. Returns a JSON response indicating the result of the payment processing.
 *
 * @see https://pagosonline.redsys.es/codigosRespuesta.html#codigo-dsresponse for response code details.
 */
export async function POST(req: NextRequest) {
    const data = await req.formData();
    const signatureVersion = data.get('Ds_SignatureVersion');
    const merchantParameters = data.get('Ds_MerchantParameters');
    const signature = data.get('Ds_Signature');

    const body: ResponseJSONSuccess = {
        Ds_Signature: signature as string,
        Ds_SignatureVersion: signatureVersion as string,
        Ds_MerchantParameters: merchantParameters as string,
    };

    const restNotification = processRestNotification(body);

    /**
     * Tabla Ds_Response CODE
     * https://pagosonline.redsys.es/codigosRespuesta.html#codigo-dsresponse
     * 0000 a 0099 -Transacción autorizada para pagos y preautorizaciones
     * 0900 Transacción autorizada para devoluciones y confirmaciones
     * 0400 Transacción autorizada para anulaciones
     * 0101 Tarjeta caducada
     * 0102 Tarjeta en excepción transitoria o bajo sospecha de fraude
     * 0106 Intentos de PIN excedidos
     * 0125 Tarjeta no efectiva
     * 0129 Código de seguridad (CVV2/CVC2) incorrecto
     * 172 Denegada, no repetir
     */

    const responseCode = restNotification.Ds_Response;

    const orderNumber = restNotification.Ds_Order;

    const supabase = await createServerClient();

    if (isResponseCodeOk(responseCode)) {
        // Update order status
        const { data: order, error } = await supabase
            .from('orders')
            .update({ status: ONLINE_ORDER_STATUS.PAID })
            .eq('order_number', orderNumber)
            .select(
                `
                id,
                owner_id
            `,
            )
            .single();

        if (error) {
            console.error(
                `Error in payment for order ${orderNumber}. Error: ${JSON.stringify(
                    error,
                )}`,
            );

            return NextResponse.json({
                message: `Order number ${orderNumber} failed with error: ${error.message}. Error Code: ${error.code}`,
            });
        }

        // Comprobar si en user_promo_codes hay un registro con el order_id
        const { data: userPromoCodeData, error: userPromoCodeError } =
            await supabase
                .from('user_promo_codes')
                .select(
                    `
                    id,
                    promo_codes (*)
                `,
                )
                .eq('order_id', order.id)
                .single();

        if (userPromoCodeError) {
            console.error(
                `Error in payment for order ${orderNumber}. Error: ${JSON.stringify(
                    userPromoCodeError,
                )}`,
            );

            return NextResponse.json({
                message: `Order number ${orderNumber} failed with error: ${userPromoCodeError.message}. Error Code: ${userPromoCodeError.code}`,
            });
        }

        // Si es así, hay que incrementar el contador de usos del código promocional en la table promo_codes
        if (userPromoCodeData) {
            const promoCodeId = userPromoCodeData.promo_codes?.id;
            const promoCodeUses = userPromoCodeData.promo_codes?.uses ?? 0;

            if (!promoCodeId) {
                console.error(
                    `Error in payment for order ${orderNumber}. Error: Promo code id not found`,
                );

                return NextResponse.json({
                    message: `Order number ${orderNumber} failed with error: Promo code id not found`,
                });
            }

            const { error: promoCodeError } = await supabase
                .from('promo_codes')
                .update({ uses: promoCodeUses + 1 })
                .eq('id', promoCodeId);

            if (promoCodeError) {
                console.error(
                    `Error in payment for order ${orderNumber} - PROMO CODES. Error: ${JSON.stringify(
                        promoCodeError,
                    )}`,
                );

                return NextResponse.json({
                    message: `Order number ${orderNumber} failed with error: ${promoCodeError.message}. Error Code: ${promoCodeError.code}`,
                });
            }
        }

        // Send notification to producer associated

        // Notificación enviada al productor de que el pedido se ha generado con éxito
        const producerMessage = `Se ha generado con éxito un nuevo pedido con número de pedido: ${orderNumber}. Puedes verlo en la sección de pedidos.`;

        const { error: errorProducerNotification } = await supabase
            .from('notifications')
            .insert({
                source: process.env.NEXT_PUBLIC_ADMIN_ID,
                user_id: order.owner_id,
                message: producerMessage,
                link: APP_URLS.PRODUCER_ONLINE_ORDER,
                read: false,
            });

        if (errorProducerNotification) {
            console.error(
                `Error in payment for order ${orderNumber} - NOTIFICATIONS. Error: ${JSON.stringify(
                    errorProducerNotification,
                )}`,
            );
        }

        // Send notification to distributor associated
        return NextResponse.json({
            message: `Order number ${orderNumber} updated successfully`,
        });
    } else {
        console.info(`Payment for order ${orderNumber} failed`);

        // Update order status
        const { error } = await supabase
            .from('orders')
            .update({ status: ONLINE_ORDER_STATUS.CANCELLED })
            .eq('order_number', orderNumber);

        if (error) {
            console.error(error);

            return NextResponse.json({
                message: `Order number ${orderNumber} failed with error: ${error.message}. Error Code: ${error.code}`,
            });
        }

        return NextResponse.json({
            message: `Order number ${orderNumber} failed. Error Code: ${responseCode}`,
        });
    }
}
