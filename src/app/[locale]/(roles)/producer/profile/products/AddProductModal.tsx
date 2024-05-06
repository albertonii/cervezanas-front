'use client';

import React, { useState, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
    aroma_options,
    color_options,
    era_options,
    family_options,
    fermentation_options,
    origin_options,
    product_type_options,
} from '../../../../../../lib/beerEnum';
import { MultimediaSection } from '../../../../components/products/MultimediaSection';
import {
    IProductInventory,
    IModalAddProductPack,
    ModalAddProductAwardFormData,
    ModalAddProductFormData,
} from '../../../../../../lib/types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { ProductSummary } from '../../../../components/products/ProductSummary';
import {
    generateFileNameExtension,
    isFileEmpty,
    isNotEmptyArray,
    isValidObject,
} from '../../../../../../utils/utils';
import { useMutation, useQueryClient } from 'react-query';
import { ProductStepper } from '../../../../components/products/ProductStepper';
import { ProductInfoSection } from '../../../../components/products/ProductInfoSection';
import { useAppContext } from '../../../../../context/AppContext';
import dynamic from 'next/dynamic';
import {
    ROUTE_ARTICLES,
    ROUTE_P_BACK,
    ROUTE_P_EXTRA_1,
    ROUTE_P_EXTRA_2,
    ROUTE_P_EXTRA_3,
    ROUTE_P_PRINCIPAL,
} from '../../../../../../config';
import { useMessage } from '../../../../components/message/useMessage';
import { AwardsSection } from '../../../../components/products/AwardsSection';

const ModalWithForm = dynamic(
    () => import('../../../../components/modals/ModalWithForm'),
    { ssr: false },
);

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = ['image/gif', 'image/jpeg', 'image/png'];
const MB_BYTES = 1000000; // Number of bytes in a megabyte.

