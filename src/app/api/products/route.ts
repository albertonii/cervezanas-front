import createServerClient from '@/utils/supabaseServer';
import readUserSession, { generateUUID } from '@/lib//actions';
import { SupabaseProps } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';
import { fileTypeToExtension, generateFileNameExtension } from '@/utils/utils';

export async function POST(request: NextRequest) {
    try {
        const randomUUID = await generateUUID();

        const supabase = await createServerClient();

        const session = await readUserSession();
        const userId = session?.id;

        const formData = await request.formData();

        // Aquí obtienes todos los archivos que se hayan subido bajo la clave 'media_file'
        const mediaFiles = formData.getAll('media_files') as File[];

        // Basic
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const type = formData.get('type') as string;
        const price = parseFloat(formData.get('price') as string);
        const is_public = (formData.get('is_public') as string) === 'true';
        const is_available =
            (formData.get('is_available') as string) === 'true';
        const is_for_event =
            (formData.get('is_for_event') as string) === 'true';
        const category = formData.get('category') as string;
        const weight = parseFloat(formData.get('weight') as string);

        // Beer Attributes
        const intensity = parseFloat(formData.get('beer.intensity') as string);
        const fermentation = formData.get('beer.fermentation') as string;
        const color = formData.get('beer.color') as string;
        const aroma = formData.get('beer.aroma') as string;
        const family = formData.get('beer.family') as string;
        const is_gluten = (formData.get('beer.is_gluten') as string) === 'true';
        const volume = parseFloat(formData.get('beer.volume') as string);
        const format = formData.get('beer.format') as string;
        const ibu = parseFloat(formData.get('beer.ibu') as string);

        // Brewery ID
        const brewery_id = formData.get('brewery_id') as string;

        // Technical Attributes
        const ingredients = formData.get(
            'technical_data.ingredients',
        ) as string;
        const pairing = formData.get('technical_data.pairing') as string;
        const recommended_glass = formData.get(
            'technical_data.recommended_glass',
        ) as string;
        const brewers_note = formData.get(
            'technical_data.brewers_note',
        ) as string;
        const og = parseFloat(formData.get('technical_data.og') as string);
        const fg = parseFloat(formData.get('technical_data.fg') as string);
        const srm = parseFloat(formData.get('technical_data.srm') as string);
        const ebc = parseFloat(formData.get('technical_data.ebc') as string);
        const hops_type = formData.get('technical_data.hops_type') as string;
        const malt_type = formData.get('technical_data.malt_type') as string;
        const consumption_temperature = parseFloat(
            formData.get('technical_data.consumption_temperature') as string,
        );

        // Transformar string a array separado por comas
        const ingredientsArray = ingredients.split(',');

        // Stock - Inventory
        // const stockQuantity = parseFloat(
        //     formData.get('stock.quantity') as string,
        // );
        // const stockLimitNotification = parseFloat(
        //     formData.get('stock.limit_notification') as string,
        // );

        // Packs
        const packsSize = parseInt(formData.get('packs_size') as string);

        let packs = [];

        for (let i = 0; i < packsSize; i++) {
            const pack = {
                quantity: parseInt(
                    formData.get(`packs[${i}].quantity`) as string,
                ),
                price: parseFloat(formData.get(`packs[${i}].price`) as string),
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

        const { data: product, error: errorProduct } = await supabase
            .from('products')
            .insert({
                name,
                description: description,
                type: type,
                owner_id: userId,
                price: price,
                is_public,
                is_available,
                is_for_event,
                category,
                weight,
                brewery_id,
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
                is_gluten,
                volume,
                format,
                weight,
                ibu,
                ingredients: ingredientsArray,
                pairing,
                recommended_glass,
                brewers_note,
                og,
                fg,
                srm,
                ebc,
                hops_type,
                malt_type,
                consumption_temperature,
            });

            console.log('BEERS', beerError);

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
        /*
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
        */

        // Packs Insert
        if (packs && packs.length > 0) {
            packs.map(async (pack, index) => {
                const fileName = `${SupabaseProps.PACKS_URL}${product.id}/${randomUUID}_${index}`;

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

                console.log('PRODUCT PACKS', packError);

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

                console.log('IMG ', packMultError);

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
                const fileName = `${SupabaseProps.AWARDS_URL}${product.id}/${randomUUID}_${index}`;
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
        }

        return NextResponse.json(
            { message: 'Product successfully created' },
            { status: 200 },
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: 'Error creating product', error: err.message },
            { status: 500 },
        );
    }
}

// TODO: Eliminar imágenes en el Bucket desde aquí.
// export async function DELETE(request: NextRequest) {
//     try {
//         const formData = await request.formData();

//         const supabase = await createServerClient();

//         const productId = formData.get('product_id') as string;

//         const { error: productError } = await supabase
//             .from('products')
//             .delete()
//             .eq('id', productId);

//         if (productError) {
//             return NextResponse.json(
//                 { message: 'Error deleting product' },
//                 { status: 500 },
//             );
//         }

//         return NextResponse.json(
//             { message: 'Product successfully deleted' },
//             { status: 200 },
//         );
//     } catch (err) {
//         return NextResponse.json(
//             { message: 'Error deleting product' },
//             { status: 500 },
//         );
//     }
// }

export async function DELETE(request: NextRequest) {
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

        // Paso 1: Obtener referencias a los archivos asociados al producto

        // Obtener los medios del producto (imágenes, videos, etc.)
        const { data: productMedia, error: mediaError } = await supabase
            .from('product_media')
            .select('url')
            .eq('product_id', productId);

        if (mediaError) {
            console.error('Error fetching product media:', mediaError);
            return NextResponse.json(
                { message: 'Error fetching product media' },
                { status: 500 },
            );
        }

        // Obtener los packs asociados al producto
        const { data: productPacks, error: packsError } = await supabase
            .from('product_packs')
            .select('img_url')
            .eq('product_id', productId);

        if (packsError) {
            console.error('Error fetching product packs:', packsError);
            return NextResponse.json(
                { message: 'Error fetching product packs' },
                { status: 500 },
            );
        }

        // Obtener los premios (awards) asociados al producto
        const { data: productAwards, error: awardsError } = await supabase
            .from('awards')
            .select('img_url')
            .eq('product_id', productId);

        if (awardsError) {
            console.error('Error fetching product awards:', awardsError);
            return NextResponse.json(
                { message: 'Error fetching product awards' },
                { status: 500 },
            );
        }

        // Paso 2: Eliminar archivos del bucket de Supabase Storage

        // Función para extraer el path relativo del archivo desde la URL pública
        const getFilePathFromUrl = (publicUrl: string) => {
            const url = new URL(publicUrl);
            return url.pathname.replace(
                '/storage/v1/object/public/products/',
                '',
            );
        };

        // Lista para acumular los paths de los archivos a eliminar
        let filesToDelete: string[] = [];

        // Añadir los archivos de product_media
        if (productMedia && productMedia.length > 0) {
            const mediaFiles = productMedia
                .map((media) => {
                    if (media.url) {
                        return getFilePathFromUrl(media.url);
                    }
                    return null; // Maneja el caso donde media.url puede ser null
                })
                .filter((path): path is string => path !== null); // Filtra los valores null

            filesToDelete = filesToDelete.concat(mediaFiles);
        }

        // Añadir los archivos de product_packs
        if (productPacks && productPacks.length > 0) {
            const packFiles = productPacks
                .map((pack) => {
                    if (pack.img_url) {
                        return decodeURIComponent(pack.img_url);
                    }
                    return null;
                })
                .filter((path): path is string => path !== null);

            filesToDelete = filesToDelete.concat(packFiles);
        }

        // Añadir los archivos de awards
        if (productAwards && productAwards.length > 0) {
            const awardFiles = productAwards
                .map((award) => {
                    if (award.img_url) {
                        return decodeURIComponent(award.img_url);
                    }
                    return null;
                })
                .filter((path): path is string => path !== null);

            filesToDelete = filesToDelete.concat(awardFiles);
        }

        // Eliminar los archivos del bucket
        if (filesToDelete.length > 0) {
            const { data, error: deleteError } = await supabase.storage
                .from('products')
                .remove(filesToDelete);

            if (deleteError) {
                console.error(
                    'Error deleting files from storage:',
                    deleteError,
                );
                return NextResponse.json(
                    { message: 'Error deleting files from storage' },
                    { status: 500 },
                );
            }
        }

        // Paso 3: Eliminar las entradas relacionadas en la base de datos

        // Eliminar entradas de product_media
        const { error: deleteMediaError } = await supabase
            .from('product_media')
            .delete()
            .eq('product_id', productId);

        if (deleteMediaError) {
            console.error('Error deleting product media:', deleteMediaError);
            return NextResponse.json(
                { message: 'Error deleting product media' },
                { status: 500 },
            );
        }

        // Eliminar el producto de la base de datos
        const { error: deleteProductError } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (deleteProductError) {
            console.error('Error deleting product:', deleteProductError);
            return NextResponse.json(
                { message: 'Error deleting product' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Product and associated data successfully deleted' },
            { status: 200 },
        );
    } catch (err) {
        console.error('Error in DELETE handler:', err);
        return NextResponse.json(
            { message: 'Error deleting product' },
            { status: 500 },
        );
    }
}

// Update
export async function PUT(request: NextRequest) {}
