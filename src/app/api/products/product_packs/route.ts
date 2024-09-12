import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseProps } from '@/constants';
import { generateFileNameExtension } from '@/utils/utils';
import { generateUUID } from '@/lib//actions';

export async function PUT(request: NextRequest) {
    try {
        const randomUUID = await generateUUID();

        const supabase = await createServerClient();
        const formData = await request.formData();

        const packsSize = parseInt(formData.get('packs_size') as string);
        const productId = formData.get('product_id') as string;

        let packs = [];

        for (let i = 0; i < packsSize; i++) {
            const pack = {
                id: formData.get(`packs[${i}].id`) as string,
                quantity: parseInt(
                    formData.get(`packs[${i}].quantity`) as string,
                ),
                price: parseFloat(formData.get(`packs[${i}].price`) as string),
                name: formData.get(`packs[${i}].name`) as string,
                img_url: formData.get(`packs[${i}].img_url`) as File,
                product_id: formData.get(`packs[${i}].product_id`) as string,
                prev_img_url: formData.get(
                    `packs[${i}].prev_img_url`,
                ) as string,
            };

            packs.push(pack);
        }

        // Update the packs
        // We know that exists by product_id inside the pack, so we update the pack
        packs.map(async (pack, index) => {
            if (pack.product_id !== '' && pack.product_id.length > 0) {
                const filename = `${SupabaseProps.PACKS_URL}${pack.product_id}/${randomUUID}_${index}`;
                const pack_url = pack.img_url.name
                    ? encodeURIComponent(
                          `${filename}${generateFileNameExtension(
                              pack.img_url.name,
                          )}`,
                      )
                    : pack.prev_img_url;

                const { error: packsError } = await supabase
                    .from('product_packs')
                    .update({
                        product_id: pack.product_id,
                        quantity: pack.quantity,
                        price: pack.price,
                        name: pack.name,
                        img_url: pack_url,
                        randomUUID: randomUUID,
                    })
                    .eq('id', pack.id);

                if (packsError) {
                    return NextResponse.json(
                        { message: 'Error updating product pack' },
                        { status: 500 },
                    );
                }

                // Remove previous image from the store
                // Only if img_url is type OBJECT (File) and not String (URL - this means the info came from DB so already exists)
                if (typeof pack.img_url === 'object') {
                    const decodeUriPrevImg = decodeURIComponent(
                        pack.prev_img_url,
                    );

                    const { error: errorDelete } = await supabase.storage
                        .from('products')
                        .remove([decodeUriPrevImg]);

                    if (errorDelete) {
                        console.error('errorDelete', errorDelete);
                        return;
                    }
                }
            } else {
                const filename = `${SupabaseProps.PACKS_URL}${productId}/${randomUUID}_${index}`;
                const pack_url = encodeURIComponent(
                    `${filename}${generateFileNameExtension(
                        pack.img_url.name,
                    )}`,
                );

                const { error: packsError } = await supabase
                    .from('product_packs')
                    .insert({
                        product_id: productId,
                        quantity: pack.quantity,
                        price: pack.price,
                        name: pack.name,
                        img_url: pack_url,
                        randomUUID: randomUUID,
                    })
                    .eq('product_id', productId);

                if (packsError) {
                    return NextResponse.json(
                        { message: 'Error updating product pack' },
                        { status: 500 },
                    );
                }
            }

            // Upd Img to Store
            // check if image selected in file input is not empty and is an image
            if (pack.img_url) {
                const filename = `${SupabaseProps.PACKS_URL}${productId}/${randomUUID}_${index}`;
                const file = pack.img_url;

                const { error: storagePacksError } = await supabase.storage
                    .from('products')
                    .upload(
                        `${filename}${generateFileNameExtension(
                            pack.img_url.name,
                        )}`,
                        file,
                        {
                            contentType: file.type,
                            cacheControl: '3600',
                            upsert: true,
                        },
                    );

                if (storagePacksError) {
                    return NextResponse.json(
                        { message: 'Error uploading pack image' },
                        { status: 500 },
                    );
                }
            }
        });

        return NextResponse.json(
            { message: 'Pack successfully updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error creating product' },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    const supabase = await createServerClient();
    const formData = await request.formData();

    const packsSize = parseInt(formData.get('packs_size') as string);

    for (let i = 0; i < packsSize; i++) {
        const packUrl = formData.get(`packs[${i}].img_url`) as string;

        const { error: packError } = await supabase.storage
            .from('products')
            .remove([`${decodeURIComponent(packUrl)}`]);

        if (packError) {
            return NextResponse.json(
                { message: 'Error deleting pack image' },
                { status: 500 },
            );
        }
    }

    return NextResponse.json(
        { message: 'Pack successfully deleted' },
        { status: 200 },
    );
}
