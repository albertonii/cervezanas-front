import { calculateInvoicePeriod } from '@/utils/utils';
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
            subject: `Registro mensual de ventas disponible período ${getPreviousInvoicePeriod()}`,
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
                            Registro mensual de ventas disponible
                        </div>
                        <div class="content">
                            <p>Estimado productor,</p>
                            <p>Nos complace informarte que el registro mensual de tus ventas correspondientes al mes anterior ya está disponible para su consulta en la plataforma Cervezanas.</p>
                            <p>Con esta información, podrás generar la factura de las ventas realizadas a través de nuestra plataforma. Te invitamos a crear y emitir dicha factura a través de Cervezanas para que quede registrada, y así nuestro equipo de administradores pueda realizar los pagos oportunos.</p>
                            <p>
                                <strong>¡Gracias por ser parte de Cervezanas!</strong>
                            </p>
                            <a href="https://cervezanas.beer" class="button">Acceder a Cervezanas</a>
                            <p>
                                Si tienes alguna duda, por favor contáctanos a <a href="mailto:cervezanas@socialinnolabs.org">cervezanas@socialinnolabs.org</a>
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

// Función para calcular el invoicePeriod del mes anterior
function getPreviousInvoicePeriod(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1); // Restar un mes

    const invoicePeriod = calculateInvoicePeriod(date);

    return invoicePeriod;
}
