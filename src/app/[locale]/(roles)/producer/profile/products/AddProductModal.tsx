'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { Type } from '@/lib//productEnum';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useAppContext } from '@/app/context/AppContext';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { isNotEmptyArray } from '@/utils/utils';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { AwardsSection } from '@/app/[locale]/components/products/AwardsSection';
import { ProductSummary } from '@/app/[locale]/components/products/ProductSummary';
import { ProductStepper } from '@/app/[locale]/components/products/ProductStepper';
import { MultimediaSection } from '@/app/[locale]/components/products/MultimediaSection';
import { ProductInfoSection } from '@/app/[locale]/components/products/ProductInfoSection';
import {
    IModalAddProductPack,
    ModalAddProductAwardFormData,
    ModalAddProductFormData,
} from '@/lib/types/types';
import ProductHeaderDescription from '@/app/[locale]/components/modals/ProductHeaderDescription';
import ProductFooterDescription from '@/app/[locale]/components/modals/ProductFooterDescription';
import { useFileUpload } from '@/app/context/ProductFileUploadContext';
import axios from 'axios';
import Spinner from '@/app/[locale]/components/ui/Spinner';

const ModalWithForm = dynamic(
    () => import('@/app/[locale]/components/modals/ModalWithForm'),
    { ssr: false },
);

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