const schema: ZodType<ModalAddProductFormData> = z.object({
    name: z.string().min(2, { message: 'errors.min_2_characters' }).max(50, {
        message: 'errors.error_50_number_max_length',
    }),
    description: z
        .string()
        .max(2500, {
            message: 'errors.error_2500_max_length',
        })
        .optional(),
    price: z.number().min(0, { message: 'errors.input_min_0' }),
    fermentation: z.number().min(0, { message: 'errors.input_min_0' }),
    color: z.number().min(0, { message: 'errors.input_min_0' }),
    intensity: z.number().min(0, { message: 'errors.input_min_0' }),
    ibu: z.number().min(0, { message: 'errors.input_min_0' }),
    aroma: z.number().min(0, { message: 'errors.input_min_0' }),
    family: z.number().min(0, { message: 'errors.input_min_0' }),
    origin: z.number().min(0, { message: 'errors.input_min_0' }),
    era: z.number().min(0, { message: 'errors.input_min_0' }),
    is_gluten: z.coerce.boolean(),
    type: z.string().min(2, { message: 'errors.input_min_2' }).max(50, {
        message: 'Required',
    }),
    awards: z.array(
        z.object({
            name: z
                .string()
                .min(2, { message: 'errors.input_min_2' })
                .max(150, {
                    message: 'errors.input_max_150',
                }),
            description: z
                .string()
                .min(2, { message: 'errors.input_min_2' })
                .max(500, {
                    message: 'errors.input_max_500',
                }),
            year: z
                .number()
                .min(1900, { message: 'errors.input_min_1900' })
                .max(2030, {
                    message: 'errors.input_max_2030',
                }),
            img_url: z
                .custom<File>()
                .superRefine((f, ctx) => {
                    // First, add an issue if the mime type is wrong.
                    if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                                ', ',
                            )}] but was ${f.type}`,
                        });
                    }
                    // Next add an issue if the file size is too large.
                    if (f.size > 3 * MB_BYTES) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.too_big,
                            type: 'array',
                            message: `The file must not be larger than ${
                                3 * MB_BYTES
                            } bytes: ${f.size}`,
                            maximum: 3 * MB_BYTES,
                            inclusive: true,
                        });
                    }
                })
                .optional(),
        }),
    ),
    p_principal: z
        .custom<File>()
        .superRefine((f, ctx) => {
            // First, add an issue if the mime type is wrong.
            if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                        ', ',
                    )}] but was ${f.type}`,
                });
            }
            // Next add an issue if the file size is too large.
            if (f.size > 3 * MB_BYTES) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    type: 'array',
                    message: `The file must not be larger than ${
                        3 * MB_BYTES
                    } bytes: ${f.size}`,
                    maximum: 3 * MB_BYTES,
                    inclusive: true,
                });
            }
        })
        .optional(),
    p_back: z
        .custom<File>()
        .superRefine((f, ctx) => {
            if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                        ', ',
                    )}] but was ${f.type}`,
                });
            }
            if (f.size > 3 * MB_BYTES) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    type: 'array',
                    message: `The file must not be larger than ${
                        3 * MB_BYTES
                    } bytes: ${f.size}`,
                    maximum: 3 * MB_BYTES,
                    inclusive: true,
                });
            }
        })
        .optional(),
    p_extra_1: z
        .custom<File>()
        .superRefine((f, ctx) => {
            if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                        ', ',
                    )}] but was ${f.type}`,
                });
            }
            if (f.size > 3 * MB_BYTES) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    type: 'array',
                    message: `The file must not be larger than ${
                        3 * MB_BYTES
                    } bytes: ${f.size}`,
                    maximum: 3 * MB_BYTES,
                    inclusive: true,
                });
            }
        })
        .optional(),
    p_extra_2: z
        .custom<File>()
        .superRefine((f, ctx) => {
            if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                        ', ',
                    )}] but was ${f.type}`,
                });
            }
            if (f.size > 3 * MB_BYTES) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    type: 'array',
                    message: `The file must not be larger than ${
                        3 * MB_BYTES
                    } bytes: ${f.size}`,
                    maximum: 3 * MB_BYTES,
                    inclusive: true,
                });
            }
        })
        .optional(),

    p_extra_3: z
        .custom<File>()
        .superRefine((f, ctx) => {
            if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                        ', ',
                    )}] but was ${f.type}`,
                });
            }
            if (f.size > 3 * MB_BYTES) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    type: 'array',
                    message: `The file must not be larger than ${
                        3 * MB_BYTES
                    } bytes: ${f.size}`,
                    maximum: 3 * MB_BYTES,
                    inclusive: true,
                });
            }
        })
        .optional(),

    is_public: z.boolean(),
    volume: z.number().min(0, { message: 'errors.input_min_0' }),
    weight: z.number().min(0, { message: 'errors.input_min_0' }),
    format: z.string().min(2, { message: 'errors.input_min_2' }).max(50, {
        message: 'errors.error_50_number_max_length',
    }),
    stock_quantity: z.number().min(0, { message: 'errors.input_min_0' }),
    stock_limit_notification: z
        .number()
        .min(0, { message: 'errors.input_required' }),
    category: z.string().min(2, { message: 'errors.input_min_2' }).max(50, {
        message: 'errors.error_50_number_max_length',
    }),
    packs: z.array(
        z.object({
            id: z.string(),
            quantity: z.number().min(0, { message: 'errors.input_min_0' }),
            price: z.number().min(0, { message: 'errors.input_min_0' }),
            name: z
                .string()
                .min(2, { message: 'errors.input_min_2' })
                .max(100, {
                    message: 'errors.error_100_number_max_length',
                }),
            img_url: z
                .custom<File>()
                .superRefine((f, ctx) => {
                    // First, add an issue if the mime type is wrong.
                    if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                                ', ',
                            )}] but was ${f.type}`,
                        });
                    }
                    // Next add an issue if the file size is too large.
                    if (f.size > 3 * MB_BYTES) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.too_big,
                            type: 'array',
                            message: `The file must not be larger than ${
                                3 * MB_BYTES
                            } bytes: ${f.size}`,
                            maximum: 3 * MB_BYTES,
                            inclusive: true,
                        });
                    }
                })
                .optional(),
        }),
    ),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddProductModal() {
    const t = useTranslations();

    const { customizeSettings, removeImage } = useAppContext();
    const { user, supabase } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [activeStep, setActiveStep] = useState<number>(0);

    const { handleMessage } = useMessage();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSetActiveStep = (value: number) => {
        setActiveStep(value);
    };

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            awards: [],
            type: 'BEER',
            is_gluten: false,
            weight: 330,
            intensity: 4,
            ibu: 30,
            price: 0,
            category: 'BEER',
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = form;
    const queryClient = useQueryClient();

    useEffect(() => {
        if (errors) {
            console.log('Errores detectados creando un producto', errors);
        }
    }, [errors]);

    const generateUUID = () => {
        return uuidv4();
    };

    const handleInsertProduct = async (form: ValidationSchema) => {
        setIsLoading(true);

        const {
            // campaign,
            fermentation,
            color,
            intensity,
            aroma,
            family,
            origin,
            era,
            is_gluten,
            type,
            awards,
            p_principal,
            p_back,
            p_extra_1,
            p_extra_2,
            p_extra_3,
            is_public,
            name,
            description,
            price,
            volume,
            weight,
            format,
            stock_quantity,
            stock_limit_notification,
            packs,
            category,
            ibu,
        } = form;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products`;

        const formData = new FormData();

        // Basic
        formData.append('name', name);
        formData.append('description', description ?? '');
        formData.append('type', type);
        formData.append('price', price.toString());
        formData.append('is_public', is_public.toString());
        formData.append('category', category);
        formData.append('weight', weight.toString());

        // Beer Attributes
        formData.append('beer.intensity', intensity.toString());
        formData.append('beer.fermentation', fermentation.toString());
        formData.append('beer.color', color.toString());
        formData.append('beer.aroma', aroma.toString());
        formData.append('beer.family', family.toString());
        formData.append('beer.origin', origin.toString());
        formData.append('beer.era', era.toString());
        formData.append('beer.is_gluten', is_gluten.toString());
        formData.append('beer.volume', volume.toString());
        formData.append('beer.format', format);
        formData.append('beer.ibu', ibu.toString());

        // Stock
        formData.append('stock.quantity', stock_quantity.toString());
        formData.append(
            'stock.limit_notification',
            stock_limit_notification.toString(),
        );

        // Packs
        console.log(packs);
        if (isNotEmptyArray(packs)) {
            packs.map((pack: IModalAddProductPack, index: number) => {
                formData.append(
                    `packs[${index}].quantity`,
                    pack.quantity.toString(),
                );
                formData.append(`packs[${index}].price`, pack.price.toString());
                formData.append(`packs[${index}].name`, pack.name);
                formData.append(`packs[${index}].img_url`, pack.img_url);
            });

            formData.append('packs_size', packs.length.toString());
        }

        // Awards
        if (isNotEmptyArray(awards)) {
            awards.map((award: ModalAddProductAwardFormData, index: number) => {
                formData.append(`awards[${index}].name`, award.name);
                formData.append(
                    `awards[${index}].description`,
                    award.description,
                );
                formData.append(`awards[${index}].year`, award.year.toString());
                formData.append(`awards[${index}].img_url`, award.img_url);
            });

            formData.append('awards_size', awards.length.toString());
        }

        // Multimedia
        console.log(p_principal);
        console.log(p_back);

        if (p_principal && !isFileEmpty(p_principal)) {
            formData.append('p_principal', p_principal[0]);
        }

        if (p_back && !isFileEmpty(p_back)) {
            formData.append('p_back', p_back);
        }

        if (p_extra_1 && !isFileEmpty(p_extra_1)) {
            formData.append('p_extra_1', p_extra_1);
        }

        if (p_extra_2 && !isFileEmpty(p_extra_2)) {
            formData.append('p_extra_2', p_extra_2);
        }

        if (p_extra_3 && !isFileEmpty(p_extra_3)) {
            formData.append('p_extra_3', p_extra_3);
        }

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: t('error_insert_product'),
            });

            setIsLoading(true);

            return;
        }

        if (response.status === 200) {
            handleMessage({
                type: 'success',
                message: t('success_insert_product'),
            });

            setShowModal(false);
            setIsLoading(false);
            queryClient.invalidateQueries('productList');

            reset();
        }

        // const productId = productData[0].id;

        // Multimedia
        // const randomUUID = generateUUID();

        // let p_principal_url = '';
        // let p_back_url = '';
        // let p_extra_1_url = '';
        // let p_extra_2_url = '';
        // let p_extra_3_url = '';

        // if (p_principal && !isFileEmpty(p_principal[0])) {
        //     const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_PRINCIPAL}/${randomUUID}`;
        //     p_principal_url = encodeURIComponent(
        //         `${fileName}${generateFileNameExtension(p_principal[0].name)}`,
        //     );

        //     const { error: pPrincipalError } = await supabase.storage
        //         .from('products')
        //         .upload(
        //             `${fileName}${generateFileNameExtension(
        //                 p_principal[0].name,
        //             )}`,
        //             p_principal[0],
        //             {
        //                 contentType: p_principal[0].type,
        //                 cacheControl: '3600',
        //                 upsert: false,
        //             },
        //         );
        //     if (pPrincipalError) throw pPrincipalError;

        //     removeImage('p_principal');
        // }

        // if (p_back && !isFileEmpty(p_back[0])) {
        //     const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_BACK}/${randomUUID}`;

        //     p_back_url =
        //         p_back &&
        //         encodeURIComponent(
        //             `${fileName}${generateFileNameExtension(p_back[0].name)}`,
        //         );

        //     const { error: pBackError } = await supabase.storage
        //         .from('products')
        //         .upload(
        //             `${fileName}${generateFileNameExtension(p_back[0].name)}`,
        //             p_back[0],
        //             {
        //                 cacheControl: '3600',
        //                 upsert: false,
        //             },
        //         );
        //     if (pBackError) throw pBackError;

        //     removeImage('p_back');
        // }

        // if (p_extra_1 && !isFileEmpty(p_extra_1[0])) {
        //     const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_EXTRA_1}/${randomUUID}`;

        //     p_extra_1_url =
        //         p_extra_1 &&
        //         encodeURIComponent(
        //             `${fileName}${generateFileNameExtension(
        //                 p_extra_1[0].name,
        //             )}`,
        //         );

        //     const { error: pExtra1Error } = await supabase.storage
        //         .from('products')
        //         .upload(
        //             `${fileName}${generateFileNameExtension(
        //                 p_extra_1[0].name,
        //             )}`,
        //             p_extra_1[0],
        //             {
        //                 cacheControl: '3600',
        //                 upsert: false,
        //             },
        //         );
        //     if (pExtra1Error) throw pExtra1Error;

        //     removeImage('p_extra_1');
        // }

        // if (p_extra_2 && !isFileEmpty(p_extra_2[0])) {
        //     const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_EXTRA_2}/${randomUUID}`;

        //     p_extra_2_url =
        //         p_extra_2 &&
        //         encodeURIComponent(
        //             `${fileName}${generateFileNameExtension(
        //                 p_extra_2[0].name,
        //             )}`,
        //         );

        //     const { error: pExtra2Error } = await supabase.storage
        //         .from('products')
        //         .upload(
        //             `${fileName}${generateFileNameExtension(
        //                 p_extra_2[0].name,
        //             )}`,
        //             p_extra_2[0],
        //             {
        //                 cacheControl: '3600',
        //                 upsert: false,
        //             },
        //         );
        //     if (pExtra2Error) throw pExtra2Error;

        //     removeImage('p_extra_2');
        // }

        // if (p_extra_3 && !isFileEmpty(p_extra_3[0])) {
        //     const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_EXTRA_3}/${randomUUID}`;

        //     p_extra_3_url =
        //         p_extra_3 &&
        //         `${fileName}${generateFileNameExtension(p_extra_3[0].name)}`;

        //     const { error: pExtra3Error } = await supabase.storage
        //         .from('products')
        //         .upload(
        //             `${fileName}${generateFileNameExtension(
        //                 p_extra_3[0].name,
        //             )}`,
        //             p_extra_3[0],
        //             {
        //                 cacheControl: '3600',
        //                 upsert: false,
        //             },
        //         );
        //     if (pExtra3Error) throw pExtra3Error;

        //     removeImage('p_extra_3');
        // }

        // const { error: multError } = await supabase
        //     .from('product_multimedia')
        //     .insert({
        //         product_id: productId,
        //         p_principal: p_principal_url ?? '',
        //         p_back: p_back_url ?? '',
        //         p_extra_1: p_extra_1_url ?? '',
        //         p_extra_2: p_extra_2_url ?? '',
        //         p_extra_3: p_extra_3_url ?? '',
        //     });

        // if (multError) throw multError;

        // setActiveStep(0);

        // Packs Stock
        // if (isNotEmptyArray(packs)) {
        //     packs.map(async (pack: IModalAddProductPack, index: number) => {
        //         const filename = `packs/${productId}/${randomUUID}_${index}`;
        //         const pack_url = encodeURIComponent(
        //             `${filename}${generateFileNameExtension(pack.name)}`,
        //         );

        //         const { error: packsError } = await supabase
        //             .from('product_packs')
        //             .insert({
        //                 product_id: productId,
        //                 quantity: pack.quantity,
        //                 price: pack.price,
        //                 name: pack.name,
        //                 img_url: pack_url,
        //                 randomUUID: randomUUID,
        //             });

        //         if (packsError) throw packsError;

        //         if (pack.img_url instanceof FileList) {
        //             const file = pack.img_url[0];

        //             const { error: storagePacksError } =
        //                 await supabase.storage
        //                     .from('products')
        //                     .upload(
        //                         `${filename}${generateFileNameExtension(
        //                             pack.name,
        //                         )}`,
        //                         file,
        //                         {
        //                             contentType: file.type,
        //                             cacheControl: '3600',
        //                             upsert: false,
        //                         },
        //                     );

        //             if (storagePacksError) throw storagePacksError;
        //         }

        //         removeImage(`packs.${index}.img_url`);
        //     });
        // }

        //     reset();
        // } else {
        //     // ERROR - No se ha podido insertar el producto
        //     handleMessage({
        //         type: 'error',
        //         message: t('error_insert_product'),
        //     });

        //     // Deshacer la inserción del producto
        //     const { error: rollbackError } = await supabase
        //         .from('products')
        //         .delete()
        //         .match({ id: productId });

        //     if (rollbackError) throw rollbackError;

        //     // Deshacer la inserción de la multimedia
        //     const { error: rollbackMultError } = await supabase
        //         .from('product_multimedia')
        //         .delete()
        //         .match({ product_id: productId });

        //     if (rollbackMultError) throw rollbackMultError;

        //     return;
        // }
    };

    const insertProductMutation = useMutation({
        mutationKey: ['insertProduct'],
        mutationFn: handleInsertProduct,
        onMutate: () => {
            setIsSubmitting(true);
        },
        onSuccess: () => {
            setIsSubmitting(false);
        },
        onError: (error: any) => {
            console.error(error);
            setIsSubmitting(false);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalAddProductFormData,
    ) => {
        try {
            insertProductMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={'add_product'}
            btnTitle={'add_product'}
            description={''}
            classIcon={''}
            classContainer={''}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => {
                setActiveStep(0);
                setShowModal(false);
            }}
            form={form}
        >
            <form>
                <ProductStepper
                    activeStep={activeStep}
                    handleSetActiveStep={handleSetActiveStep}
                    isSubmitting={isSubmitting}
                >
                    <>
                        <p className="text-slate-500 my-4 sm:text-lg leading-relaxed">
                            {t('modal_product_description')}
                        </p>

                        {activeStep === 0 ? (
                            <ProductInfoSection
                                form={form}
                                customizeSettings={customizeSettings}
                            />
                        ) : activeStep === 1 ? (
                            <MultimediaSection form={form} />
                        ) : activeStep === 2 ? (
                            <AwardsSection form={form} />
                        ) : (
                            <ProductSummary form={form} />
                        )}
                    </>
                </ProductStepper>
            </form>
        </ModalWithForm>
    );
}
