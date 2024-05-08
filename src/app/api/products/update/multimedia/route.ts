import { NextRequest, NextResponse } from 'next/server';
import {
    ROUTE_P_BACK,
    ROUTE_P_EXTRA_1,
    ROUTE_P_EXTRA_2,
    ROUTE_P_EXTRA_3,
    ROUTE_P_PRINCIPAL,
} from '../../../../../config';
import { MULTIMEDIA, SupabaseProps } from '../../../../../constants';
import { v4 as uuidv4 } from 'uuid';
import { generateFileNameExtension } from '../../../../../utils/utils';
import createServerClient from '../../../../../utils/supabaseServer';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();

        const productId = formData.get('product_id') as string;
        const multimediaType = formData.get('multimedia_type') as string;
        const multimedia = formData.get('multimedia') as File;

        const supabase = await createServerClient();

        const generateUUID = () => {
            return uuidv4();
        };

        const randomUUID = generateUUID();

        if (multimediaType === MULTIMEDIA.P_PRINCIPAL) {
            // First remove previous image storaged in Supabase Bucket
            // 1. Get url from product_multimedia
            const { data: productMult, error: errorProductMult } =
                await supabase
                    .from('product_multimedia')
                    .select('p_principal')
                    .eq('product_id', productId)
                    .single();

            if (errorProductMult) {
                return NextResponse.json(
                    { message: 'Error getting product multimedia image' },
                    { status: 500 },
                );
            }

            // 2. Remove image from Supabase Bucket if exists
            if (productMult.p_principal) {
                // 2. Remove image from Supabase Bucket
                const { error: deleteError } = await supabase.storage
                    .from('products')
                    .remove([decodeURIComponent(productMult.p_principal)]);

                if (deleteError) {
                    return NextResponse.json(
                        { message: 'Error deleting product multimedia image' },
                        { status: 500 },
                    );
                }
            }

            // 3. Update product_multimedia with new image
            const fileName = `${SupabaseProps.ARTICLES}${productId}${ROUTE_P_PRINCIPAL}/${randomUUID}`;
            const p_principal_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(multimedia.name)}`,
            );

            const { error } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(multimedia.name)}`,
                    multimedia,
                    {
                        cacheControl: '3600',
                        upsert: false,
                    },
                );

            if (error) {
                return NextResponse.json(
                    { message: 'Error uploading product multimedia image' },
                    { status: 500 },
                );
            }

            const { error: multError } = await supabase
                .from('product_multimedia')
                .update({
                    p_principal: p_principal_url,
                })
                .eq('product_id', productId);

            if (multError) {
                return NextResponse.json(
                    { message: 'Error updating product multimedia image' },
                    { status: 500 },
                );
            }

            return NextResponse.json(
                { message: 'Product multimedia image updated' },
                { status: 200 },
            );
        }

        if (multimediaType === MULTIMEDIA.P_BACK) {
            // First remove previous image storaged in Supabase Bucket
            // 1. Get url from product_multimedia
            const { data: productMult, error: errorProductMult } =
                await supabase
                    .from('product_multimedia')
                    .select('p_back')
                    .eq('product_id', productId)
                    .single();

            if (errorProductMult) {
                return NextResponse.json(
                    { message: 'Error getting product multimedia image' },
                    { status: 500 },
                );
            }

            // 2. Remove image from Supabase Bucket if exists
            if (productMult.p_back) {
                // 2. Remove image from Supabase Bucket
                const { error: deleteError } = await supabase.storage
                    .from('products')
                    .remove([decodeURIComponent(productMult.p_back)]);

                if (deleteError) {
                    return NextResponse.json(
                        { message: 'Error deleting product multimedia image' },
                        { status: 500 },
                    );
                }
            }

            // 3. Update product_multimedia with new image
            const fileName = `${SupabaseProps.ARTICLES}${productId}${ROUTE_P_BACK}/${randomUUID}`;
            const p_back_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(multimedia.name)}`,
            );

            const { error } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(multimedia.name)}`,
                    multimedia,
                    {
                        cacheControl: '3600',
                        upsert: false,
                    },
                );
            if (error) {
                return NextResponse.json(
                    { message: 'Error uploading product multimedia image' },
                    { status: 500 },
                );
            }

            const { error: multError } = await supabase
                .from('product_multimedia')
                .update({
                    p_back: p_back_url,
                })
                .eq('product_id', productId);

            if (multError) {
                return NextResponse.json(
                    { message: 'Error updating product multimedia image' },
                    { status: 500 },
                );
            }

            return NextResponse.json(
                { message: 'Product multimedia image updated' },
                { status: 200 },
            );
        }

        if (multimediaType === MULTIMEDIA.P_EXTRA_1) {
            // First remove previous image storaged in Supabase Bucket
            // 1. Get url from product_multimedia
            const { data: productMult, error: errorProductMult } =
                await supabase
                    .from('product_multimedia')
                    .select('p_extra_1')
                    .eq('product_id', productId)
                    .single();

            if (errorProductMult) {
                return NextResponse.json(
                    { message: 'Error getting product multimedia image' },
                    { status: 500 },
                );
            }

            // 2. Remove image from Supabase Bucket if exists
            if (productMult.p_extra_1) {
                // 2. Remove image from Supabase Bucket
                const { error: deleteError } = await supabase.storage
                    .from('products')
                    .remove([decodeURIComponent(productMult.p_extra_1)]);

                if (deleteError) {
                    return NextResponse.json(
                        { message: 'Error deleting product multimedia image' },
                        { status: 500 },
                    );
                }
            }

            // 3. Update product_multimedia with new image
            const fileName = `${SupabaseProps.ARTICLES}${productId}${ROUTE_P_BACK}/${randomUUID}`;
            const p_extra_1_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(multimedia.name)}`,
            );

            const { error } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(multimedia.name)}`,
                    multimedia,
                    {
                        cacheControl: '3600',
                        upsert: false,
                    },
                );
            if (error) {
                return NextResponse.json(
                    { message: 'Error uploading product multimedia image' },
                    { status: 500 },
                );
            }

            const { error: multError } = await supabase
                .from('product_multimedia')
                .update({
                    p_extra_1: p_extra_1_url,
                })
                .eq('product_id', productId);

            if (multError) {
                return NextResponse.json(
                    { message: 'Error updating product multimedia image' },
                    { status: 500 },
                );
            }

            return NextResponse.json(
                { message: 'Product multimedia image updated' },
                { status: 200 },
            );
        }
        if (multimediaType === MULTIMEDIA.P_EXTRA_1) {
            // First remove previous image storaged in Supabase Bucket
            // 1. Get url from product_multimedia
            const { data: productMult, error: errorProductMult } =
                await supabase
                    .from('product_multimedia')
                    .select('p_extra_1')
                    .eq('product_id', productId)
                    .single();

            if (errorProductMult) {
                return NextResponse.json(
                    { message: 'Error getting product multimedia image' },
                    { status: 500 },
                );
            }

            // 2. Remove image from Supabase Bucket if exists
            if (productMult.p_extra_1) {
                // 2. Remove image from Supabase Bucket
                const { error: deleteError } = await supabase.storage
                    .from('products')
                    .remove([decodeURIComponent(productMult.p_extra_1)]);

                if (deleteError) {
                    return NextResponse.json(
                        { message: 'Error deleting product multimedia image' },
                        { status: 500 },
                    );
                }
            }

            // 3. Update product_multimedia with new image
            const fileName = `${SupabaseProps.ARTICLES}${productId}${ROUTE_P_EXTRA_1}/${randomUUID}`;
            const p_extra_1_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(multimedia.name)}`,
            );

            const { error } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(multimedia.name)}`,
                    multimedia,
                    {
                        cacheControl: '3600',
                        upsert: false,
                    },
                );
            if (error) {
                return NextResponse.json(
                    { message: 'Error uploading product multimedia image' },
                    { status: 500 },
                );
            }

            const { error: multError } = await supabase
                .from('product_multimedia')
                .update({
                    p_extra_1: p_extra_1_url,
                })
                .eq('product_id', productId);

            if (multError) {
                return NextResponse.json(
                    { message: 'Error updating product multimedia image' },
                    { status: 500 },
                );
            }

            return NextResponse.json(
                { message: 'Product multimedia image updated' },
                { status: 200 },
            );
        }

        if (multimediaType === MULTIMEDIA.P_EXTRA_2) {
            // First remove previous image storaged in Supabase Bucket
            // 1. Get url from product_multimedia
            const { data: productMult, error: errorProductMult } =
                await supabase
                    .from('product_multimedia')
                    .select('p_extra_2')
                    .eq('product_id', productId)
                    .single();

            if (errorProductMult) {
                return NextResponse.json(
                    { message: 'Error getting product multimedia image' },
                    { status: 500 },
                );
            }

            // 2. Remove image from Supabase Bucket if exists
            if (productMult.p_extra_2) {
                // 2. Remove image from Supabase Bucket
                const { error: deleteError } = await supabase.storage
                    .from('products')
                    .remove([decodeURIComponent(productMult.p_extra_2)]);

                if (deleteError) {
                    return NextResponse.json(
                        { message: 'Error deleting product multimedia image' },
                        { status: 500 },
                    );
                }
            }

            // 3. Update product_multimedia with new image
            const fileName = `${SupabaseProps.ARTICLES}${productId}${ROUTE_P_EXTRA_2}/${randomUUID}`;
            const p_extra_2_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(multimedia.name)}`,
            );

            const { error } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(multimedia.name)}`,
                    multimedia,
                    {
                        cacheControl: '3600',
                        upsert: false,
                    },
                );
            if (error) {
                return NextResponse.json(
                    { message: 'Error uploading product multimedia image' },
                    { status: 500 },
                );
            }

            const { error: multError } = await supabase
                .from('product_multimedia')
                .update({
                    p_extra_2: p_extra_2_url,
                })
                .eq('product_id', productId);

            if (multError) {
                return NextResponse.json(
                    { message: 'Error updating product multimedia image' },
                    { status: 500 },
                );
            }

            return NextResponse.json(
                { message: 'Product multimedia image updated' },
                { status: 200 },
            );
        }

        if (multimediaType === MULTIMEDIA.P_EXTRA_3) {
            // First remove previous image storaged in Supabase Bucket
            // 1. Get url from product_multimedia
            const { data: productMult, error: errorProductMult } =
                await supabase
                    .from('product_multimedia')
                    .select('p_extra_3')
                    .eq('product_id', productId)
                    .single();

            if (errorProductMult) {
                return NextResponse.json(
                    { message: 'Error getting product multimedia image' },
                    { status: 500 },
                );
            }

            // 2. Remove image from Supabase Bucket if exists
            if (productMult.p_extra_3) {
                // 2. Remove image from Supabase Bucket
                const { error: deleteError } = await supabase.storage
                    .from('products')
                    .remove([decodeURIComponent(productMult.p_extra_3)]);

                if (deleteError) {
                    return NextResponse.json(
                        {
                            message: 'Error deleting product multimedia image',
                        },
                        { status: 500 },
                    );
                }
            }

            // 3. Update product_multimedia with new image
            const fileName = `${SupabaseProps.ARTICLES}${productId}${ROUTE_P_EXTRA_3}/${randomUUID}`;
            const p_extra_3_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(multimedia.name)}`,
            );

            const { error } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(multimedia.name)}`,
                    multimedia,
                    {
                        cacheControl: '3600',
                        upsert: false,
                    },
                );
            if (error) {
                return NextResponse.json(
                    { message: 'Error uploading product multimedia image' },
                    { status: 500 },
                );
            }

            const { error: multError } = await supabase
                .from('product_multimedia')
                .update({
                    p_extra_3: p_extra_3_url,
                })
                .eq('product_id', productId);

            if (multError) {
                return NextResponse.json(
                    { message: 'Error updating product multimedia image' },
                    { status: 500 },
                );
            }

            return NextResponse.json(
                { message: 'Product multimedia image updated' },
                { status: 200 },
            );
        }

        return NextResponse.json(
            { message: 'Product multimedia image updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating product multimedia image' },
            { status: 500 },
        );
    }
}
