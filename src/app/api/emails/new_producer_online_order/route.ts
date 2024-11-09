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

        const orderItemsCount = parseInt(
            formData.get('order_items_count') as string,
        );

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
                distributor_email: formData.get(
                    `order_items[${i}][distributor_email]`,
                ) as string,
                distributor_name: formData.get(
                    `order_items[${i}][distributor_name]`,
                ) as string,
                distributor_phone: formData.get(
                    `order_items[${i}][distributor_phone]`,
                ) as string,
                distributor_id: formData.get(
                    `order_items[${i}][distributor_id]`,
                ) as string,
            };

            orderItems.push(item);
        }

        const urlOrder = `${process.env.NEXT_PUBLIC_BASE_URL}/es/checkout/view_order?order_number=${orderNumber}`;

        const res = await axios.post(
            'https://api.resend.com/emails',
            {
                from: 'info@cervezanas.beer',
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
                                        (item: {
                                            product_id: string;
                                            name: string;
                                            price: number;
                                            quantity: number;
                                            distributor_email: string;
                                            distributor_name: string;
                                            distributor_phone: string;
                                            distributor_id: string;
                                        }) => `
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
                                            <strong>Distribuidor asociado:</strong>
                                            <br>

                                            Nombre: 
                                            <a href="${
                                                process.env.NEXT_PUBLIC_BASE_URL
                                            }/es/user-info/${
                                            item.distributor_id
                                        }" 
                                                target="_blank" 
                                                style="color: #fbb123; text-decoration: none;"
                                                onmouseover="this.style.textDecoration='underline';"
                                                onmouseout="this.style.textDecoration='none';"
                                            >
                                                ${item.distributor_name}
                                            </a>
                                            <br>
                                            Email: 
                                            <a href="mailto:${
                                                item.distributor_email
                                            }" style="color: #fbb123; text-decoration: none;" 
                                                onmouseover="this.style.textDecoration='underline';" 
                                                onmouseout="this.style.textDecoration='none';">
                                                ${item.distributor_email}
                                            </a>
                                            <br>
                                            Teléfono: ${item.distributor_phone}
                                        </div>
                                    `,
                                    )
                                    .join('')}
                            </div>

                            <div class="total-summary">
                                <div>Subtotal: ${subtotalPrice}€</div>
                                <div>Envío: ${shippingPrice}€</div>
                                <div class="total">Total: ${totalPrice}€</div>
                            </div>

                            <a href="${urlOrder}" class="button">Ver pedido completo</a>

                            <p>Si tienes alguna duda, no dudes en contactarnos en <a href="mailto:info@cervezanas.beer">info@cervezanas.beer</a>.</p>
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

        // Devuelve la respuesta de éxito
        return NextResponse.json(res.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: 'Error processing the request',
            status: 500,
        });
    }
}
