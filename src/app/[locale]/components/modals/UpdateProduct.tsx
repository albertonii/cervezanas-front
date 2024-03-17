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
} from '../../../../lib/beerEnum';
import {
    IProduct,
    IProductInventory,
    IAward,
    IProductPack,
    ModalUpdateProductFormData,
} from '../../../../lib/types/types';
import { uuid } from 'uuidv4';
import { useAuth } from '../../(auth)/Context/useAuth';
import { ProductStepper } from './ProductStepper';
import { useMutation, useQueryClient } from 'react-query';
import { UpdateAwardsSection } from './UpdateAwardsSection';
import { UpdateMultimediaSection } from './UpdateMultimediaSection';
import { UpdateProductInfoSection } from './UpdateProductInfoSection';
import { getFileExtensionByName } from '../../../../utils/formatWords';
import {
    isEmpty,
    isNotEmptyArray,
    isValidObject,
} from '../../../../utils/utils';
import ModalWithForm from './ModalWithForm';
import { ProductSummary } from './ProductSummary';
import { UpdateProductSummary } from './UpdateProductSummary';
import { SupabaseProps } from '../../../../constants';

const schema: ZodType<ModalUpdateProductFormData> = z.object({
    product_id: z.string(),
    name: z.string().min(2, { message: 'errors.input_min_2' }).max(50, {
        message: 'errors.error_50_number_max_length',
    }),
    description: z
        .string()
        .min(2, { message: 'errors.input_min_2' })
        .max(2500, {
            message: 'errors.error_2500_max_length',
        }),
    price: z.number().min(0, { message: 'errors.input_min_0' }),
    fermentation: z
        .number()
        .min(0, { message: 'errors.input_min_0' })
        .max(100, {
            message: 'errors.input_required',
        }),
    color: z.number().min(0, { message: 'errors.input_min_0' }),
    intensity: z.number().min(0, { message: 'errors.input_min_0' }).max(5, {
        message: 'errors.input_required',
    }),
    aroma: z.number().min(0, { message: 'errors.input_min_0' }).max(5, {
        message: 'errors.input_required',
    }),
    family: z.number().min(0, { message: 'errors.input_min_0' }).max(30, {
        message: 'errors.input_required',
    }),
    origin: z.number().min(0, { message: 'errors.input_min_0' }).max(8, {
        message: 'errors.input_required',
    }),
    era: z.number().min(0, { message: 'errors.input_min_0' }).max(5, {
        message: 'errors.input_required',
    }),
    is_gluten: z.coerce.boolean(),
    type: z.string().min(2, { message: 'errors.input_min_2' }).max(50, {
        message: 'Required',
    }),
    p_principal: z.instanceof(FileList).optional(),
    p_back: z.instanceof(FileList).optional(),
    p_extra_1: z.instanceof(FileList).optional(),
    p_extra_2: z.instanceof(FileList).optional(),
    p_extra_3: z.instanceof(FileList).optional(),
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
    category: z.string().min(2, { message: 'errors.input_min_2' }).max(50, {
        message: 'errors.error_50_number_max_length',
    }),
    stock_quantity: z.number().min(0, { message: 'errors.input_min_0' }),
    stock_limit_notification: z
        .number()
        .min(0, { message: 'errors.input_required' }),
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
            img_url: z.instanceof(FileList).optional(),
        }),
    ),
    packs: z.array(
        z.object({
            id: z.string().nonempty({ message: 'errors.input_required' }),
            quantity: z.number().min(0, { message: 'errors.input_min_0' }),
            price: z.number().min(0, { message: 'errors.input_min_0' }),
            name: z
                .string()
                .min(2, { message: 'errors.input_min_2' })
                .max(100, {
                    message: 'errors.error_100_number_max_length',
                }),
            img_url: z.instanceof(FileList).optional(),
        }),
    ),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    product: IProduct;
    showModal: boolean;
    handleEditShowModal: ComponentProps<any>;
}

