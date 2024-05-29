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

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: 'cervezanas@socialinnolabs.org',
            to: emailTo,
            subject: '¡Has sido aceptado como productor!',
            html: `
                <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f5f5dc; /* Un tono crema suave */
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
                                background-color: #fbb123; /* Un tono dorado */
                                color: white;
                                padding: 10px;
                                font-size: 24px;
                            }
                            .content {
                                padding: 20px;
                                line-height: 1.6;
                            }
                            .button {
                                display: inline-block;
                                padding: 10px 20px;
                                margin-top: 20px;
                                background-color: #fbb123; /* Un tono dorado */
                                color: white;
                                text-decoration: none;
                                border-radius: 5px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                ¡Bienvenido PRODUCTOR!
                            </div>
                            <div class="content">

                                <p>
                                    ¡Enhorabuena! Desde Cervezanas nos complace anunciar que desde este momento puedes usar tu cuenta de perfil como si fueras un productor
                                </p>



                                <a href="https://cervezanas.beer" class="button">Ir a Cervezanas</a>

                                <p>
                                    Si tienes alguna duda, por favor contáctanos a <a href="mailto:
                                    cervezanas@socialinnolabs.org">
                                </p>

                                <p>
                                    <strong>El equipo de Cervezanas</strong>
                                </p>
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
