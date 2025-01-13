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
            from: 'info@cervezanas.beer',
            to: emailTo,
            subject: 'Solicitud de Cuenta de Productor',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5dc; /* Tono crema */
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  background-color: #fff;
                  width: 80%;
                  max-width: 600px;
                  margin: 30px auto;
                  padding: 20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  text-align: center;
                }
                .header {
                  background-color: #fbb123; /* Tono dorado */
                  color: #fff;
                  padding: 20px;
                }
                .header h1 {
                  margin: 0;
                  font-size: 24px;
                  font-weight: bold;
                }
                .content {
                  padding: 20px;
                  text-align: left;
                  line-height: 1.6;
                }
                .content p {
                  margin-bottom: 15px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  margin: 25px 0;
                  background-color: #fbb123; /* Tono dorado */
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                }
                .button:hover {
                  background-color: #dda014;
                }
                .footer {
                  font-size: 14px;
                  color: #777;
                  margin-top: 20px;
                }
                .footer p {
                  margin: 5px 0;
                }
                .footer a {
                  color: #777;
                  text-decoration: none;
                }
                .footer a:hover {
                  text-decoration: underline;
                }
                @media only screen and (max-width: 600px) {
                  .container {
                    width: 95% !important;
                    margin: 20px auto;
                    padding: 10px;
                  }
                  .header h1 {
                    font-size: 20px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <!-- ENCABEZADO -->
                <div class="header">
                  <h1>¡Solicitud Recibida!</h1>
                </div>
    
                <!-- CUERPO DEL MENSAJE -->
                <div class="content">
                  <p>Hola,</p>
                  <p>
                    ¡Gracias por registrarte en <strong>Cervezanas</strong> como 
                    <strong>Productor</strong>! Hemos recibido tu solicitud y nuestro equipo de moderación 
                    la revisará pronto.
                  </p>
                  <p>
                    Una vez aprobemos tu cuenta, tendrás acceso a nuestras 
                    funcionalidades diseñadas especialmente para productores: 
                    exhibir tu catálogo cervecero, conectarte con 
                    distribuidores, y llevar tus productos a una gran comunidad 
                    amante de la cerveza.
                  </p>
                  <p>
                    Mientras esperas la confirmación, te invitamos a conocer más 
                    sobre nuestra plataforma y la comunidad cervecera que nos 
                    respalda. ¡Estamos encantados de sumar tu marca al 
                    ecosistema Cervezanas!
                  </p>
                  <p style="text-align: center;">
                    <a href="https://cervezanas.beer" class="button">Visitar Cervezanas</a>
                  </p>
    
                  <p>
                    Si tienes alguna duda, contáctanos en 
                    <a href="mailto:info@cervezanas.beer">info@cervezanas.beer</a>. 
                  </p>
                  <p>
                    <strong>¡Gracias por ser parte de Cervezanas!</strong><br>
                    El equipo de Cervezanas
                  </p>
                </div>
    
                <!-- PIE DE PÁGINA (Opcional) -->
                <div class="footer">
                  <p>© 2025 Cervezanas. Todos los derechos reservados.</p>
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
