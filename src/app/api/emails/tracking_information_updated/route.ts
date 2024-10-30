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

    const username = formData.get('username') as string;
    const emailTo = formData.get('email-to') as string;
    const tracking_id = formData.get('tracking_id') as string;
    const shipment_company = formData.get('shipment_company') as string;
    const shipment_url = formData.get('shipment_url') as string;
    const estimated_date = formData.get('estimated_date') as string;

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: 'info@cervezanas.beer',
            to: emailTo,
            subject: 'Actualización de envío: Tu pedido está en camino',
            html: `
                <!DOCTYPE html>
                    <html>
                        <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f5f5f5;
                                color: #333;
                                text-align: center;
                                padding: 20px;
                            }
                            .container {
                                background-color: #fff;
                                width: 80%;
                                margin: auto;
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
                                padding: 20px;
                                line-height: 1.6;
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
                            .info {
                                margin: 20px 0;
                                text-align: left;
                            }
                            .info p {
                                margin: 5px 0;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                ¡Hola, ${username}!
                            </div>
                            <div class="content">
                                <p>Queremos informarte que la información de envío de tu pedido ha sido actualizada.</p>
                                <div class="info">
                                    <p><strong>Compañía de envío:</strong> ${shipment_company}</p>
                                    <p><strong>Número de seguimiento:</strong> ${tracking_id}</p>
                                    <p><strong>Fecha estimada de entrega:</strong> ${estimated_date}</p>
                                </div>

                                <p>Puedes hacer seguimiento de tu envío utilizando el siguiente enlace:</p>
                                <a href="${shipment_url}" class="button">Seguir mi pedido</a>

                                <p>Además, puedes acceder a la información completa de tu pedido accediendo con tu cuenta Cervezanas</p>
                                <a href="https://cervezanas.beer/" class="button">Ir a Cervezanas</a>

                                <p>Gracias por confiar en nosotros.</p>
                                <p>Si tienes alguna pregunta, no dudes en <a href="mailto:info@cervezanas.beer">contactarnos</a>.</p>
                                <p><strong>El equipo de Cervezanas</strong></p>
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
