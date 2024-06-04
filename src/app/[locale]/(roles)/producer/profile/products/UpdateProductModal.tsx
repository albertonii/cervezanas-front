'use client';

import ModalWithForm from '../../../../components/modals/ModalWithForm';
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
import { isNotEmptyArray, isValidObject } from '../../../../../../utils/utils';
import { UpdateProductSummary } from './UpdateProductSummary';
import { useAppContext } from '../../../../../context/AppContext';
import { UpdateAwardsSection } from './UpdateAwardsSection';
import { ProductStepper } from '../../../../components/products/ProductStepper';
import { useMessage } from '../../../../components/message/useMessage';

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = [
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
];
const MB_BYTES = 1000000; // Number of bytes in a megabyte.

const validateFile = (f: File, ctx: any) => {
    if (!f) return;
    if (typeof f === 'string') return;

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
            message: `The file must not be larger than ${3 * MB_BYTES} bytes: ${
                f.size
            }`,
            maximum: 3 * MB_BYTES,
            inclusive: true,
        });
    }
};

const schema: ZodType<ModalUpdateProductFormData> = z.object({
    product_id: z.string(),
    name: z.string().min(2, { message: 'errors.input_min_2' }).max(50, {
        message: 'errors.error_50_number_max_length',
    }),
    description: z.string().max(2500, {
        message: 'errors.error_2500_max_length',
    }),
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
            img_url: z.custom<File>().superRefine(validateFile).or(z.string()),
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
            img_url: z.custom<File>().superRefine(validateFile).or(z.string()),
            prev_img_url: z.string().optional(),
            product_id: z.string(),
        }),
    ),
    p_principal: z.custom<File>().superRefine(validateFile).optional(),
    p_back: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_1: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_2: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_3: z.custom<File>().superRefine(validateFile).optional(),
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
    const { supabase } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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
            p_principal: product.product_multimedia?.p_principal,
            p_back: product.product_multimedia?.p_back,
            p_extra_1: product.product_multimedia?.p_extra_1,
            p_extra_2: product.product_multimedia?.p_extra_2,
            p_extra_3: product.product_multimedia?.p_extra_3,
            packs: product.product_packs?.map((pack) => {
                return {
                    id: pack.id,
                    img_url: pack.img_url,
                    prev_img_url: pack.img_url,
                    name: pack.name,
                    price: pack.price,
                    product_id: pack.product_id,
                    quantity: pack.quantity,
                    randomUUID: pack.randomUUID,
                };
            }),
            awards: product.awards?.map((award) => ({
                name: award.name,
                description: award.description,
                year: award.year,
                img_url: award.img_url,
            })),

            // campaign: "-",
        },
    });

    const {
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
    } = form;

    const queryClient = useQueryClient();

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.info('ERROR EN UPDATE PRODUCT: ', errors);
        }
    }, [errors]);

    const generateUUID = () => {
        return uuidv4();
    };

    const updateBasicSection = async (formValues: ValidationSchema) => {
        setIsLoading(true);

        const { name, description, type, price, is_public, weight } =
            formValues;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/details`;

        const formData = new FormData();

        formData.append('name', name);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('price', price.toString());
        formData.append('is_public', is_public.toString());
        formData.append('weight', weight.toString());
        formData.append('product_id', product.id);

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: t('error_update_product'),
            });

            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        queryClient.invalidateQueries('productList');
    };

    const updateBeerSection = async (formValues: ValidationSchema) => {
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
            ibu,
        } = formValues;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/beer_attributes`;

        const formData = new FormData();

        formData.append('intensity', intensity.toString());
        formData.append('fermentation', fermentation.toString());
        formData.append('color', color.toString());
        formData.append('aroma', aroma.toString());
        formData.append('family', family.toString());
        formData.append('origin', origin.toString());
        formData.append('era', era.toString());
        formData.append('is_gluten', is_gluten.toString());
        formData.append('volume', volume.toString());
        formData.append('format', format);
        formData.append('ibu', ibu.toString());

        formData.append('product_id', product.id);

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: t('error_update_beer_attributes'),
            });

            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        queryClient.invalidateQueries('productList');
    };

    const updateInventory = async (formValues: ValidationSchema) => {
        setIsLoading(true);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/inventory`;

        const formData = new FormData();

        formData.append('stock_quantity', formValues.stock_quantity.toString());
        formData.append(
            'stock_limit_notification',
            formValues.stock_limit_notification.toString(),
        );
        formData.append('product_id', formValues.product_id);

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: t('error_update_stock'),
            });

            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        queryClient.invalidateQueries('productList');
    };

    const updatePacks = async (packs: ModalUpdateProductPackFormData[]) => {
        const productId = product.id;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/product_packs`;

        const formData = new FormData();

        packs.map((pack: ModalUpdateProductPackFormData, index: number) => {
            formData.append(`packs[${index}].id`, pack.id ?? '');
            formData.append(
                `packs[${index}].quantity`,
                pack.quantity.toString(),
            );
            formData.append(`packs[${index}].price`, pack.price.toString());
            formData.append(`packs[${index}].name`, pack.name);
            formData.append(`packs[${index}].img_url`, pack.img_url);
            formData.append(
                `packs[${index}].prev_img_url`,
                pack.prev_img_url ?? pack.img_url,
            );
            formData.append(
                `packs[${index}].product_id`,
                pack.product_id ?? '',
            );
        });

        formData.append('packs_size', packs.length.toString());
        formData.append('product_id', productId);

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: t('error_update_packs'),
            });

            return;
        }

        queryClient.invalidateQueries('productList');
    };

    const updateAwards = async (
        awards: ModalUpdateProductAwardFormData[],
        randomUUID: string,
    ) => {
        const formData = new FormData();

        formData.append('product_id', product.id);
        formData.append('random_uuid', randomUUID);

        awards.map((award, index) => {
            formData.append(`awards[${index}].name`, award.name);
            formData.append(`awards[${index}].description`, award.description);
            formData.append(`awards[${index}].year`, award.year.toString());
            formData.append(`awards[${index}].img_url`, award.img_url);
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

        // Basic Info
        if (
            dirtyFields.name ||
            dirtyFields.description ||
            dirtyFields.type ||
            dirtyFields.price ||
            dirtyFields.is_public ||
            dirtyFields.weight
        ) {
            await updateBasicSection(formValues);
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
                await updateBeerSection(formValues);
            }

            if (
                dirtyFields.stock_quantity ||
                dirtyFields.stock_limit_notification
            ) {
                await updateInventory(formValues);
            }

            // Packs
            if (dirtyFields.packs && isNotEmptyArray(packs)) {
                await updatePacks(packs);
            }

            // Awards
            if (dirtyFields.awards && awards && isNotEmptyArray(awards)) {
                await updateAwards(awards, randomUUID);
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
        if (isDirty) {
            return new Promise<void>((resolve, reject) => {
                updateProductMutation.mutate(formValues, {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (error) => {
                        reject(error);
                    },
                });
            });
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
            classContainer={`${isLoading && ' opacity-75'}`}
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
                            <UpdateProductInfoSection
                                form={form}
                                customizeSettings={customizeSettings}
                            />
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
