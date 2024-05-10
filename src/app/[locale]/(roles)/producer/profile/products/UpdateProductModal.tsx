'use client';

import React, { ComponentProps, useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Aroma,
    aroma_options,
    Color,
    color_options,
    Era,
    era_options,
    Family,
    family_options,
    Fermentation,
    fermentation_options,
    Origin,
    origin_options,
    product_type_options,
} from '../../../../../../lib/beerEnum';
import { v4 as uuidv4 } from 'uuid';
import {
    IProduct,
    IProductInventory,
    ModalUpdateProductFormData,
    ModalUpdateProductPackFormData,
    ModalUpdateProductAwardFormData,
} from '../../../../../../lib/types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { UpdateMultimediaSection } from './UpdateMultimediaSection';
import { UpdateProductInfoSection } from './UpdateProductInfoSection';
import {
    generateFileNameExtension,
    isNotEmptyArray,
    isValidObject,
} from '../../../../../../utils/utils';
import { UpdateProductSummary } from './UpdateProductSummary';
import { useAppContext } from '../../../../../context/AppContext';
import { UpdateAwardsSection } from './UpdateAwardsSection';
import { ProductStepper } from '../../../../components/products/ProductStepper';
import ModalWithForm from '../../../../components/modals/ModalWithForm';
import { useMessage } from '../../../../components/message/useMessage';

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = [
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
];
const MB_BYTES = 1000000; // Number of bytes in a megabyte.

