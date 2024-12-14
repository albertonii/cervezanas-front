import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // Verifica que la clave API esté configurada
    if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
        return NextResponse.json(
            {
                message: 'RESEND_API_KEY is not defined',
                status: 500,
            },
            { status: 500 },
        );
    }

    try {
        const requestBody = await request.json();

        const {
            email_to,
            order_number,
            cp_name,
            event_name,
            stand_location,
            products,
        } = requestBody;

        // Validar campos requeridos
        if (
            !email_to ||
            !order_number ||
            !event_name ||
            !cp_name ||
            !stand_location ||
            !products ||
            !Array.isArray(products) ||
            products.length === 0
        ) {
            return NextResponse.json(
                {
                    message:
                        'Missing required fields or invalid products format',
                },
                { status: 400 },
            );
        }

        // Construir el HTML del correo electrónico
        const productsHTML = products
            .map(
                (product: {
                    product_name: string;
                    pack_name: string;
                    quantity: number;
                    price: string;
                    product_url: string;
                }) => `
                    <div class="product-item">
                        <strong>${product.product_name} - ${product.pack_name}</strong> x${product.quantity} - ${product.price}€
                        <br>
                        <a href="${product.product_url}" target="_blank">Ver producto</a>
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
            <title>Pedido Completado</title>
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
            .product-summary {
                margin: 20px 0;
            }
            .product-item {
                border-bottom: 1px solid #eee;
                padding: 10px 0;
            }
            .product-item:last-child {
                border-bottom: none;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #666;
            }
            a.button {
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
            a.button:hover {
                background-color: #e09b0f;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
                ¡Tu pedido ha sido completado!
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>Nos complace informarte que tu pedido <strong>#${order_number}</strong> en el Punto de Consumo <strong>${stand_location}</strong> ha sido completado y está listo para ser recogido.</p>
                <p><strong>Evento:</strong> ${event_name}</p>
                <p><strong>Punto de Consumo:</strong> ${cp_name}</p>
        
                <div class="product-summary">
                <h3>Productos:</h3>
                ${productsHTML}
                </div>
        
                <a href="https://www.cervezanas.beer/es/checkout/event/success/in_site_payment?order_number=${order_number}" class="button">Ver Detalles del Pedido</a>
                
                <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos en <a href="mailto:info@cervezanas.beer">info@cervezanas.beer</a>.</p>
                <p>¡Gracias por elegir Cervezanas!</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Cervezanas. Todos los derechos reservados.
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
                subject: `Tu pedido #${order_number} está listo para ser recogido`,
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
        return NextResponse.json(res.data, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            {
                message: 'Error processing the request',
                status: 500,
            },
            { status: 500 },
        );
    }
}
