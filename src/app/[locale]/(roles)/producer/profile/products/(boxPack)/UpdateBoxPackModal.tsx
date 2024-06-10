'use client';

import dynamic from 'next/dynamic';
import useBoxPackStore from '../../../../../../store/boxPackStore';
import UpdateBoxProductSlotsSection from '../../../../../components/products/boxPack/UpdateBoxProductSlotsSection';
import React, { useState, useEffect, ComponentProps } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IProduct } from '../../../../../../../lib/types/types';
import { useMessage } from '../../../../../components/message/useMessage';
import { ModalUpdateBoxPackFormData } from '../../../../../../../lib/types/product';
import { BoxPackStepper } from '../../../../../components/products/boxPack/BoxPackStepper';
import { UpdateBoxPackInfoSection } from '../../../../../components/products/boxPack/UpdateBoxPackInfoSection';
import { UpdateBoxMultimediaSection } from '../../../../../components/products/boxPack/UpdateBoxMultimediaSection';
import { UpdateBoxSummary } from '../../../../../components/products/boxPack/UpdateBoxSummary';

const ModalWithForm = dynamic(
    () => import('../../../../../components/modals/ModalWithForm'),
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

const schema: ZodType<ModalUpdateBoxPackFormData> = z.object({
    slots_per_box: z.number().min(1, 'Slots must be greater than 0'),
    is_public: z.boolean(),
    name: z.string().nonempty('Name is required'),
    description: z.string().nonempty('Description is required'),
    price: z.number().min(0, 'Price must be greater than 0'),
    weight: z.number().min(0, 'Weight must be greater than 0'),
    p_principal: z.custom<File>().superRefine(validateFile).optional(),
    p_back: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_1: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_2: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_3: z.custom<File>().superRefine(validateFile).optional(),
    box_pack_items: z.array(
        z.object({
            id: z.string(),
            box_pack_id: z.string(),
            product_id: z.string(),
            quantity: z.number().min(1, 'Quantity must be greater than 0'),
            slots_per_product: z
                .number()
                .min(1, 'Slots must be greater than 0'),
        }),
    ),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    showModal: boolean;
    handleEditShowModal: ComponentProps<any>;
    product: IProduct;
}

export function UpdateBoxPackModal({
    showModal,
    handleEditShowModal,
    product,
}: Props) {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const { clear, boxPack } = useBoxPackStore();
    const { handleMessage } = useMessage();

    const { assignBoxPack } = useBoxPackStore();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            is_public: product.is_public,
            name: product.name,
            description: product.description,
            price: product.price,
            weight: product.weight,
            slots_per_box: product.box_packs?.[0].slots_per_box ?? 0,
            p_principal: product.product_multimedia?.p_principal,
            p_back: product.product_multimedia?.p_back,
            p_extra_1: product.product_multimedia?.p_extra_1,
            p_extra_2: product.product_multimedia?.p_extra_2,
            p_extra_3: product.product_multimedia?.p_extra_3,
            box_pack_items: product.box_packs?.[0].box_pack_items,
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors, dirtyFields },
    } = form;

    const queryClient = useQueryClient();

    useEffect(() => {
        if (product.box_packs) assignBoxPack(product.box_packs[0]);
    }, [product]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.info('Errores detectados creando un pack', errors);
        }
    }, [errors]);

    const handleSetActiveStep = (value: number) => {
        setActiveStep(value);
    };

    const updateBasicSection = async (formValues: ValidationSchema) => {
        const { name, description, price, weight, is_public, slots_per_box } =
            formValues;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/box_packs/details`;

        const formData = new FormData();

        formData.set('product_id', product.id);
        formData.set('name', name);
        formData.set('description', description);
        formData.set('price', price.toString());
        formData.set('weight', weight.toString());
        formData.set('is_public', is_public.toString());
        formData.set('slots_per_box', slots_per_box.toString());

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'Error updating box pack',
            });

            setIsLoading(false);
            return;
        }

        queryClient.invalidateQueries('productList');
        // handleEditShowModal(false);
        setIsLoading(false);
    };

    const updateSlotsSection = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/box_packs/box_slots`;

        const formData = new FormData();

        const boxPackItems = boxPack.boxPackItems;

        formData.set('box_pack_id', product.box_packs![0].id);
        formData.set('box_packs', JSON.stringify(boxPackItems));

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'Error updating box pack',
            });

            setIsLoading(false);
            return;
        }

        queryClient.invalidateQueries('productList');
        // handleEditShowModal(false);
        setIsLoading(false);
    };

    const handleUpdateBoxPack = async (form: ValidationSchema) => {
        if (
            dirtyFields.name ||
            dirtyFields.description ||
            dirtyFields.price ||
            dirtyFields.weight ||
            dirtyFields.is_public ||
            dirtyFields.slots_per_box
        ) {
            await updateBasicSection(form);
        }

        if (boxPack.is_box_pack_dirty) {
            await updateSlotsSection();
        }

        handleMessage({
            type: 'success',
            message: `${t('success.boxpack_updated')}`,
        });

        clear();
        reset();
    };

    const updateProductMutation = useMutation({
        mutationKey: ['updateBoxPack'],
        mutationFn: handleUpdateBoxPack,
        onMutate: () => {
            setIsSubmitting(true);
            setIsLoading(true);
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
        formValues: ModalUpdateBoxPackFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            updateProductMutation.mutate(formValues, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={handleEditShowModal}
            title={'update_box_pack'}
            btnTitle={'save'}
            description={''}
            classIcon={''}
            classContainer={`${isLoading && ' opacity-75'}`}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => {
                setActiveStep(0);
                handleEditShowModal(false);
            }}
            form={form}
        >
            <form>
                <BoxPackStepper
                    activeStep={activeStep}
                    handleSetActiveStep={handleSetActiveStep}
                    isSubmitting={isSubmitting}
                >
                    <>
                        <p className="text-slate-500 my-4 sm:text-lg leading-relaxed">
                            {t('modal_product_description')}
                        </p>

                        {activeStep === 0 ? (
                            <UpdateBoxPackInfoSection form={form} />
                        ) : activeStep === 1 ? (
                            <UpdateBoxProductSlotsSection form={form} />
                        ) : activeStep === 2 ? (
                            <UpdateBoxMultimediaSection
                                form={form}
                                productId={product.id}
                            />
                        ) : (
                            <UpdateBoxSummary form={form} />
                        )}
                    </>
                </BoxPackStepper>
            </form>
        </ModalWithForm>
    );
}
