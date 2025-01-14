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

    const { error } = await supabase.from('user_reports').insert({
        title: title.trim(),
        description: description.trim(),
        file: fileUrl || '',
        reporter_id:
            reporter_id && reporter_id.trim() !== '' ? reporter_id : null,
        is_resolved: false,
    });

    if (error) {
        console.error(`Error inserting report: ${error.message}`);
        return NextResponse.json(
            { error: `Error: ${error.message}. Details: ${error.details}` },
            { status: 500 },
        );
    }

    if (!file)
        // Si no hay archivo, finalizamos

        return NextResponse.json({ message: 'Report inserted successfully' });

    // De lo contrario, subimos el archivo
    const fileToUpload = file as File;

    const { error: storageError } = await supabase.storage
        .from('reports')
        .upload(`/reports/${fileUrl}`, fileToUpload, {
            upsert: true,
            cacheControl: '0',
        })
        .catch((err: Error) => {
            console.error(err);
            throw storageError;
        });

    if (storageError) {
        console.error(`Error uploading file: ${storageError.message}`);

        return NextResponse.json(
            { error: storageError.message },
            { status: 500 },
        );
    }

    return NextResponse.json({ message: 'Report inserted successfully' });
}
