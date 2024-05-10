import { NextRequest, NextResponse } from 'next/server';
import { SupabaseProps } from '../../../../constants';
import { generateFileNameExtension } from '../../../../utils/utils';
import createServerClient from '../../../../utils/supabaseServer';

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
                name: formData.get(`awards[${i}].name`) as string,
                year: parseInt(formData.get(`awards[${i}].year`) as string),
                description: formData.get(`awards[${i}].description`) as string,
                img_url: formData.get(`awards[${i}].img_url`) as File,
            };

            awards.push(award);
        }

        // Awards Insert
        if (awards && awards.length > 0) {
            // Remove previous images storaged in Supabase Bucket for that productID
            // 1. Get list of files in the folder
            const { data: awardList, error: errorAwardList } =
                await supabase.storage
                    .from('products')
                    .list(`${SupabaseProps.AWARDS_URL}${productId}`);

            if (errorAwardList) {
                return NextResponse.json(
                    { message: 'Error getting awards list to remove' },
                    { status: 500 },
                );
            }

            const filesToRemove = awardList.map(
                (x) => `${SupabaseProps.AWARDS_URL}${productId}/${x.name}`,
            );

            const { error: errorRemoveAwardList } = await supabase.storage
                .from('products')
                .remove(filesToRemove);

            if (errorRemoveAwardList) {
                return NextResponse.json(
                    { message: 'Error removing awards list' },
                    { status: 500 },
                );
            }

            // 2. Insert new images
            awards.map(async (award, index) => {
                const fileName = `${SupabaseProps.AWARDS_URL}${productId}/${randomUUID}_${index}`;
                const award_url = encodeURIComponent(
                    `${fileName}${generateFileNameExtension(
                        award.img_url.name,
                    )}`,
                );

                const { error: awardError } = await supabase
                    .from('awards')
                    .update({
                        product_id: productId,
                        name: award.name,
                        description: award.description,
                        year: award.year,
                        img_url: award_url,
                    })
                    .eq('product_id', productId);

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
        const awardUrl = formData.get(`awards[${i}].img_url`) as string;

        console.log(awardUrl);

        const { error: awardError } = await supabase.storage
            .from('products')
            .remove([`${decodeURIComponent(awardUrl)}`]);

        if (awardError) {
            return NextResponse.json(
                { message: 'Error deleting award image' },
                { status: 500 },
            );
        }
    }

    return NextResponse.json(
        { message: 'Award successfully deleted' },
        { status: 200 },
    );
}
