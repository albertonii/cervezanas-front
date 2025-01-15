import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';
import { generateFileNameExtension } from '@/utils/utils';

export async function POST(request: NextRequest) {
    const data = await request.formData();

    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const reporter_id = data.get('reporter_id') as string | null;
    const file = data.get('file') as File | null;

    if (!title || !description) {
        return NextResponse.json(
            { error: 'Error: Missing required fields (title, description)' },
            { status: 400 },
        );
    }

    if (title.trim() === '' || description.trim() === '') {
        return NextResponse.json(
            { error: 'Error: title/description cannot be empty' },
            { status: 400 },
        );
    }

    // 1) Verificar que hay un usuario logueado:
    if (!reporter_id || reporter_id.trim() === '') {
        return NextResponse.json(
            {
                error: 'User must be logged in to create a report with attachments.',
            },
            { status: 401 }, // 401 Unauthorized
        );
    }

    // 2) Inicializar supabase
    const supabase = await createServerClient();

    // random file name to avoid unicode issues
    const randomTitle = Math.random().toString(36).substring(7);
    let fileUrl: string | null = null;

    if (file) {
        fileUrl = `${reporter_id}_${randomTitle}${generateFileNameExtension(
            file.name,
        )}`;
    }

    // 3) Insertar el reporte
    const { data: insertData, error: insertError } = await supabase
        .from('user_reports')
        .insert({
            title: title.trim(),
            description: description.trim(),
            file: fileUrl || '',
            reporter_id,
            is_resolved: false,
        })
        .select('id') // single() para poder hacer revert si falla
        .single();

    if (insertError) {
        console.error(`Error inserting report: ${insertError.message}`);
        return NextResponse.json(
            {
                error: `Error: ${insertError.message}. Details: ${insertError.details}`,
            },
            { status: 500 },
        );
    }

    // 4) Si no hay archivo, finalizamos con éxito en la BD, y enviamos email al admin
    if (!file) {
        // Llamar a la función para enviar email de notificación al admin
        await notifyAdminAboutReport(insertData.id, title, reporter_id);

        return NextResponse.json({ message: 'Report inserted successfully' });
    }

    // 5) Subir el archivo al bucket "reports"
    const { error: storageError } = await supabase.storage
        .from('reports')
        .upload(`/reports/${fileUrl}`, file, {
            upsert: true,
            cacheControl: '0',
        });

    // 6) Si falla la subida, revertimos la inserción
    if (storageError) {
        console.error(`Error uploading file: ${storageError.message}`);
        if (insertData && insertData.id) {
            await supabase
                .from('user_reports')
                .delete()
                .eq('id', insertData.id);
        }

        return NextResponse.json(
            { error: storageError.message },
            { status: 500 },
        );
    }

    // 7) Todo OK -> notificar al admin
    await notifyAdminAboutReport(insertData.id, title, reporter_id);

    // 8) Devolvemos la respuesta
    return NextResponse.json({ message: 'Report inserted successfully' });
}

/**
 * Envía un email al administrador notificando la creación de un nuevo reporte
 */
async function notifyAdminAboutReport(
    reportId: string,
    title: string,
    reporterId: string,
) {
    // 1) Verificar la API key
    if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not defined; cannot send admin email.');
        return;
    }

    // 2) Email del admin
    const emailTo = 'cervezanas@socialinnolabs.org';

    // 3) Construir el HTML (puedes personalizarlo al gusto)
    const htmlEmail = `
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
            }
            .header {
                background-color: #fbb123; /* Tono dorado */
                color: #fff;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: bold;
            }
            .content {
                padding: 20px;
                line-height: 1.6;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                font-size: 14px;
                color: #777;
                margin-top: 20px;
                text-align: center;
            }
            .footer p {
                margin: 5px 0;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <!-- ENCABEZADO -->
            <div class="header">
                <h1>¡Nuevo Reporte Recibido!</h1>
            </div>

            <!-- CUERPO DEL MENSAJE -->
            <div class="content">
                <p>Hola Administrador,</p>
                <p>
                Se ha creado un nuevo reporte en la plataforma Cervezanas.
                <br>
                <strong>ID del reporte:</strong> ${reportId}<br>
                <strong>Título:</strong> ${title}<br>
                <strong>Reportado por el usuario con ID:</strong> ${reporterId}
                </p>
                <p>
                Por favor, revisa este reporte en la sección de administración. 
                Gracias por mantener la plataforma en buen estado.
                </p>
                <p>
                <em>Este es un correo automático, por favor no responder.</em>
                </p>
            </div>

            <!-- PIE DE PÁGINA (Opcional) -->
            <div class="footer">
                <p>© 2025 Cervezanas. Todos los derechos reservados.</p>
            </div>
            </div>
        </body>
        </html>
        `;

    // 4) Hacer fetch a Resend
    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'info@cervezanas.beer',
                to: emailTo,
                subject: `Nuevo Reporte #${reportId}`,
                html: htmlEmail,
            }),
        });

        if (!res.ok) {
            console.warn(
                `Error sending admin email: ${res.status} - ${res.statusText}`,
            );
        }
    } catch (err) {
        console.warn('Exception sending email to admin:', err);
    }
}
