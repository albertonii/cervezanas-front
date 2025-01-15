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
            { error: `Error: Missing required fields (title, description)` },
            { status: 500 },
        );
    }

    if (title.trim() === '' || description.trim() === '') {
        return NextResponse.json(
            { error: `Error: title/description cannot be empty` },
            { status: 500 },
        );
    }

    const supabase = await createServerClient();

    // random file name to avoid unicode issues in the file storage
    const randomTitle = Math.random().toString(36).substring(7);

    const safeReporterId =
        reporter_id && reporter_id.trim() !== '' ? reporter_id : 'anonymous';

    let fileUrl: string | null = null;
    if (file) {
        fileUrl = `${safeReporterId}_${randomTitle}${generateFileNameExtension(
            file.name,
        )}`;
    }

    // 1. Insertamos el reporte y obtenemos su ID
    const { data: insertData, error: insertError } = await supabase
        .from('user_reports')
        .insert({
            title: title.trim(),
            description: description.trim(),
            file: fileUrl || '',
            reporter_id:
                reporter_id && reporter_id.trim() !== '' ? reporter_id : null,
            is_resolved: false,
        })
        .select('id') // para luego poder identificar el reporte y revertir
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

    // Si no se sube archivo, finalizamos
    if (!file) {
        return NextResponse.json({ message: 'Report inserted successfully' });
    }

    // 2. Subimos el archivo al bucket "reports"
    const fileToUpload = file as File;
    const { error: storageError } = await supabase.storage
        .from('reports')
        .upload(`/reports/${fileUrl}`, fileToUpload, {
            upsert: true,
            cacheControl: '0',
        });

    // 3. Si hay error en el storage -> revertimos la inserción
    if (storageError) {
        console.error(`Error uploading file: ${storageError.message}`);
        // Revertimos el reporte recién insertado:
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

    return NextResponse.json({ message: 'Report inserted successfully' });
}
