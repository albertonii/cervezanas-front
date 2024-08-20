import createServerClient from '@/utils/supabaseServer';
import { SupabaseProps } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';
import { generateFileNameExtension } from '@/utils/utils';
import { ModalUpdateProductAwardFormData } from '@/lib/types/types';

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createServerClient();

        const formData = await request.formData();

        const productId = formData.get('product_id') as string;
        const randomUUID = formData.get('random_uuid') as string;

        // Awards
        const awardsSize = parseInt(formData.get('awards_size') as string);

        let awards = [];

        for (let i = 0; i < awardsSize; i++) {
            const award = {
                id: formData.get(`awards[${i}].id`) as string,
                name: formData.get(`awards[${i}].name`) as string,
                description: formData.get(`awards[${i}].description`) as string,
                year: parseInt(formData.get(`awards[${i}].year`) as string),
                img_url: formData.get(`awards[${i}].img_url`) as File,
                img_url_changed:
                    formData.get(`awards[${i}].img_url_changed`) === 'true',
                img_url_from_db: formData.get(
                    `awards[${i}].img_url_from_db`,
                ) as string,
            };

            awards.push(award);
        }

        // Update or insert Awards
        if (awards && awards.length > 0) {
            awards.map(async (award, index) => {
                // 1. Remove previous image if award url has changed
                if (award.img_url_changed) {
                    const { error: awardError } = await supabase.storage
                        .from('products')
                        .remove([
                            `${decodeURIComponent(award.img_url_from_db)}`,
                        ]);

                    if (awardError) {
                        return NextResponse.json(
                            { message: 'Error deleting award image' },
                            { status: 500 },
                        );
                    }
                }

                const fileName = `${SupabaseProps.AWARDS_URL}${productId}/${randomUUID}_${index}`;
                const award_url = encodeURIComponent(
                    `${fileName}${generateFileNameExtension(
                        award.img_url.name,
                    )}`,
                );

                // 2. Insert or Update new images
                // Update because it has an id so it exists in the DB
                if (award.id) {
                    const updateData: ModalUpdateProductAwardFormData = {
                        product_id: productId,
                        name: award.name,
                        description: award.description,
                        year: award.year,
                    };

                    // Solo agregar img_url si img_url_changed es true
                    if (award.img_url_changed) {
                        updateData.img_url = award_url;
                    }

                    const { error: awardError } = await supabase
                        .from('awards')
                        .update(updateData)
                        .eq('id', award.id);

                    if (awardError) {
                        return NextResponse.json(
                            { message: 'Error creating award' },
                            { status: 500 },
                        );
                    }

                    if (award.img_url_changed) {
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
                                .eq('product_id', productId);

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
                    }
                } else {
                    const { error: awardError } = await supabase
                        .from('awards')
                        .insert({
                            product_id: productId,
                            name: award.name,
                            description: award.description,
                            year: award.year,
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
                            .eq('product_id', productId);

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
                }
            });
        }

        return NextResponse.json(
            { message: 'Award successfully updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating award' },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    const supabase = await createServerClient();
    const formData = await request.formData();

    const awardsSize = parseInt(formData.get('awards_size') as string);

    for (let i = 0; i < awardsSize; i++) {
        const awardId = formData.get(`awards[${i}].id`) as string;
        const awardUrl = formData.get(`awards[${i}].img_url`) as string;

        const { error: awardError } = await supabase.storage
            .from('products')
            .remove([`${decodeURIComponent(awardUrl)}`]);

        if (awardError) {
            return NextResponse.json(
                { message: 'Error deleting award image' },
                { status: 500 },
            );
        }

        const { error: awardMultError } = await supabase
            .from('awards')
            .delete()
            .eq('id', awardId);

        if (awardMultError) {
            return NextResponse.json(
                { message: 'Error deleting award' },
                { status: 500 },
            );
        }
    }

    return NextResponse.json(
        { message: 'Award successfully deleted' },
        { status: 200 },
    );
}