const schema: ZodType<ModalAddProductFormData> = z.object({
    name: z.string().min(2, { message: 'errors.min_2_characters' }).max(50, {
        message: 'errors.error_50_number_max_length',
    }),
    description: z.string().max(320, {
        message: 'errors.error_320_max_length',
    }),
    price: z.number().min(0, { message: 'errors.input_number_min_0' }),
    fermentation: z.number().min(0, { message: 'errors.input_number_min_0' }),
    color: z.number().min(0, { message: 'errors.input_number_min_0' }),
    intensity: z.number().min(0, { message: 'errors.input_number_min_0' }),
    ibu: z.number().min(0, { message: 'errors.input_number_min_0' }),
    aroma: z.number().min(0, { message: 'errors.input_number_min_0' }),
    family: z.number().min(0, { message: 'errors.input_number_min_0' }),
    is_gluten: z.coerce.boolean(),
    type: z.string().min(2, { message: 'errors.input_number__min_2' }).max(50, {
        message: 'errors.input_required',
    }),
    ingredients: z.array(z.string()).optional(),
    pairing: z.string().optional(),
    recommended_glass: z
        .number()
        .min(0, { message: 'errors.input_number_min_0' })
        .optional(),
    brewers_note: z.string().optional(),
    og: z.number().nullable().optional(),
    fg: z.number().nullable().optional(),
    srm: z.number().nullable().optional(),
    ebc: z.number().nullable().optional(),
    hops_type: z.string().optional(),
    malt_type: z.string().optional(),
    consumption_temperature: z.number().nullable().optional(),
    awards: z.array(
        z.object({
            name: z
                .string()
                .min(2, { message: 'errors.input_char_min_2' })
                .max(150, {
                    message: 'errors.input_char_max_150',
                }),
            description: z
                .string()
                .min(2, { message: 'errors.input_char_min_2' })
                .max(500, {
                    message: 'errors.input_char_max_500',
                }),
            year: z
                .number()
                .min(1900, { message: 'errors.input_number_min_1900' })
                .max(2030, {
                    message: 'errors.input_number_max_2030',
                }),
            img_url: z.custom<File>().superRefine(validateFile).optional(),
        }),
    ),
    packs: z.array(
        z.object({
            id: z.string(),
            quantity: z
                .number()
                .min(0, { message: 'errors.input_number_min_0' }),
            price: z.number().min(0, { message: 'errors.input_number_min_0' }),
            name: z
                .string()
                .min(2, { message: 'errors.input_char_min_2' })
                .max(100, {
                    message: 'errors.input_char_max_100',
                }),
            img_url: z.custom<File>().superRefine(validateFile).optional(),
        }),
    ),
    is_public: z.boolean(),
    is_available: z.boolean(),
    is_for_event: z.boolean(),
    volume: z.number().min(0, { message: 'errors.input_number_min_0' }),
    weight: z.number().min(0, { message: 'errors.input_number_min_0' }),
    format: z
        .string()
        .min(2, { message: 'errors.input_number__min_2' })
        .max(50, {
            message: 'errors.error_50_number_max_length',
        }),
    // stock_quantity: z.number().min(0, { message: 'errors.input_number_min_0' }),
    // stock_limit_notification: z
    //     .number()
    //     .min(0, { message: 'errors.input_required' }),
    category: z
        .string()
        .min(2, { message: 'errors.input_number__min_2' })
        .max(50, {
            message: 'errors.error_50_number_max_length',
        }),
    brewery_id: z.string().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddProductModal() {
    const t = useTranslations();

    const { customizeSettings } = useAppContext();

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [activeStep, setActiveStep] = useState<number>(0);

    const { handleMessage } = useMessage();
    const { files, clearFiles } = useFileUpload();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSetActiveStep = (value: number) => {
        setActiveStep(value);
    };

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            awards: [],
            type: Type.BEER,
            is_gluten: false,
            weight: 330,
            intensity: 4.3,
            ibu: 30,
            price: 0,
            category: Type.BEER,
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const queryClient = useQueryClient();

    useEffect(() => {
        if (showModal) {
            clearFiles();
        }
    }, [showModal]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.info('Errores detectados creando un producto', errors);
        }
    }, [errors]);

    const handleInsertProduct = async (form: ValidationSchema) => {
        setIsLoading(true);

        const {
            // campaign,
            fermentation,
            color,
            intensity,
            aroma,
            family,
            is_gluten,
            type,
            awards,
            is_public,
            is_available,
            is_for_event,
            name,
            description,
            price,
            volume,
            weight,
            format,
            // stock_quantity,
            // stock_limit_notification,
            packs,
            category,
            ibu,
            ingredients,
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
            brewery_id,
        } = form;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products`;

        const formData = new FormData();

        // Agregar archivos al FormData
        files?.forEach((object, index) => {
            if (object.file) {
                formData.append('media_files', object.file);
                formData.append(
                    `isMain_${index}`,
                    object.isMain ? 'true' : 'false',
                );
            }
        });

        clearFiles();

        // Basic
        formData.append('name', name);
        formData.append('description', description ?? '');
        formData.append('type', type);
        formData.append('price', price.toString());
        formData.append('is_public', is_public.toString());
        formData.append('is_available', is_available.toString());
        formData.append('is_for_event', is_for_event.toString());
        formData.append('category', category);
        formData.append('weight', weight.toString());

        // Beer Attributes
        formData.append('beer.intensity', intensity.toString());
        formData.append('beer.fermentation', fermentation.toString());
        formData.append('beer.color', color.toString());
        formData.append('beer.aroma', aroma.toString());
        formData.append('beer.family', family.toString());
        formData.append('beer.is_gluten', is_gluten.toString());
        formData.append('beer.volume', volume.toString());
        formData.append('beer.format', format);
        formData.append('beer.ibu', ibu.toString());

        // Technical Data
        formData.append(
            'technical_data.ingredients',
            ingredients?.join(',') ?? '',
        );
        formData.append('technical_data.pairing', pairing ?? '');
        formData.append(
            'technical_data.recommended_glass',
            recommended_glass?.toString() ?? '',
        );
        formData.append('technical_data.brewers_note', brewers_note ?? '');
        formData.append('technical_data.og', og?.toString() ?? '');
        formData.append('technical_data.fg', fg?.toString() ?? '');
        formData.append('technical_data.srm', srm?.toString() ?? '');
        formData.append('technical_data.ebc', ebc?.toString() ?? '');
        formData.append('technical_data.hops_type', hops_type ?? '');
        formData.append('technical_data.malt_type', malt_type ?? '');
        formData.append(
            'technical_data.consumption_temperature',
            consumption_temperature?.toString() ?? '',
        );

        // Brewery
        if (brewery_id) {
            formData.append('brewery_id', brewery_id);
        }

        // Stock
        // formData.append('stock.quantity', stock_quantity.toString());
        // formData.append(
        //     'stock.limit_notification',
        //     stock_limit_notification.toString(),
        // );

        // Packs
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

        // CORS

        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers':
                    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            },
        });

        // const response = await fetch(url, {
        //     method: 'POST',
        //     body: formData,
        //     headers: headers,
        // });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.insert_product',
            });

            setIsLoading(true);

            return;
        }

        if (response.status === 200) {
            handleMessage({
                type: 'success',
                message: 'success.insert_product',
            });

            setShowModal(false);
            setIsLoading(false);
            queryClient.invalidateQueries('productList');

            reset();
            setActiveStep(0);
        }
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
        return new Promise<void>((resolve, reject) => {
            insertProductMutation.mutate(formValues, {
                onSuccess: () => {
                    resolve();
                },
                onError: (error) => {
                    reject(error);
                },
            });
        });
    };

    return (
        <FormProvider {...form}>
            {/* Envolver todo en FormProvider */}
            <ModalWithForm
                showBtn={true}
                showModal={showModal}
                setShowModal={setShowModal}
                title={'add_product'}
                btnTitle={'add_new_product'}
                triggerBtnTitle={'add_product'}
                description={''}
                icon={faBox}
                classContainer={`${isLoading && ' opacity-75'}`}
                handler={() => {}}
                handlerClose={() => {
                    setActiveStep(0);
                    setShowModal(false);
                }}
                form={form}
                showTriggerBtn={false}
                showCancelBtn={false}
            >
                {isLoading ? (
                    <div className="flex justify-center items-center h-[50vh]">
                        <Spinner size="xxLarge" color="beer-blonde" />
                    </div>
                ) : (
                    <ProductStepper
                        activeStep={activeStep}
                        handleSetActiveStep={handleSetActiveStep}
                        isSubmitting={isSubmitting}
                        btnTitle={'add_new_product'}
                        handler={handleSubmit(onSubmit)}
                    >
                        <>
                            <ProductHeaderDescription />

                            {activeStep === 0 ? (
                                <ProductInfoSection
                                    form={form}
                                    customizeSettings={customizeSettings}
                                />
                            ) : activeStep === 1 ? (
                                <MultimediaSection />
                            ) : activeStep === 2 ? (
                                <AwardsSection form={form} />
                            ) : (
                                <ProductSummary form={form} />
                            )}

                            <ProductFooterDescription />
                        </>
                    </ProductStepper>
                )}
            </ModalWithForm>
        </FormProvider>
    );
}
