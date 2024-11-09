'use client';

import axios from 'axios';
import dynamic from 'next/dynamic';
import useBoxPackStore from '@/app/store//boxPackStore';
import ProductHeaderDescription from '@/app/[locale]/components/modals/ProductHeaderDescription';
import UpdateBoxProductSlotsSection from '@/app/[locale]/components/products/boxPack/UpdateBoxProductSlotsSection';
import React, { useState, useEffect, ComponentProps } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { IProduct } from '@/lib/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { ModalUpdateBoxPackFormData } from '@/lib/types/product';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { BoxPackStepper } from '@/app/[locale]/components/products/boxPack/BoxPackStepper';
import { UpdateBoxSummary } from '@/app/[locale]/components/products/boxPack/UpdateBoxSummary';
import { UpdateBoxPackInfoSection } from '@/app/[locale]/components/products/boxPack/UpdateBoxPackInfoSection';
import { UpdateBoxMultimediaSection } from '@/app/[locale]/components/products/boxPack/UpdateBoxMultimediaSection';
import { useFileUpload } from '@/app/context/ProductFileUploadContext';

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

const schema: ZodType<ModalUpdateBoxPackFormData> = z.object({
    slots_per_box: z.number().min(1, 'errors.input_number_min_0'),
    is_public: z.boolean(),
    is_available: z.boolean(),
    name: z.string().nonempty('errors.input_required'),
    description: z.string().nonempty('errors.input_required'),
    price: z.number().min(0, 'errors.input_number_min_0'),
    weight: z.number().min(0, 'errors.input_number_min_0'),
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
            quantity: z.number().min(1, 'errors.input_number_min_1'),
            slots_per_product: z.number().min(1, 'errors.input_number_min_1'),
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
    const { clear, assignBoxPack, boxPack } = useBoxPackStore();
    const { handleMessage } = useMessage();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { clearFiles, setFiles, files, filesToDelete } = useFileUpload();

    const transformedBoxPackItems =
        product.box_packs && product.box_packs.length > 0
            ? product.box_packs?.[0].box_pack_items?.map((item) => ({
                  id: item.id,
                  box_pack_id: item.box_pack_id,
                  product_id: item.product_id,
                  quantity: item.quantity,
                  slots_per_product: item.slots_per_product,
                  products: item.products
                      ? {
                            id: item.products.id,
                            created_at: item.products.created_at,
                            name: item.products.name,
                            description: item.products.description,
                            type: item.products.type,
                            is_public: item.products.is_public,
                            is_available: item.products.is_available,
                            discount_percent: item.products.discount_percent,
                            weight: item.products.weight,
                            // promo_code: item.products.promo_code,
                            price: item.products.price,
                            campaign_id: item.products.campaign_id,
                            is_archived: item.products.is_archived,
                            category: item.products.category,
                            is_monthly: item.products.is_monthly,
                            owner_id: item.products.owner_id,
                            beers: item.products.beers
                                ? {
                                      product_id:
                                          item.products.beers.product_id,
                                      created_at:
                                          item.products.beers.created_at,
                                      category: item.products.beers.category,
                                      fermentation:
                                          item.products.beers.fermentation,
                                      color: item.products.beers.color,
                                      family: item.products.beers.family,
                                      pairing: Array.isArray(
                                          item.products.beers.pairing,
                                      )
                                          ? item.products.beers.pairing
                                          : [item.products.beers.pairing], // Asegúrate de que pairing sea un array
                                      brewers_note:
                                          item.products.beers.brewers_note,
                                  }
                                : undefined,
                        }
                      : undefined,
              }))
            : [];

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            is_public: product.is_public,
            is_available: product.is_available,
            name: product.name,
            description: product.description,
            price: product.price,
            weight: product.weight,
            slots_per_box: product.box_packs?.[0]?.slots_per_box ?? 0,
            box_pack_items: transformedBoxPackItems,
            media_files: product.product_media?.map((media) => ({
                id: media.id,
                product_id: media.product_id,
                type: media.type,
                url: media.url,
                alt_text: media.alt_text,
                is_primary: media.is_primary,
            })),
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
        if (product.product_media) {
            clearFiles();

            // Mapea los archivos existentes del producto
            const initialFiles =
                product.product_media?.map((media) => ({
                    id: media.id,
                    type: media.type.startsWith('image/') ? 'image' : 'video',
                    isMain: media.is_primary,
                    isExisting: true,
                    url: media.url,
                    // No necesitamos 'file' aquí para archivos existentes
                })) || [];

            setFiles(initialFiles);
        }
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
        const {
            name,
            description,
            price,
            weight,
            is_public,
            is_available,
            slots_per_box,
        } = formValues;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/box_packs/details`;

        const formData = new FormData();

        formData.set('product_id', product.id);
        formData.set('name', name);
        formData.set('description', description);
        formData.set('price', price.toString());
        formData.set('weight', weight.toString());
        formData.set('is_public', is_public.toString());
        formData.set('is_available', is_available.toString());
        formData.set('slots_per_box', slots_per_box.toString());

        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Asegura que axios envíe correctamente formData
            },
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
        clear();

        setIsLoading(false);
    };

    const updateSlotsSection = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/box_packs/box_slots`;

        const formData = new FormData();

        const boxPackItems = boxPack.boxPackItems;

        formData.set('box_pack_id', product.box_packs![0].id);
        formData.set('box_packs', JSON.stringify(boxPackItems));

        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Asegura que axios envíe correctamente formData
            },
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
        clear();
        setIsLoading(false);
    };

    const updateMediaSection = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/box_packs/multimedia`;

        const formData = new FormData();
        formData.append('product_id', product.id);

        // Manejar archivos nuevos
        files
            .filter((f) => !f.isExisting)
            .forEach((fileObj, index) => {
                formData.append('media_files', fileObj.file!);
                formData.append(
                    `isMain_${index}`,
                    fileObj.isMain ? 'true' : 'false',
                );
            });

        // Manejar archivos existentes (actualizar isMain si es necesario)
        files
            .filter((f) => f.isExisting)
            .forEach((fileObj, index) => {
                formData.append(`existingMedia[${index}][id]`, fileObj.id!);
                formData.append(
                    `existingMedia[${index}][isMain]`,
                    fileObj.isMain ? 'true' : 'false',
                );
            });

        // Manejar archivos a eliminar
        filesToDelete.forEach((fileObj, index) => {
            formData.append(`filesToDelete[${index}][id]`, fileObj.id!);
            formData.append(`filesToDelete[${index}][url]`, fileObj.url!);
        });

        console.log('formData', formData.get('existingMedia[0]'));

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.update_multimedia',
            });
            return;
        }

        queryClient.invalidateQueries('productList');
    };

    const handleUpdateBoxPack = async (form: ValidationSchema) => {
        if (
            dirtyFields.name ||
            dirtyFields.description ||
            dirtyFields.price ||
            dirtyFields.weight ||
            dirtyFields.is_public ||
            dirtyFields.is_available ||
            dirtyFields.slots_per_box
        ) {
            await updateBasicSection(form);
        }

        if (boxPack.is_box_pack_dirty) {
            await updateSlotsSection();
        }

        await updateMediaSection();

        handleMessage({
            type: 'success',
            message: 'success.boxpack_updated',
        });

        handleEditShowModal(false);
        queryClient.removeQueries('productList');

        reset();
        setIsLoading(false);
    };

    const updateProductMutation = useMutation({
        mutationKey: ['updateBoxPack'],
        mutationFn: handleUpdateBoxPack,
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
            classContainer={`${isLoading && ' opacity-75'}`}
            handler={() => {}}
            handlerClose={() => {
                setActiveStep(0);
                handleEditShowModal(false);
            }}
            form={form}
            showTriggerBtn={false}
            showCancelBtn={false}
        >
            <BoxPackStepper
                activeStep={activeStep}
                handleSetActiveStep={handleSetActiveStep}
                isSubmitting={isSubmitting}
                handler={handleSubmit(onSubmit)}
                btnTitle={'update_box_pack'}
            >
                <>
                    <ProductHeaderDescription />

                    {activeStep === 0 ? (
                        <UpdateBoxPackInfoSection form={form} />
                    ) : activeStep === 1 ? (
                        <UpdateBoxProductSlotsSection form={form} />
                    ) : activeStep === 2 ? (
                        <UpdateBoxMultimediaSection />
                    ) : (
                        <UpdateBoxSummary form={form} />
                    )}
                </>
            </BoxPackStepper>
        </ModalWithForm>
    );
}
