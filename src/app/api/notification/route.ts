import crypto from 'crypto';
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
    // Verificar la firma
    const isValidNotification = verifyNotificationSignature(body);

    if (!isValidNotification) {
        console.error('Invalid payment notification signature');
        return NextResponse.json(
            { message: 'Invalid signature' },
            { status: 400 },
        );
    }

    // Si la firma es válida, procesar la notificación
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
            .select('id, owner_id, promo_code_id')
            .single();

        if (error || !order) {
            console.error(
                `Error in payment for order ${orderNumber} - ORDERS. Error: ${JSON.stringify(
                    error,
                )}`,
            );

            return NextResponse.json({
                message: `Order number ${orderNumber} failed with error: ${error.message}. Error Code: ${error.code}`,
            });
        }

        if (order.promo_code_id) {
            const { data: promoCodeData, error: promoCodeError } =
                await supabase
                    .from('promo_codes')
                    .select('*')
                    .eq('id', order.promo_code_id)
                    .single();
            if (promoCodeError || !promoCodeData) {
                // Manejo de errores
            } else {
                // Insertar en 'user_promo_codes'
                const { error: promoCodeUseError } = await supabase
                    .from('user_promo_codes')
                    .insert({
                        user_id: order.owner_id,
                        promo_code_id: promoCodeData.id,
                        order_id: order.id,
                    });

                // Incrementar el contador de usos
                const { error: promoCodeUpdateError } = await supabase
                    .from('promo_codes')
                    .update({ uses: promoCodeData.uses + 1 })
                    .eq('id', promoCodeData.id);

                // Manejo de errores si es necesario
            }
        }

        // // Comprobar si en user_promo_codes hay un registro con el order_id
        // const { data: userPromoCodeData, error: userPromoCodeError } =
        //     await supabase
        //         .from('user_promo_codes')
        //         .select(
        //             `
        //                 id,
        //                 promo_codes (*)
        //             `,
        //         )
        //         .eq('order_id', order.id)
        //         .single();

        // if (userPromoCodeError) {
        //     console.error(
        //         `Error in payment for order ${orderNumber} - USER PROMO CODE. Error: ${JSON.stringify(
        //             userPromoCodeError,
        //         )}`,
        //     );

        //     return NextResponse.json({
        //         message: `Order number ${orderNumber} failed with error: ${userPromoCodeError.message}. Error Code: ${userPromoCodeError.code}`,
        //     });
        // }

        // // Si es así, hay que incrementar el contador de usos del código promocional en la tabla promo_codes
        // if (userPromoCodeData) {
        //     const promoCodeId = userPromoCodeData.promo_codes?.id;
        //     const promoCodeUses = userPromoCodeData.promo_codes?.uses ?? 0;

        //     if (!promoCodeId) {
        //         console.error(
        //             `Error in payment for order ${orderNumber} - USER PROMO CODE ID. Error: Promo code id not found`,
        //         );

        //         return NextResponse.json({
        //             message: `Order number ${orderNumber} failed with error: Promo code id not found`,
        //         });
        //     }

        //     const { error: promoCodeError } = await supabase
        //         .from('promo_codes')
        //         .update({ uses: promoCodeUses + 1 })
        //         .eq('id', promoCodeId);

        //     if (promoCodeError) {
        //         console.error(
        //             `Error in payment for order ${orderNumber} - PROMO CODES. Error: ${JSON.stringify(
        //                 promoCodeError,
        //             )}`,
        //         );

        //         return NextResponse.json({
        //             message: `Order number ${orderNumber} failed with error: ${promoCodeError.message}. Error Code: ${promoCodeError.code}`,
        //         });
        //     }
        // }

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

function verifyNotificationSignature(body: any) {
    const { Ds_SignatureVersion, Ds_MerchantParameters, Ds_Signature } = body;

    // Verificar que la versión de la firma es la esperada
    if (Ds_SignatureVersion !== 'HMAC_SHA256_V1') {
        console.error('Unsupported signature version:', Ds_SignatureVersion);
        return false;
    }

    // Tu clave secreta proporcionada por Redsys (en base64)
    const merchantSecretKey = process.env.NEXT_PUBLIC_DS_SIGNATURE_SECRET ?? ''; // Asegúrate de que esta clave está en base64

    // Paso 1: Decodificar Ds_MerchantParameters de Base64
    const decodedParams = Buffer.from(Ds_MerchantParameters, 'base64').toString(
        'utf8',
    );

    // Paso 2: Parsear los parámetros a un objeto JSON
    const merchantParams = JSON.parse(decodedParams);

    // Paso 3: Obtener el Número de Pedido (Ds_Order)
    const orderNumber = merchantParams['Ds_Order'];

    // Paso 4: Generar la clave de firma (clave derivada)
    const key = Buffer.from(merchantSecretKey, 'base64');
    const orderKey = crypto
        .createHmac('sha256', key)
        .update(orderNumber, 'utf8')
        .digest();

    // Paso 5: Generar la firma HMAC SHA256
    const signature = crypto
        .createHmac('sha256', orderKey)
        .update(Ds_MerchantParameters, 'utf8')
        .digest('base64');

    // Paso 6: Reemplazar caracteres '+' y '/' por '-' y '_'
    const signatureSafe = signature.replace(/\+/g, '-').replace(/\//g, '_');

    // Paso 7: Comparar la firma generada con la firma recibida
    const isValid = signatureSafe === Ds_Signature;

    if (!isValid) {
        console.error('Invalid signature:', {
            expected: signatureSafe,
            received: Ds_Signature,
        });
    }

    return isValid;
}
