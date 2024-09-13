import { NextRequest, NextResponse } from 'next/server';
import {
    ROUTE_P_BACK,
    ROUTE_P_EXTRA_1,
    ROUTE_P_EXTRA_2,
    ROUTE_P_EXTRA_3,
    ROUTE_P_PRINCIPAL,
} from '@/config';
import createServerClient from '@/utils/supabaseServer';
import { generateFileNameExtension } from '@/utils/utils';
import { SupabaseProps } from '@/constants';
import { Type } from '@/lib//productEnum';
import readUserSession, { generateUUID } from '@/lib//actions';

export async function POST(request: NextRequest) {
    try {
        const randomUUID = await generateUUID();

        const formData = await request.formData();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const is_public = (formData.get('is_public') as string) === 'true';
        const is_available =
            (formData.get('is_available') as string) === 'true';
        const price = parseFloat(formData.get('price') as string);
        const weight = parseFloat(formData.get('weight') as string);
        const slots_per_box = parseFloat(
            formData.get('slots_per_box') as string,
        );

        const p_principal = formData.get('p_principal') as File;
        const p_back = formData.get('p_back') as File;
        const p_extra_1 = formData.get('p_extra_1') as File;
        const p_extra_2 = formData.get('p_extra_2') as File;
        const p_extra_3 = formData.get('p_extra_3') as File;

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
        }

        // Create product_pack so it behaves like a product

        const fileName = `${SupabaseProps.PACKS_URL}${product.id}/${randomUUID}_0`;

        const pack_url = p_principal
            ? encodeURIComponent(
                  `${fileName}${generateFileNameExtension(p_principal.name)}`,
              )
            : '';

        const { error: packError } = await supabase
            .from('product_packs')
            .insert({
                product_id: product.id,
                quantity: 1,
                price: price,
                name: name,
                img_url: pack_url,
                randomUUID: randomUUID,
            });

        if (packError) {
            return NextResponse.json(
                { message: 'Error creating pack' },
                { status: 500 },
            );
        }

        if (p_principal) {
            const { error: packMultError } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(p_principal.name)}`,
                    pack_url,
                    {
                        contentType: p_principal.type,
                        cacheControl: '3600',
                        upsert: false,
                    },
                );

            if (packMultError) {
                // Delete previously created product pack
                const { error: deleteError } = await supabase
                    .from('product_packs')
                    .delete()
                    .eq('product_id', product.id);

                if (deleteError) {
                    return NextResponse.json(
                        { message: 'Error deleting product pack' },
                        { status: 500 },
                    );
                }

                return NextResponse.json(
                    { message: 'Error uploading pack image' },
                    { status: 500 },
                );
            }
        }

        // Multimedia
        let p_principal_url = '';
        let p_back_url = '';
        let p_extra_1_url = '';
        let p_extra_2_url = '';
        let p_extra_3_url = '';

        if (p_principal) {
            const fileName = `${SupabaseProps.ARTICLES}${product.id}${ROUTE_P_PRINCIPAL}/${randomUUID}`;

            p_principal_url = encodeURIComponent(
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
        }

        if (p_back) {
            const fileName = `${SupabaseProps.ARTICLES}${product.id}${ROUTE_P_BACK}/${randomUUID}`;

            p_back_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(p_back.name)}`,
            );

            const { error: p_back_error } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(p_back.name)}`,
                    p_back,
                    {
                        contentType: p_back.type,
                        cacheControl: '3600',
                        upsert: false,
                    },
                );

            if (p_back_error)
                return NextResponse.json(
                    { message: 'Error uploading p_back' },
                    { status: 500 },
                );
        }

        if (p_extra_1) {
            const fileName = `${SupabaseProps.ARTICLES}${product.id}${ROUTE_P_EXTRA_1}/${randomUUID}`;

            p_extra_1_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(p_extra_1.name)}`,
            );

            const { error: p_extra_1_error } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(p_extra_1.name)}`,
                    p_extra_1,
                    {
                        contentType: p_extra_1.type,
                        cacheControl: '3600',
                        upsert: false,
                    },
                );

            if (p_extra_1_error)
                return NextResponse.json(
                    { message: 'Error uploading p_extra_1' },
                    { status: 500 },
                );
        }

        if (p_extra_2) {
            const fileName = `${SupabaseProps.ARTICLES}${product.id}${ROUTE_P_EXTRA_2}/${randomUUID}`;

            p_extra_2_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(p_extra_2.name)}`,
            );

            const { error: p_extra_2_error } = await supabase.storage

                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(p_extra_2.name)}`,
                    p_extra_2,
                    {
                        contentType: p_extra_2.type,
                        cacheControl: '3600',
                        upsert: false,
                    },
                );

            if (p_extra_2_error)
                return NextResponse.json(
                    { message: 'Error uploading p_extra_2' },
                    { status: 500 },
                );
        }

        if (p_extra_3) {
            const fileName = `${SupabaseProps.ARTICLES}${product.id}${ROUTE_P_EXTRA_3}/${randomUUID}`;

            p_extra_3_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(p_extra_3.name)}`,
            );

            const { error: p_extra_3_error } = await supabase.storage

                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(p_extra_3.name)}`,
                    p_extra_3,
                    {
                        contentType: p_extra_3.type,
                        cacheControl: '3600',
                        upsert: false,
                    },
                );

            if (p_extra_3_error)
                return NextResponse.json(
                    { message: 'Error uploading p_extra_3' },
                    { status: 500 },
                );
        }

        const { error: multError } = await supabase
            .from('product_multimedia')
            .insert({
                product_id: product.id,
                p_principal: p_principal_url ?? '',
                p_back: p_back_url ?? '',
                p_extra_1: p_extra_1_url ?? '',
                p_extra_2: p_extra_2_url ?? '',
                p_extra_3: p_extra_3_url ?? '',
            });

        if (multError)
            return NextResponse.json(
                { message: 'Error creating pack' },
                { status: 500 },
            );

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
