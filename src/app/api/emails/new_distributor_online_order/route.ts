import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // Verifica que la clave API esté configurada
    if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
        return NextResponse.json({
            message: 'RESEND_API_KEY is not defined',
            status: 500,
        });
    }

    try {
        const formData = await request.formData();
        const emailTo = formData.get('email_to') as string;
        const shippingPrice = formData.get('shipping_price') as string;
        const totalPrice = formData.get('total_price') as string;
        const subtotalPrice = formData.get('subtotal_price') as string;
        const orderNumber = formData.get('order_number') as string;
        const shippingName = formData.get('shipping_name') as string;
        const shippingLastname = formData.get('shipping_lastname') as string;
        const shippingDocumentId = formData.get(
            'shipping_document_id',
        ) as string;
        const shippingAddress = formData.get('shipping_address') as string;
        const shippingAddressExtra = formData.get(
            'shipping_address_extra',
        ) as string;
        const shippingCity = formData.get('shipping_city') as string;
        const shippingSubRegion = formData.get('shipping_sub_region') as string;
        const shippingRegion = formData.get('shipping_region') as string;
        const shippingCountry = formData.get('shipping_country') as string;
        const shippingPostalCode = formData.get(
            'shipping_postal_code',
        ) as string;
        const shippingPhone = formData.get('shipping_phone') as string;

        const orderItemsCount = parseInt(
            formData.get('order_items_count') as string,
        );

        // Verificar si los valores críticos son nulos o indefinidos
        if (!emailTo || !orderNumber || isNaN(orderItemsCount)) {
            return NextResponse.json({
                message: 'Invalid data provided',
                status: 400,
            });
        }

        let orderItems = [];

        for (let i = 0; i < orderItemsCount; i++) {
            const item = {
                product_id: formData.get(
                    `order_items[${i}][product_id]`,
                ) as string,
                name: formData.get(`order_items[${i}][name]`) as string,
                price: parseFloat(
                    formData.get(`order_items[${i}][price]`) as string,
                ),
                quantity: parseInt(
                    formData.get(`order_items[${i}][quantity]`) as string,
                ),
                producer_email: formData.get(
                    `order_items[${i}][producer_email]`,
                ) as string,
                producer_name: formData.get(
                    `order_items[${i}][producer_name]`,
                ) as string,
                producer_phone: formData.get(
                    `order_items[${i}][producer_phone]`,
                ) as string,
                producer_id: formData.get(
                    `order_items[${i}][producer_id]`,
                ) as string,
            };

            if (
                !item.product_id ||
                !item.name ||
                isNaN(item.price) ||
                isNaN(item.quantity)
            ) {
                return NextResponse.json({
                    message: `Invalid order item data for item ${i}`,
                    status: 400,
                });
            }

            orderItems.push(item);
        }

        const urlOrder = `${process.env.NEXT_PUBLIC_BASE_URL}/es/checkout/view_order?order_number=${orderNumber}`;

        const res = await axios.post(
            'https://api.resend.com/emails',
            {
                from: 'cervezanas@socialinnolabs.org',
                to: emailTo,
                subject: `Nuevo pedido recibido #${orderNumber}`,
                html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Nuevo pedido recibido</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5dc;
                            color: #333;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 20px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #fbb123;
                            color: white;
                            text-align: center;
                            padding: 15px;
                            font-size: 24px;
                            font-weight: bold;
                        }
                        .content {
                            text-align: left;
                            padding: 20px;
                        }
                        .order-summary {
                            margin: 20px 0;
                        }
                        .order-item {
                            border-bottom: 1px solid #eee;
                            padding: 10px 0;
                        }
                        .order-item:last-child {
                            border-bottom: none;
                        }
                        .total-summary {
                            margin-top: 20px;
                            text-align: right;
                        }
                        .total-summary div {
                            margin-bottom: 5px;
                        }
                        .total {
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #fbb123;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            text-align: center;
                            margin-top: 20px;
                            display: block;
                        }
                        a {
                            color: #fbb123;
                            text-decoration: none;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            ¡Nuevo pedido recibido #${orderNumber}!
                        </div>
                        <div class="content">
                            <p>Hola,</p>
                            <p>Se ha generado un nuevo pedido para tu producto. A continuación tienes los detalles del pedido:</p>
    
                            <div class="order-summary">
                                <h3>Resumen del pedido:</h3>
                                ${orderItems
                                    .map(
                                        (item) => `
                                        <div class="order-item">
                                            <strong>${item.name}</strong> x${
                                            item.quantity
                                        } - ${item.price.toFixed(2)}€
                                            <br>
                                            <a href="${
                                                process.env.NEXT_PUBLIC_BASE_URL
                                            }/products/${
                                            item.product_id
                                        }" target="_blank" style="color: #fbb123; text-decoration: none;">
                                                Ver producto
                                            </a>
                                            <br>
                                            <strong>Productor asociado:</strong>
                                            <br>
                                            Nombre: 
                                            <a href="${
                                                process.env.NEXT_PUBLIC_BASE_URL
                                            }/es/user-info/${item.producer_id}" 
                                                target="_blank" 
                                                style="color: #fbb123; text-decoration: none;"
                                                onmouseover="this.style.textDecoration='underline';"
                                                onmouseout="this.style.textDecoration='none';"
                                            >
                                                ${item.producer_name}
                                            </a>
                                            <br>
                                            Email: 
                                            <a href="mailto:${
                                                item.producer_email
                                            }" style="color: #fbb123; text-decoration: none;" 
                                                onmouseover="this.style.textDecoration='underline';" 
                                                onmouseout="this.style.textDecoration='none';">
                                                ${item.producer_email}
                                            </a>
                                            <br>
                                            Teléfono: ${item.producer_phone}
                                        </div>
                                    `,
                                    )
                                    .join('')}
                            </div> 
    
                            <div class="shipping-info">
                                <h3>Información de envío:</h3>
                                <p><strong>Nombre:</strong> ${shippingName} ${shippingLastname}</p>
                                <p><strong>Documento de identidad:</strong> ${shippingDocumentId}</p>
                                <p><strong>Dirección:</strong> ${shippingAddress} ${shippingAddressExtra}</p>
                                <p><strong>Ciudad:</strong> ${shippingCity}, ${shippingSubRegion}, ${shippingRegion}, ${shippingCountry}</p>
                                <p><strong>Código postal:</strong> ${shippingPostalCode}</p>
                                <p><strong>Teléfono:</strong> ${shippingPhone}</p>
                            </div>
    
                            <div class="total-summary">
                                <div>Subtotal: ${subtotalPrice}€</div>
                                <div>Envío: ${shippingPrice}€</div>
                                <div class="total">Total: ${totalPrice}€</div>
                            </div>
    
                            <a href="${urlOrder}" class="button">Ver pedido completo</a>
    
                            <p>Si tienes alguna duda, no dudes en contactarnos en <a href="mailto:cervezanas@socialinnolabs.org">cervezanas@socialinnolabs.org</a>.</p>
                            <p><strong>¡Gracias por ser parte de Cervezanas!</strong></p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
                },
            },
        );

        return NextResponse.json(res.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: 'Error processing the request',
            status: 500,
        });
    }
}
