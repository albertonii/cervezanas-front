import { NextRequest, NextResponse } from 'next/server';
import {
    ROUTE_ARTICLES,
    ROUTE_P_BACK,
    ROUTE_P_EXTRA_1,
    ROUTE_P_EXTRA_2,
    ROUTE_P_EXTRA_3,
    ROUTE_P_PRINCIPAL,
} from '../../../config';
import createServerClient from '../../../utils/supabaseServer';
import { generateFileNameExtension } from '../../../utils/utils';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Basic
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const type = formData.get('type') as string;
        const price = parseFloat(formData.get('price') as string);
        const is_public = (formData.get('is_public') as string) === 'true';
        const category = formData.get('category') as string;
        const weight = parseFloat(formData.get('weight') as string);

        // Beer Attributes
        const intensity = parseFloat(formData.get('beer.intensity') as string);
        const fermentation = formData.get('beer.fermentation') as string;
        const color = formData.get('beer.color') as string;
        const aroma = formData.get('beer.aroma') as string;
        const family = formData.get('beer.family') as string;
        const origin = formData.get('beer.origin') as string;
        const era = formData.get('beer.era') as string;
        const is_gluten = (formData.get('beer.is_gluten') as string) === 'true';
        const volume = parseFloat(formData.get('beer.volume') as string);
        const format = formData.get('beer.format') as string;
        const ibu = parseFloat(formData.get('beer.ibu') as string);

        const generateUUID = () => {
            return uuidv4();
        };

        const randomUUID = generateUUID();

        // Stock - Inventory
        const stockQuantity = parseFloat(
            formData.get('stock.quantity') as string,
        );
        const stockLimitNotification = parseFloat(
            formData.get('stock.limit_notification') as string,
        );

        // Packs
        const packsSize = parseInt(formData.get('packs_size') as string);

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

        // Awards
        const awardsSize = parseInt(formData.get('awards_size') as string);

        let awards = [];

        for (let i = 0; i < awardsSize; i++) {
            const award = {
                name: formData.get(`awards[${i}].name`) as string,
                year: parseInt(formData.get(`awards[${i}].year`) as string),
                description: formData.get(`awards[${i}].description`) as string,
                img_url: formData.get(`awards[${i}].img_url`) as File,
            };

            awards.push(award);
        }

        // Multimedia
        const p_principal = formData.get('p_principal') as File;
        const p_back = formData.get('p_back') as File;
        const p_extra_1 = formData.get('p_extra_1') as File;
        const p_extra_2 = formData.get('p_extra_2') as File;
        const p_extra_3 = formData.get('p_extra_3') as File;

        const supabase = await createServerClient();
        const userId = (await supabase.auth.getSession()).data.session?.user.id;

        const { data: product, error: errorProduct } = await supabase
            .from('products')
            .insert({
                name,
                description: description,
                type: type,
                owner_id: userId,
                price: price,
                is_public,
                category,
                weight,
            })
            .select('id')
            .single();

        if (errorProduct) {
            return NextResponse.json(
                { message: 'Error creating product' },
                { status: 500 },
            );
        }

        // Beer Attributes Insert
        if (product) {
            const { error: beerError } = await supabase.from('beers').insert({
                product_id: product.id,
                intensity,
                fermentation,
                color,
                aroma,
                family,
                origin,
                era,
                is_gluten,
                volume,
                format,
                weight,
                ibu,
            });

            if (beerError) {
                // Delete previously created product
                const { error: deleteError } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', product.id);

                if (deleteError) {
                    return NextResponse.json(
                        { message: 'Error deleting product' },
                        { status: 500 },
                    );
                }

                return NextResponse.json(
                    { message: 'Error creating beer attributes' },
                    { status: 500 },
                );
            }
        }

        // Stock - Inventory Insert
        if (stockLimitNotification && stockQuantity) {
            const { error: stockError } = await supabase
                .from('product_inventory')
                .insert({
                    product_id: product.id,
                    quantity: stockQuantity,
                    limit_notification: stockLimitNotification,
                });

            if (stockError) {
                // Delete previously created product
                const { error: deleteError } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', product.id);

                if (deleteError) {
                    return NextResponse.json(
                        { message: 'Error deleting product' },
                        { status: 500 },
                    );
                }

                return NextResponse.json(
                    { message: 'Error creating stock inventory' },
                    { status: 500 },
                );
            }
        }

        // Packs Insert
        if (packs && packs.length > 0) {
            packs.map(async (pack, index) => {
                const fileName = `packs/${product.id}/${randomUUID}_${index}`;

                const pack_url = encodeURIComponent(
                    `${fileName}${generateFileNameExtension(
                        pack.img_url.name,
                    )}`,
                );

                const { error: packError } = await supabase
                    .from('product_packs')
                    .insert({
                        product_id: product.id,
                        quantity: pack.quantity,
                        price: pack.price,
                        name: pack.name,
                        img_url: pack_url,
                        randomUUID: randomUUID,
                    });

                if (packError) {
                    return NextResponse.json(
                        { message: 'Error creating pack' },
                        { status: 500 },
                    );
                }

                const { error: packMultError } = await supabase.storage
                    .from('products')
                    .upload(
                        `${fileName}${generateFileNameExtension(
                            pack.img_url.name,
                        )}`,
                        pack.img_url,
                        {
                            contentType: pack.img_url.type,
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
            });
        }

        // Awards Insert
        if (awards && awards.length > 0) {
            awards.map(async (award, index) => {
                const fileName = `awards/${product.id}/${randomUUID}_${index}`;
                const award_url = encodeURIComponent(
                    `${fileName}${generateFileNameExtension(
                        award.img_url.name,
                    )}`,
                );

                const { error: awardError } = await supabase
                    .from('awards')
                    .insert({
                        product_id: product.id,
                        name: award.name,
                        year: award.year,
                        description: award.description,
                        img_url: award_url,
                    });

                if (awardError) {
                    return NextResponse.json(
                        { message: 'Error creating award' },
                        { status: 500 },
                    );
                }

                const { error: awardMultError } = await supabase.storage
                    .from('products')
                    .upload(
                        `${fileName}${generateFileNameExtension(
                            award.img_url.name,
                        )}`,
                        award.img_url,
                        {
                            contentType: award.img_url.type,
                            cacheControl: '3600',
                            upsert: false,
                        },
                    );

                if (awardMultError) {
                    // Delete previously created product award
                    const { error: deleteError } = await supabase
                        .from('awards')
                        .delete()
                        .eq('product_id', product.id);

                    if (deleteError) {
                        return NextResponse.json(
                            { message: 'Error deleting product award' },
                            { status: 500 },
                        );
                    }

                    return NextResponse.json(
                        { message: 'Error uploading award image' },
                        { status: 500 },
                    );
                }
            });
        }

        // Multimedia
        /*
        const generateUUID = () => {
            return uuidv4();
        };

        const randomUUID = generateUUID();

        let p_principal_url = '';
        let p_back_url = '';
        let p_extra_1_url = '';
        let p_extra_2_url = '';
        let p_extra_3_url = '';

        if (p_principal) {
            const fileName = `${ROUTE_ARTICLES}/${product.id}${ROUTE_P_PRINCIPAL}/${randomUUID}`;

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
            const fileName = `${ROUTE_ARTICLES}/${product.id}${ROUTE_P_BACK}/${randomUUID}`;

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
            const fileName = `${ROUTE_ARTICLES}/${product.id}${ROUTE_P_EXTRA_1}/${randomUUID}`;

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
            const fileName = `${ROUTE_ARTICLES}/${product.id}${ROUTE_P_EXTRA_2}/${randomUUID}`;

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
            const fileName = `${ROUTE_ARTICLES}/${product.id}${ROUTE_P_EXTRA_3}/${randomUUID}`;

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

        if (multError) throw multError;
        */

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
