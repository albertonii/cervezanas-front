import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';
import { generateFileNameExtension } from '@/utils/utils';

export async function POST(request: NextRequest) {
    const data = await request.formData();

    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const reporter_id = data.get('reporter_id') as string | null; // Usuario logueado
    const file = data.get('file') as File | null;

    // 1) Validar campos básicos
    if (!title || !description) {
        return NextResponse.json(
            { error: `Error: Missing required fields (title, description)` },
            { status: 400 }, // 400 (Bad Request)
        );
    }

    if (title.trim() === '' || description.trim() === '') {
        return NextResponse.json(
            { error: `Error: title/description cannot be empty` },
            { status: 400 },
        );
    }

    // 2) Validar que se ha proporcionado un ID de usuario válido
    if (!reporter_id || reporter_id.trim() === '') {
        return NextResponse.json(
            {
                error: 'User must be logged in to create a report with attachments.',
            },
            { status: 401 }, // 401 (Unauthorized)
        );
    }

    // 3) Inicializar supabase en modo server
    const supabase = await createServerClient();

    // random file name to avoid unicode issues in the file storage
    const randomTitle = Math.random().toString(36).substring(7);
    let fileUrl: string | null = null;

    if (file) {
        fileUrl = `${reporter_id}_${randomTitle}${generateFileNameExtension(
            file.name,
        )}`;
    }

    // 4) Insertar el reporte en la tabla "user_reports"
    const { data: insertData, error: insertError } = await supabase
        .from('user_reports')
        .insert({
            title: title.trim(),
            description: description.trim(),
            file: fileUrl || '',
            reporter_id,
            is_resolved: false,
        })
        .select('id') // para poder revertir en caso de fallo de storage
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

    // 5) Si no se sube archivo, finalizamos
    if (!file) {
        return NextResponse.json({ message: 'Report inserted successfully' });
    }

    // 6) Subimos el archivo al bucket "reports"
    const { error: storageError } = await supabase.storage
        .from('reports')
        .upload(`/reports/${fileUrl}`, file, {
            upsert: true,
            cacheControl: '0',
        });

    // 7) Si hay error en storage => revertimos la inserción
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

    // 8) Éxito
    return NextResponse.json({ message: 'Report inserted successfully' });
}
