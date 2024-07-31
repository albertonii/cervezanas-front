'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { MultimediaSection } from '@/app/[locale]/components/products/MultimediaSection';
import {
    IModalAddProductPack,
    ModalAddProductAwardFormData,
    ModalAddProductFormData,
} from '@/lib//types/types';
import { ProductSummary } from '@/app/[locale]/components/products/ProductSummary';
import { isFileEmpty, isNotEmptyArray } from '@/utils/utils';
import { useMutation, useQueryClient } from 'react-query';
import { ProductStepper } from '@/app/[locale]/components/products/ProductStepper';
import { ProductInfoSection } from '@/app/[locale]/components/products/ProductInfoSection';
import { useAppContext } from '@/app/context/AppContext';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { AwardsSection } from '@/app/[locale]/components/products/AwardsSection';
import { Type } from '@/lib//productEnum';
import { faBox } from '@fortawesome/free-solid-svg-icons';

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
    description: z
        .string()
        .max(2500, {
            message: 'errors.error_2500_max_length',
        })
        .optional(),
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
    p_principal: z.custom<File>().superRefine(validateFile).optional(),
    p_back: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_1: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_2: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_3: z.custom<File>().superRefine(validateFile).optional(),

    is_public: z.boolean(),
    volume: z.number().min(0, { message: 'errors.input_number_min_0' }),
    weight: z.number().min(0, { message: 'errors.input_number_min_0' }),
    format: z
        .string()
        .min(2, { message: 'errors.input_number__min_2' })
        .max(50, {
            message: 'errors.error_50_number_max_length',
        }),
    stock_quantity: z.number().min(0, { message: 'errors.input_number_min_0' }),
    stock_limit_notification: z
        .number()
        .min(0, { message: 'errors.input_required' }),
    category: z
        .string()
        .min(2, { message: 'errors.input_number__min_2' })
        .max(50, {
            message: 'errors.error_50_number_max_length',
        }),
    packs: z.array(
        z.object({
            id: z.string(),
            quantity: z
                .number()
                .min(0, { message: 'errors.input_number_min_0' }),
            price: z.number().min(0, { message: 'errors.input_number_min_0' }),
            name: z
                .string()
                .min(2, { message: 'errors.input_number__min_2' })
                .max(100, {
                    message: 'errors.error_100_number_max_length',
                }),
            img_url: z.custom<File>().superRefine(validateFile).optional(),
        }),
    ),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddProductModal() {
    const t = useTranslations();

    const { customizeSettings } = useAppContext();

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
            type: Type.BEER,
            is_gluten: false,
            weight: 330,
            intensity: 4,
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
            ingredients,
            pairing,
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
        formData.append('beer.is_gluten', is_gluten.toString());
        formData.append('beer.volume', volume.toString());
        formData.append('beer.format', format);
        formData.append('beer.ibu', ibu.toString());
        formData.append('beer.ingredients', ingredients?.join(',') ?? '');
        formData.append('beer.pairing', pairing ?? '');

        // Stock
        formData.append('stock.quantity', stock_quantity.toString());
        formData.append(
            'stock.limit_notification',
            stock_limit_notification.toString(),
        );

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

        // Multimedia
        if (p_principal && !isFileEmpty(p_principal)) {
            formData.append('p_principal', p_principal);
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

        // CORS
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST');
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        );

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: headers,
        });

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
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={'add_product'}
            btnTitle={'save'}
            triggerBtnTitle={'add_product'}
            description={''}
            classIcon={''}
            icon={faBox}
            classContainer={`${isLoading && ' opacity-75'}`}
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
