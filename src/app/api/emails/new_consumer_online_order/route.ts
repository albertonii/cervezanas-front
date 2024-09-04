import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // Verifica que la clave API esté configurada
    if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
        return NextResponse.json({
            message: 'RESEND_API_KEY is not defined',
            status: 500,
        });
    }

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
            product_id: formData.get(`order_items[${i}][product_id]`) as string,
            name: formData.get(`order_items[${i}][name]`) as string,
            price: parseFloat(
                formData.get(`order_items[${i}][price]`) as string,
            ),
            quantity: parseInt(
                formData.get(`order_items[${i}][quantity]`) as string,
            ),
        };

        orderItems.push(item);
    }

    const urlOrder = `${process.env.NEXT_PUBLIC_BASE_URL}/es/checkout/view_order?order_number=${orderNumber}`;

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: 'cervezanas@socialinnolabs.org',
            to: emailTo,
            subject: `Confirmación de tu pedido #${orderNumber}`,
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmación de pedido</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5dc; /* Tono crema */
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
                            background-color: #fbb123; /* Tono dorado */
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
                            ¡Gracias por tu pedido en Cervezanas!
                        </div>
                        <div class="content">
                            <p>Hola,</p>
                            <p>Hemos recibido tu pedido <strong>#${orderNumber}</strong> y estamos trabajando en procesarlo. Aquí tienes un resumen de tu compra:</p>

                            <div class="order-summary">
                                ${orderItems
                                    .map(
                                        (item: {
                                            product_id: string;
                                            name: string;
                                            price: number;
                                            quantity: number;
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
                                        }" target="_blank">Ver producto</a>
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

                            <a href="${urlOrder}" class="button">Ver mi pedido</a>
                            
                            <p>Si tienes alguna duda, no dudes en contactarnos en <a href="mailto:cervezanas@socialinnolabs.org">cervezanas@socialinnolabs.org</a>.</p>
                            <p><strong>¡Gracias por comprar en Cervezanas!</strong></p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error sending email: ${res.statusText}`);
    }

    const data = await res.json();

    return NextResponse.json(data);
}