const schema: ZodType<ModalUpdateProductFormData> = z.object({
    product_id: z.string(),
    name: z.string().min(2, { message: 'errors.input_min_2' }).max(50, {
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

    is_public: z.boolean(),
    // TODO: Bug in volume validation when adding product
    // volume: z.number().min(0, { message: "Required" }).max(50, {
    //   message: "Required",
    // }),
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

                .or(z.string()),
        }),
    ),
    packs: z.array(
        z.object({
            id: z.string().optional(),
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
                .or(z.string()),
        }),
    ),
    p_principal: z
        .custom<File>()
        .superRefine((f, ctx) => {
            if (f.type === undefined) {
                return;
            }

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
            if (f.type === undefined) {
                return;
            }

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
    p_extra_1: z
        .custom<File>()
        .superRefine((f, ctx) => {
            if (f.type === undefined) {
                return;
            }

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
    p_extra_2: z
        .custom<File>()
        .superRefine((f, ctx) => {
            if (f.type === undefined) {
                return;
            }

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
    p_extra_3: z
        .custom<File>()
        .superRefine((f, ctx) => {
            if (f.type === undefined) {
                return;
            }

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
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    product: IProduct;
    showModal: boolean;
    handleEditShowModal: ComponentProps<any>;
}

export function UpdateProductModal({
    product,
    showModal,
    handleEditShowModal,
}: Props) {
    const t = useTranslations();
    const { user, supabase } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const { customizeSettings, removeImage } = useAppContext();
    const { handleMessage } = useMessage();

    const handleSetActiveStep = (value: number) => {
        setActiveStep(value);
    };

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { beers } = product;

    if (!product.beers || !beers) return <></>;

    const {
        color,
        aroma,
        family,
        fermentation,
        origin,
        era,
        volume,
        format,
        intensity,
        ibu,
    } = beers;

    const colorDefault: {
        label: string;
        value: Color;
    } = color_options.find((c) => c.value.toString() === color) ?? {
        label: 'very_light',
        value: Color.very_light,
    };

    const aromaDefault: {
        label: string;
        value: Aroma;
    } = aroma_options.find((c) => c.value.toString() === aroma) ?? {
        label: 'maltose',
        value: 0,
    };

    const familyDefault: {
        label: string;
        value: Family;
    } = family_options.find((c) => c.value.toString() === family) ?? {
        label: 'ipa',
        value: 0,
    };

    const fermentationDefault: {
        label: string;
        value: Fermentation;
    } = fermentation_options.find(
        (c) => c.value.toString() === fermentation,
    ) ?? {
        label: 'none',
        value: 7,
    };

    const originDefault: {
        label: string;
        value: Origin;
    } = origin_options.find((c) => c.value.toString() === origin) ?? {
        label: 'none',
        value: 7,
    };

    const eraDefault: {
        label: string;
        value: Era;
    } = era_options.find((c) => c.value.toString() === era) ?? {
        label: 'none',
        value: 4,
    };

    // convert string to FileList image
    // TODO: Comprobar que convertStringToFileList funciona
    const convertStringToFileList = (img_url: string) => {
        const file = new File([img_url], img_url, {
            type: 'image/jpeg',
        });

        const fileList = new DataTransfer();
        fileList.items.add(file);

        return fileList.files;
    };

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            product_id: product.id,
            category: product.category ?? '',
            name: product.name ?? '',
            description: product.description ?? '',
            type: product.type ?? 'BEER',
            is_public: product.is_public ?? false,
            price: product.price ?? 0,
            stock_quantity: product.product_inventory?.quantity ?? 0,
            stock_limit_notification:
                product.product_inventory?.limit_notification ?? 0,
            format: format,
            volume: volume,
            weight: product.weight ?? 0,
            color: colorDefault.value,
            aroma: aromaDefault.value,
            intensity: intensity,
            ibu: ibu,
            family: familyDefault.value,
            fermentation: fermentationDefault.value,
            origin: originDefault.value,
            era: eraDefault.value,
            is_gluten: product.beers?.is_gluten ?? false,
            p_principal: convertStringToFileList(
                product.product_multimedia?.p_principal ?? '',
            ),
            p_back: convertStringToFileList(
                product.product_multimedia?.p_back ?? '',
            ),
            p_extra_1: convertStringToFileList(
                product.product_multimedia?.p_extra_1 ?? '',
            ),
            p_extra_2: convertStringToFileList(
                product.product_multimedia?.p_extra_2 ?? '',
            ),
            p_extra_3: convertStringToFileList(
                product.product_multimedia?.p_extra_3 ?? '',
            ),
            packs: product.product_packs,
            awards: product.awards ?? [],
            // campaign: "-",
        },
    });

    const {
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
    } = form;

    const queryClient = useQueryClient();

    useEffect(() => {
        if (errors) {
            console.log('ERROR EN UPDATE PRODUCT: ', errors);
        }
    }, [errors]);

    const generateUUID = () => {
        return uuidv4();
    };

    const updateBasicSection = async (formValues: any) => {
        const userId = user?.id;

        const { name, description, type, price, is_public, weight } =
            formValues;

        const { data, error: productError } = await supabase
            .from('products')
            .update({
                name,
                description,
                type,
                owner_id: userId,
                price,
                is_public,
                weight,
            })
            .eq('id', product.id)
            .select();

        if (productError) throw productError;
        if (!data) throw new Error('No data returned from supabase');

        return data[0] as IProduct;
    };

    const updateBeerSection = async (formValues: any) => {
        const {
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
        } = formValues;

        const { data: beerData, error: beerError } = await supabase
            .from('beers')
            .update({
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
            })
            .eq('product_id', product.id)
            .select('*')
            .single();

        if (beerError) throw beerError;

        if (!beerData) throw new Error('No data returned from supabase');
    };

    const updateInventory = async (formValues: any) => {
        const { stock_quantity, stock_limit_notification } = formValues;

        // Inventory - Stock
        const stock: IProductInventory = {
            product_id: product.id,
            quantity: stock_quantity,
            limit_notification: stock_limit_notification,
        };

        const { error: stockError } = await supabase
            .from('product_inventory')
            .update(stock)
            .eq('product_id', product.id);
        if (stockError) throw stockError;
    };

    const updatePacks = async (
        packs: ModalUpdateProductPackFormData[],
        randomUUID: string,
    ) => {
        const productId = product.id;

        packs.map(
            async (pack: ModalUpdateProductPackFormData, index: number) => {
                const filename = `packs/${productId}/${randomUUID}_${index}`;
                const pack_url = encodeURIComponent(
                    `${filename}${generateFileNameExtension(pack.name)}`,
                );

                if (pack.product_id) {
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
                        .eq('id', pack.product_id);

                    if (packsError) throw packsError;
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

                    if (packsError) throw packsError;
                }

                // Upd Img to Store
                // check if image selected in file input is not empty and is an image
                if (pack.img_url instanceof FileList) {
                    const file = pack.img_url[0];

                    const { error: storagePacksError } = await supabase.storage
                        .from('products')
                        .upload(
                            `${filename}${generateFileNameExtension(
                                pack.name,
                            )}`,
                            file,
                            {
                                contentType: file.type,
                                cacheControl: '3600',
                                upsert: true,
                            },
                        );

                    if (storagePacksError) throw storagePacksError;
                }

                removeImage(`packs.${index}.img_url`);
            },
        );
    };

    const updateAwards = async (
        awards: ModalUpdateProductAwardFormData[],
        randomUUID: string,
    ) => {
        const formData = new FormData();

        formData.append('product_id', product.id);
        formData.append('random_uuid', randomUUID);

        awards.map((award) => {
            formData.append('name', award.name);
            formData.append('description', award.description);
            formData.append('year', award.year.toString());
            formData.append('img_url', award.img_url);
        });

        formData.append('awards_size', awards.length.toString());

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/awards`;

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: t('error_update_awards'),
            });

            return;
        }
    };

    useEffect(() => {
        console.info(dirtyFields);
    }, [dirtyFields]);

    const handleUpdateProduct = async (formValues: any) => {
        const {
            // campaign,
            awards,
            packs,
        } = formValues;

        setActiveStep(0);

        const randomUUID = generateUUID();

        if (
            dirtyFields.name ||
            dirtyFields.description ||
            dirtyFields.type ||
            dirtyFields.price ||
            dirtyFields.is_public ||
            dirtyFields.weight
        ) {
            updateBasicSection(formValues);
        }

        // Beer type
        if (product_type_options[0].label === product.type) {
            if (
                dirtyFields.intensity ||
                dirtyFields.fermentation ||
                dirtyFields.color ||
                dirtyFields.aroma ||
                dirtyFields.family ||
                dirtyFields.origin ||
                dirtyFields.era ||
                dirtyFields.is_gluten ||
                dirtyFields.volume ||
                dirtyFields.format ||
                dirtyFields.weight ||
                dirtyFields.ibu
            ) {
                updateBeerSection(formValues);
            }

            if (
                dirtyFields.stock_quantity ||
                dirtyFields.stock_limit_notification
            ) {
                updateInventory(formValues);
            }

            // Packs
            if (dirtyFields.packs && isNotEmptyArray(packs)) {
                updatePacks(packs, randomUUID);
            }

            // Awards
            if (
                dirtyFields.awards &&
                awards &&
                isNotEmptyArray(awards) &&
                isValidObject(awards[0].img_url)
            ) {
                updateAwards(awards, randomUUID);
            }
        }

        handleEditShowModal(false);
        queryClient.invalidateQueries('productList');
    };

    const updateProductMutation = useMutation({
        mutationKey: ['updateProduct'],
        mutationFn: handleUpdateProduct,
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

    const onSubmit = (formValues: ModalUpdateProductFormData) => {
        try {
            if (isDirty) {
                updateProductMutation.mutate(formValues);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ModalWithForm
            showBtn={false}
            showModal={showModal}
            setShowModal={handleEditShowModal}
            title={'update_product'}
            btnTitle={'update_product'}
            description={''}
            classIcon={''}
            classContainer={''}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => handleEditShowModal(false)}
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
                            <UpdateProductInfoSection form={form} />
                        ) : activeStep === 1 ? (
                            <UpdateMultimediaSection
                                form={form}
                                productId={product.id}
                            />
                        ) : activeStep === 2 ? (
                            <UpdateAwardsSection form={form} />
                        ) : (
                            <UpdateProductSummary form={form} />
                        )}
                    </>
                </ProductStepper>
            </form>
        </ModalWithForm>
    );
}
