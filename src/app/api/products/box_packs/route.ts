import { NextRequest, NextResponse } from 'next/server';
import { ROUTE_ARTICLES, ROUTE_P_PRINCIPAL } from '../../../../config';
import createServerClient from '../../../../utils/supabaseServer';
import { generateFileNameExtension } from '../../../../utils/utils';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const is_public = (formData.get('is_public') as string) === 'true';
        const price = parseFloat(formData.get('price') as string);
        const weight = parseFloat(formData.get('weight') as string);
        const slots_per_box = parseFloat(
            formData.get('slots_per_box') as string,
        );

        const p_principal = formData.get('p_principal') as File;

        const supabase = await createServerClient();
        const userId = (await supabase.auth.getSession()).data.session?.user.id;

        const { data: product, error: errorProduct } = await supabase
            .from('products')
            .insert({
                name,
                description: description,
                is_public,
                category: 'box_pack',
                type: 'box_pack',
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
        }

        const generateUUID = () => {
            return uuidv4();
        };

        const randomUUID = generateUUID();

        if (p_principal) {
            const fileName = `${ROUTE_ARTICLES}/${product.id}${ROUTE_P_PRINCIPAL}/${randomUUID}`;

            const p_principal_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(p_principal.name)}`,
            );

            const { error: p_principal_error } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(p_principal.name)}`,
                    p_principal,
                    {
                        contentType: p_principal.type,
                        cacheControl: '3600',
                        upsert: false,
                    },
                );

            if (p_principal_error)
                return NextResponse.json(
                    { message: 'Error uploading p_principal' },
                    { status: 500 },
                );

            const { error: multError } = await supabase
                .from('product_multimedia')
                .insert({
                    product_id: product.id,
                    p_principal: p_principal_url ?? '',
                    // p_back: p_back_url ?? '',
                    // p_extra_1: p_extra_1_url ?? '',
                    // p_extra_2: p_extra_2_url ?? '',
                    // p_extra_3: p_extra_3_url ?? '',
                });

            if (multError) throw multError;
        }

        // Deveolver OK para que el cliente no se quede esperando
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