export function UpdateProduct({
    product,
    showModal,
    handleEditShowModal,
}: Props) {
    const t = useTranslations();
    const { user, supabase } = useAuth();
    const [activeStep, setActiveStep] = useState(0);

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
            type: product.type ?? '',
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
        reset,
        formState: { errors },
    } = form;

    const queryClient = useQueryClient();

    useEffect(() => {
        console.log('ERROR EN UPDATE PRODUCT: ', errors);
    }, [errors]);

    // TODO: Error al guardar pq los awards.img y packs.img no son FileList por defecto.
    // Solo cuando se vuelve a seleccionar el archivo
    // useEffect(() => {
    //     product.awards?.map((award) => {
    //         const preUrl =
    //             SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

    //         const url = preUrl + decodeURIComponent(award.img_url);
    //         console.log
    //         const awardFile = (award.img_url = new File(
    //             [url],
    //             award.img_url.name,
    //             {
    //                 type: 'image/jpeg',
    //             },
    //         ));

    //         console.log(awardFile);
    //     });
    // }, [product]);

    const handleUpdateProduct = async (formValues: any) => {
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
        } = formValues;

        const userId = user?.id;

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

        const productData = data[0] as IProduct;

        const productId = product.id;

        // Multimedia
        const p_principal_url = !isEmpty(p_principal?.name)
            ? encodeURIComponent(p_principal.name)
            : '';

        const p_back_url = !isEmpty(p_back?.name)
            ? encodeURIComponent(p_back.name)
            : '';

        const p_extra_1_url = !isEmpty(p_extra_1?.name)
            ? encodeURIComponent(p_extra_1.name)
            : '';

        const p_extra_2_url = !isEmpty(p_extra_2?.name)
            ? encodeURIComponent(p_extra_2.name)
            : '';

        const p_extra_3_url = !isEmpty(p_extra_3?.name)
            ? encodeURIComponent(p_extra_3.name)
            : '';

        const { data: product_multimedia, error: multError } = await supabase
            .from('product_multimedia')
            .update({
                p_principal: p_principal_url,
                p_back: p_back_url,
                p_extra_1: p_extra_1_url,
                p_extra_2: p_extra_2_url,
                p_extra_3: p_extra_3_url,
            })
            .eq('product_id', product.id);

        if (multError) throw multError;
        if (product_multimedia) {
            productData.product_multimedia = product_multimedia;
        }

        // Store images in bucket
        if (p_principal_url) {
            const { error: pPrincipalError } = await supabase.storage
                .from('products')
                .update(`articles/${p_principal_url}`, p_principal, {
                    cacheControl: '3600',
                    upsert: true,
                });
            if (pPrincipalError) throw pPrincipalError;
        }

        if (p_back_url) {
            const { error: pBackError } = await supabase.storage
                .from('products')
                .update(`articles/${p_back_url}`, p_back.name, {
                    cacheControl: '3600',
                    upsert: true,
                });
            if (pBackError) throw pBackError;
        }

        if (p_extra_1_url) {
            const { error: pExtra1Error } = await supabase.storage
                .from('products')
                .update(`articles/${p_extra_1}`, p_extra_1.name, {
                    cacheControl: '3600',
                    upsert: true,
                });
            if (pExtra1Error) throw pExtra1Error;
        }

        if (p_extra_2_url) {
            const { error: pExtra2Error } = await supabase.storage
                .from('products')
                .update(`articles/${p_extra_2_url}`, p_extra_2.name, {
                    cacheControl: '3600',
                    upsert: true,
                });
            if (pExtra2Error) throw pExtra2Error;
        }

        if (p_extra_3_url) {
            const { error: pExtra3Error } = await supabase.storage
                .from('products')
                .update(`articles/${p_extra_3_url}`, p_extra_3.name, {
                    cacheControl: '3600',
                    upsert: true,
                });
            if (pExtra3Error) throw pExtra3Error;
        }

        setActiveStep(0);

        if (product_type_options[0].label === productData.type) {
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
                    product_id: productId,
                })
                .eq('product_id', product.id)
                .select()
                .single();

            if (beerError) throw beerError;

            if (!beerData) throw new Error('No data returned from supabase');

            const beerId = beerData.product_id;

            // Inventory - Stock
            const stock: IProductInventory = {
                product_id: productId,
                quantity: stock_quantity,
                limit_notification: stock_limit_notification,
            };

            const { data: product_inventory, error: stockError } =
                await supabase
                    .from('product_inventory')
                    .update(stock)
                    .eq('product_id', product.id);
            if (stockError) throw stockError;

            if (product_inventory) {
                productData.product_inventory = product_inventory;
            }

            // Packs
            if (packs.length > 0) {
                packs.map(async (pack: IProductPack) => {
                    pack.randomUUID = isValidObject(pack.randomUUID)
                        ? pack.randomUUID
                        : uuid();

                    const { error: packsError } = await supabase
                        .from('product_packs')
                        .upsert({
                            product_id: productId,
                            quantity: pack.quantity,
                            price: pack.price,
                            name: pack.name,
                            img_url: pack.img_url.name,
                            randomUUID: pack.randomUUID,
                        })
                        .eq('product_id', product.id);

                    if (packsError) throw packsError;

                    // Upd Img to Store
                    // check if image selected in file input is not empty and is an image
                    if (pack.img_url) {
                        const { error: storagePacksError } =
                            await supabase.storage
                                .from('products')
                                .upload(
                                    `articles/${productId}/packs/${
                                        pack.randomUUID
                                    }.${getFileExtensionByName(
                                        pack.img_url.name,
                                    )}`,
                                    pack.img_url,
                                    {
                                        cacheControl: '3600',
                                        upsert: true,
                                    },
                                );

                        if (storagePacksError) throw storagePacksError;
                    }
                });

                productData.product_packs = packs;
            }

            // Awards
            if (
                awards &&
                isNotEmptyArray(awards) &&
                isValidObject(awards[0].img_url)
            ) {
                awards.map(async (award: IAward) => {
                    if (award.img_url.length > 0) {
                        const file = award.img_url[0];
                        const productFileUrl = file.name;
                        const { data, error: awardsError } = await supabase
                            .from('awards')
                            .update({
                                product_id: beerId,
                                name: award.name,
                                description: award.description,
                                year: award.year,
                                img_url: productFileUrl,
                            })
                            .eq('product_id', product.id);

                        if (awardsError) throw awardsError;
                        if (!data)
                            throw new Error(
                                'No data returned from awards update',
                            );

                        const awards = data as IAward[];
                        productData.awards = awards;

                        const { error: storageAwardsError } =
                            await supabase.storage
                                .from('products')
                                .upload(`awards/${productFileUrl}`, file, {
                                    cacheControl: '3600',
                                    upsert: false,
                                });
                        if (storageAwardsError) throw storageAwardsError;
                    }
                });
            }
        }
    };

    const updateProductMutation = useMutation({
        mutationKey: ['updateProduct'],
        mutationFn: handleUpdateProduct,
        onMutate: () => {
            setIsSubmitting(true);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productList'] });
            handleEditShowModal(false);
            setIsSubmitting(false);
            reset();
        },
        onError: (error: any) => {
            console.error(error);
            setIsSubmitting(false);
        },
    });

    const onSubmit = (formValues: ModalUpdateProductFormData) => {
        try {
            updateProductMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }

        handleEditShowModal(false);
    };

    return (
        <ModalWithForm
            showBtn={false}
            showModal={showModal}
            setShowModal={handleEditShowModal}
            title={'save_product'}
            btnTitle={'save_product'}
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
                        <p className="text-slate-500 my-4 text-lg leading-relaxed">
                            {t('modal_product_description')}
                        </p>

                        {activeStep === 0 ? (
                            <UpdateProductInfoSection form={form} />
                        ) : activeStep === 1 ? (
                            <UpdateMultimediaSection form={form} />
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
