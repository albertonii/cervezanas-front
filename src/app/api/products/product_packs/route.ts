import createServerClient from '../../../../utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseProps } from '../../../../constants';
import { v4 as uuidv4 } from 'uuid';
import { generateFileNameExtension } from '../../../../utils/utils';

export async function PUT(request: NextRequest) {
    try {
        const generateUUID = () => {
            return uuidv4();
        };

        const randomUUID = generateUUID();

        const supabase = await createServerClient();
        const formData = await request.formData();

        const packsSize = parseInt(formData.get('packs_size') as string);
        const productId = formData.get('product_id') as string;

        let packs = [];

        for (let i = 0; i < packsSize; i++) {
            const pack = {
                quantity: parseInt(
                    formData.get(`packs[${i}].quantity`) as string,
                ),
                price: parseInt(formData.get(`packs[${i}].price`) as string),
                name: formData.get(`packs[${i}].name`) as string,
                img_url: formData.get(`packs[${i}].img_url`) as File,
            };

            packs.push(pack);
        }

        // Update the packs
        packs.map(async (pack, index) => {
            const filename = `${SupabaseProps.PACKS_URL}${productId}/${randomUUID}_${index}`;
            const pack_url = encodeURIComponent(
                `${filename}${generateFileNameExtension(pack.name)}`,
            );

            console.log(pack);
            console.log(typeof pack);

            if (productId) {
                const { error: packsError } = await supabase
                    .from('product_packs')
                    .update({
                        product_id: productId,
                        quantity: pack.quantity,
                        price: pack.price,
                        name: pack.name,
                        img_url: pack_url,
                        randomUUID: randomUUID,
                    })
                    .eq('id', productId);

                if (packsError) {
                    return NextResponse.json(
                        { message: 'Error updating product pack' },
                        { status: 500 },
                    );
                }

                // Remove previous image
                
                
            } else {
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
                const file = pack.img_url;

                const { error: storagePacksError } = await supabase.storage
                    .from('products')
                    .upload(
                        `${filename}${generateFileNameExtension(pack.name)}`,
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
