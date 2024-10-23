import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { generateUUID } from '@/lib/actions';
import { SupabaseProps } from '@/constants';
import { fileTypeToExtension } from '@/utils/utils';

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createServerClient();
        const formData = await request.formData();

        const productId = formData.get('product_id') as string;

        if (!productId) {
            return NextResponse.json(
                { message: 'Product ID is required' },
                { status: 400 },
            );
        }

        const randomUUID = await generateUUID();

        // Manejar archivos nuevos (media_files)
        const mediaFiles = formData.getAll('media_files') as File[];
        let mediaFileIndex = 0;

        for (let i = 0; i < mediaFiles.length; i++) {
            const file = mediaFiles[i];
            const isMain = formData.get(`isMain_${mediaFileIndex}`) === 'true';
            mediaFileIndex++;

            const fileExt = fileTypeToExtension(file.type);
            const fileName = `${SupabaseProps.ARTICLES}${productId}/${randomUUID}_${i}.${fileExt}`;

            // Subir archivo al almacenamiento
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, file);

            if (uploadError) {
                throw new Error(
                    `Error al subir archivo: ${uploadError.message}`,
                );
            }

            // Obtener URL pública
            const { data } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            const publicUrl = data.publicUrl;

            // Insertar en 'product_media'
            const { error: insertError } = await supabase
                .from('product_media')
                .insert({
                    product_id: productId,
                    url: publicUrl,
                    type: file.type,
                    alt_text: file.name,
                    is_primary: isMain,
                });

            if (insertError) {
                throw new Error(
                    `Error al insertar en product_media: ${insertError.message}`,
                );
            }
        }

        // Manejar actualizaciones de medios existentes (existingMedia)
        const existingMediaEntries: {
            key: string;
            value: FormDataEntryValue;
        }[] = [];
        formData.forEach((value, key) => {
            if (key.startsWith('existingMedia')) {
                existingMediaEntries.push({ key, value });
            }
        });

        // Parsear entradas de medios existentes
        const existingMediaMap: {
            [index: string]: { id: string; isMain: boolean };
        } = {};

        existingMediaEntries.forEach((entry) => {
            const match = entry.key.match(/existingMedia\[(\d+)\]\[(.+)\]/);
            if (match) {
                const index = match[1];
                const field = match[2];
                const value = entry.value as string;
                if (!existingMediaMap[index]) {
                    existingMediaMap[index] = { id: '', isMain: false };
                }
                if (field === 'id') {
                    existingMediaMap[index]['id'] = value;
                } else if (field === 'isMain') {
                    existingMediaMap[index]['isMain'] = value === 'true';
                }
            }
        });

        // Actualizar medios existentes en la base de datos
        for (const key in existingMediaMap) {
            const mediaEntry = existingMediaMap[key];
            const mediaId = mediaEntry['id'];
            const isMain = mediaEntry['isMain'];

            if (mediaId) {
                const { error: updateError } = await supabase
                    .from('product_media')
                    .update({ is_primary: isMain })
                    .eq('id', mediaId);

                if (updateError) {
                    throw new Error(
                        `Error al actualizar product_media: ${updateError.message}`,
                    );
                }
            }
        }

        // Manejar archivos para eliminar (filesToDelete)
        const filesToDeleteEntries: {
            key: string;
            value: FormDataEntryValue;
        }[] = [];
        formData.forEach((value, key) => {
            if (key.startsWith('filesToDelete')) {
                filesToDeleteEntries.push({ key, value });
            }
        });

        // Parsear archivos para eliminar
        const filesToDeleteMap: {
            [index: string]: { id: string; url: string };
        } = {};

        filesToDeleteEntries.forEach((entry) => {
            const match = entry.key.match(/filesToDelete\[(\d+)\]\[(.+)\]/);
            if (match) {
                const index = match[1];
                const field = match[2];
                const value = entry.value as string;
                if (!filesToDeleteMap[index]) {
                    filesToDeleteMap[index] = { id: '', url: '' };
                }
                if (field === 'id') {
                    filesToDeleteMap[index]['id'] = value;
                } else if (field === 'url') {
                    filesToDeleteMap[index]['url'] = value;
                }
            }
        });

        // Eliminar archivos y registros
        for (const key in filesToDeleteMap) {
            const fileEntry = filesToDeleteMap[key];
            const mediaId = fileEntry['id'];
            const url = fileEntry['url'];

            // Eliminar registro de 'product_media'
            const { error: deleteError } = await supabase
                .from('product_media')
                .delete()
                .eq('id', mediaId);

            if (deleteError) {
                throw new Error(
                    `Error al eliminar de product_media: ${deleteError.message}`,
                );
            }

            // Eliminar archivo del almacenamiento
            const filePath = url.split(
                `${SupabaseProps.STORAGE_PRODUCTS_IMG_URL}`,
            )[1];

            if (filePath) {
                const { error: storageError } = await supabase.storage
                    .from('products')
                    .remove([filePath]);

                if (storageError) {
                    throw new Error(
                        `Error al eliminar archivo del almacenamiento: ${storageError.message}`,
                    );
                }
            }
        }

        return NextResponse.json(
            { message: 'Medios actualizados correctamente' },
            { status: 200 },
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: 'Error al actualizar medios', error: err.message },
            { status: 500 },
        );
    }
}
