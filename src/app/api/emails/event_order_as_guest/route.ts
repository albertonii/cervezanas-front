// app/api/send_email/route.ts

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
        const requestBody = await request.json();

        const {
            email_to,
            total_price,
            subtotal_price,
            order_number,
            order_items,
            url_order,
            event_name,
        } = requestBody;

        // Validar campos requeridos
        if (
            !email_to ||
            !total_price ||
            !subtotal_price ||
            !order_number ||
            !order_items ||
            !url_order ||
            !event_name
        ) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 },
            );
        }

        // Construir el HTML del correo electrónico
        const orderItemsHTML = order_items
            .map(
                (item: {
                    product_id: string;
                    product_name: string;
                    pack_name: string;
                    price: string;
                    quantity: number;
                    product_url: string;
                }) => `
                    <div class="order-item">
                        <strong>${item.product_name} - ${item.pack_name}</strong> x${item.quantity} - ${item.price}€
                        <br>
                        <a href="${item.product_url}" target="_blank">Ver producto</a>
                    </div>
                `,
            )
            .join('');

        const emailHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Pedido</title>
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
                    width: fit-content;
                    font-weight: bold;
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
                    <p>Hemos recibido tu pedido <strong>#${order_number}</strong> y estamos trabajando en procesarlo. Aquí tienes un resumen de tu compra:</p>

                    <div class="order-summary">
                        ${orderItemsHTML}
                    </div>

                    <div class="total-summary">
                        <div>Subtotal: ${subtotal_price}€</div>
                        <div class="total">Total: ${total_price}€</div>
                    </div>

                    <a href="${url_order}" class="button">Ver mi pedido</a>
                    
                    <p>Si tienes alguna duda, no dudes en contactarnos en <a href="mailto:info@cervezanas.beer">info@cervezanas.beer</a>.</p>
                    <p><strong>¡Gracias por comprar en Cervezanas!</strong></p>
                </div>
            </div>
        </body>
        </html>
        `;

        const res = await axios.post(
            'https://api.resend.com/emails',
            {
                from: 'info@cervezanas.beer',
                to: email_to,
                subject: `Confirmación de tu pedido #${order_number}`,
                html: emailHTML,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
                },
            },
        );

        // Devuelve la respuesta del servidor
        return NextResponse.json(res.data);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            message: 'Error processing the request',
            status: 500,
        });
    }
}
