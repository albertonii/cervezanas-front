import readUserSession, { generateUUID } from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import { Type } from '@/lib//productEnum';
import { SupabaseProps } from '@/constants';
import { fileTypeToExtension } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const randomUUID = await generateUUID();

        const formData = await request.formData();

        // Aquí obtienes todos los archivos que se hayan subido bajo la clave 'media_file'
        const mediaFiles = formData.getAll('media_files') as File[];

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const is_public = (formData.get('is_public') as string) === 'true';
        const is_available =
            (formData.get('is_available') as string) === 'true';
        const is_for_event =
            (formData.get('is_for_event') as string) === 'true';
        const price = parseFloat(formData.get('price') as string);
        const weight = parseFloat(formData.get('weight') as string);
        const slots_per_box = parseFloat(
            formData.get('slots_per_box') as string,
        );

        const supabase = await createServerClient();
        const session = await readUserSession();
        const userId = session?.id;

        const { data: product, error: errorProduct } = await supabase
            .from('products')
            .insert({
                name,
                description,
                is_public,
                is_available,
                is_for_event,
                category: Type.BOX_PACK,
                type: Type.BOX_PACK,
                owner_id: userId,
                price: price,
                weight: weight,
            })
            .select('id')
            .single();

        if (errorProduct) {
            return NextResponse.json(
                { message: 'Error creating box product' },
                { status: 500 },
            );
        }

        // Create box pack
        if (product) {
            const { data: boxPack, error: errorBoxPack } = await supabase
                .from('box_packs')
                .insert({
                    product_id: product.id,
                    slots_per_box: slots_per_box,
                })
                .select('id')
                .single();

            if (errorBoxPack) {
                return NextResponse.json(
                    { message: 'Error creating box pack' },
                    { status: 500 },
                );
            }

            if (boxPack) {
                const boxPackItems: {
                    quantity: number;
                    slots_per_product: number;
                    product_id: string;
                }[] = JSON.parse(formData.get('box_packs') as string);

                boxPackItems.map(async (boxItem) => {
                    const { error: errorBoxPackSlots } = await supabase
                        .from('box_pack_items')
                        .insert({
                            quantity: boxItem.quantity,
                            slots_per_product: boxItem.slots_per_product,
                            product_id: boxItem.product_id,
                            box_pack_id: boxPack.id,
                        });

                    if (errorBoxPackSlots) {
                        return NextResponse.json(
                            { message: 'Error creating box pack slots' },
                            { status: 500 },
                        );
                    }
                });
            }

            // Media Files
            for (let index = 0; index < mediaFiles.length; index++) {
                const file = mediaFiles[index];

                // Obtener el campo 'isMain' correspondiente
                const isMain = formData.get(`isMain_${index}`) === 'true';

                // Si necesitas subir el archivo a Supabase, podrías hacer algo como esto:
                // const fileExt = file.name.split('.').pop();
                const fileExt = fileTypeToExtension(file.type);

                const fileName = `${SupabaseProps.ARTICLES}${product?.id}/${randomUUID}_${index}.${fileExt}`;

                // Subir a Supabase Storage
                const { error } = await supabase.storage
                    .from('products') // Tu bucket en Supabase
                    .upload(fileName, file);

                if (error) {
                    throw new Error(`Error al subir archivo: ${error.message}`);
                }

                // Guardar la URL pública del archivo en la base de datos, por ejemplo
                const publicUrl = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName).data.publicUrl;

                // Guardar product_media
                const { error: mediaError } = await supabase
                    .from('product_media')
                    .insert({
                        product_id: product?.id,
                        url: publicUrl,
                        type: file.type,
                        alt_text: file.name,
                        is_primary: isMain,
                    });

                if (mediaError) {
                    throw new Error(
                        `Error al guardar en product_media: ${mediaError.message}`,
                    );
                }

                // Tenemos que asegurarnos que siempre hay un archivo que sea MAIN
                if (isMain) {
                    const { error: packError } = await supabase
                        .from('product_packs')
                        .insert({
                            product_id: product.id,
                            quantity: 1,
                            price: price,
                            name: name,
                            img_url: publicUrl,
                            randomUUID: randomUUID,
                        });

                    if (packError) {
                        return NextResponse.json(
                            { message: 'Error creating pack' },
                            { status: 500 },
                        );
                    }
                }
            }
        }

        return NextResponse.json(
            { message: 'Box Pack successfully created' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error creating product' },
            { status: 500 },
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating product' },
            { status: 500 },
        );
    }
}
