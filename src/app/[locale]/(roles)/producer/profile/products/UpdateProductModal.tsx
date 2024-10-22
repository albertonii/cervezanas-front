'use client';

import axios from 'axios';
import ModalWithForm from '@/app/[locale]/components/modals/ModalWithForm';
import ProductHeaderDescription from '@/app/[locale]/components/modals/ProductHeaderDescription';
import React, { ComponentProps, useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import { Type } from '@/lib//productEnum';
import { generateUUID } from '@/lib//actions';
import { isNotEmptyArray } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppContext } from '@/app/context/AppContext';
import { useMutation, useQueryClient } from 'react-query';
import { UpdateAwardsSection } from './UpdateAwardsSection';
import { UpdateMultimediaSection } from './UpdateMultimediaSection';
import { useFileUpload } from '@/app/context/ProductFileUploadContext';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { ProductStepper } from '@/app/[locale]/components/products/ProductStepper';
import { UpdateProductSummary } from '../../../../components/products/UpdateProductSummary';
import { UpdateProductInfoSection } from '@/app/[locale]/components/products/UpdateProductInfoSection';
import {
    IProduct,
    ModalUpdateProductFormData,
    ModalUpdateProductPackFormData,
    ModalUpdateProductAwardFormData,
    UploadedFile,
} from '@/lib//types/types';
import {
    Aroma,
    aroma_options,
    Color,
    color_options,
    Family,
    family_options,
    Fermentation,
    fermentation_options,
    product_type_options,
    recommended_glass_options,
} from '@/lib//beerEnum';

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

    // if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
    //     ctx.addIssue({
    //         code: z.ZodIssueCode.custom,
    //         message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
    //             ', ',
    //         )}] but was ${f.type}`,
    //     });
    // }
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
    name: z.string().min(2, { message: 'errors.input_number__min_2' }).max(50, {
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
    pairing: z.string().nullable().optional(),
    recommended_glass: z
        .number()
        .min(0, { message: 'errors.input_number_min_0' })
        .optional(),
    brewers_note: z.string().nullable().optional(),
    og: z.number().nullable().optional(),
    fg: z.number().nullable().optional(),
    srm: z.number().nullable().optional(),
    ebc: z.number().nullable().optional(),
    hops_type: z.string().nullable().optional(),
    malt_type: z.string().nullable().optional(),
    consumption_temperature: z.number().nullable().optional(),
    is_public: z.boolean(),
    is_available: z.boolean(),
    volume: z.number().min(0, { message: 'errors.input_number_min_0' }),
    weight: z.number().min(0, { message: 'errors.input_number_min_0' }),
    format: z
        .string()
        .min(2, { message: 'errors.input_number__min_2' })
        .max(50, {
            message: 'errors.error_50_number_max_length',
        }),
    brewery_id: z.string().optional(),
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
    awards: z.array(
        z.object({
            id: z.string().optional(),
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
            img_url: z.custom<File>().superRefine(validateFile).or(z.string()),
            img_url_changed: z.boolean().optional(),
            img_url_from_db: z.string().optional(),
        }),
    ),
    packs: z.array(
        z.object({
            id: z.string().optional(),
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
            img_url: z.custom<File>().superRefine(validateFile).or(z.string()),
            prev_img_url: z.string().optional(),
            product_id: z.string(),
        }),
    ),
    media_files: z
        .array(
            z.object({
                id: z.string().optional(),
                product_id: z.string(),
                type: z.string(),
                url: z.string(),
                alt_text: z.string(),
                is_primary: z.boolean(),
            }),
        )
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
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const { customizeSettings } = useAppContext();
    const { handleMessage } = useMessage();

    const handleSetActiveStep = (value: number) => {
        setActiveStep(value);
    };

    const { clearFiles, setFiles, files, filesToDelete } = useFileUpload();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [awardsToDeleteArray, setAwardsToDeleteArray] = useState<
        { id: string; img_url: string }[]
    >([]);

    const { beers } = product;

    if (!product.beers || !beers) return <></>;

    const {
        color,
        aroma,
        family,
        fermentation,
        volume,
        format,
        intensity,
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

    const recommendedGlassDefault: {
        label: string;
        value: number;
    } = recommended_glass_options.find(
        (c) => c.value.toString() === recommended_glass,
    ) ?? {
        label: 'pint',
        value: 0,
    };

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            product_id: product.id,
            category: product.category ?? '',
            name: product.name ?? '',
            description: product.description ?? '',
            type: product.type ?? Type.BEER,
            is_public: product.is_public ?? false,
            is_available: product.is_available ?? false,
            price: product.price ?? 0,
            // stock_quantity: product.product_inventory?.quantity ?? 0,
            // stock_limit_notification:
            //     product.product_inventory?.limit_notification ?? 0,
            format: format,
            volume: volume,
            weight: product.weight ?? 0,
            color: colorDefault.value,
            aroma: aromaDefault.value,
            intensity: intensity,
            ibu: ibu,
            ingredients: ingredients,
            pairing: pairing,
            recommended_glass: recommendedGlassDefault.value,
            brewers_note: brewers_note ?? '',
            og: og,
            fg: fg,
            srm: srm,
            ebc: ebc,
            hops_type: hops_type ?? '',
            malt_type: malt_type ?? '',
            consumption_temperature: consumption_temperature,
            family: familyDefault.value,
            fermentation: fermentationDefault.value,
            is_gluten: product.beers?.is_gluten ?? false,
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
                id: award.id,
                award_id: award.id,
                name: award.name,
                description: award.description,
                year: award.year,
                img_url: award.img_url,
                img_url_changed: false,
                img_url_from_db: award.img_url,
            })),
            brewery_id: product.brewery_id ?? '',
            // campaign: "-",
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
        formState: { errors, isDirty, dirtyFields },
    } = form;

    const queryClient = useQueryClient();

    useEffect(() => {
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

        // Establece los archivos en el contexto
        setFiles(initialFiles);
    }, [product.product_media]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.info('ERROR EN UPDATE PRODUCT: ', errors);
        }
    }, [errors]);

    const updateBasicSection = async (formValues: ValidationSchema) => {
        setIsLoading(true);

        const {
            name,
            description,
            type,
            price,
            is_public,
            is_available,
            weight,
            brewery_id,
        } = formValues;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/details`;

        const formData = new FormData();

        formData.append('name', name);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('price', price.toString());
        formData.append('is_public', is_public.toString());
        formData.append('is_available', is_available.toString());
        formData.append('weight', weight.toString());
        formData.append('product_id', product.id);

        // Brewery
        if (brewery_id && brewery_id !== '') {
            formData.append('brewery_id', brewery_id);
        }

        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Asegura que axios envíe correctamente formData
            },
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.update_product',
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
            is_gluten,
            volume,
            format,
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
        } = formValues;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/beer_attributes`;

        const formData = new FormData();

        formData.append('intensity', intensity.toString());
        formData.append('fermentation', fermentation.toString());
        formData.append('color', color.toString());
        formData.append('aroma', aroma.toString());
        formData.append('family', family.toString());
        formData.append('is_gluten', is_gluten.toString());
        formData.append('volume', volume.toString());
        formData.append('format', format);
        formData.append('ibu', ibu.toString());
        formData.append('ingredients', ingredients?.join(',') ?? '');
        formData.append('pairing', pairing ?? '');
        formData.append(
            'recommended_glass',
            recommended_glass?.toString() ?? '',
        );
        formData.append('brewers_note', brewers_note ?? '');
        formData.append('og', og?.toString() ?? '');
        formData.append('fg', fg?.toString() ?? '');
        formData.append('srm', srm?.toString() ?? '');
        formData.append('ebc', ebc?.toString() ?? '');
        formData.append('hops_type', hops_type ?? '');
        formData.append('malt_type', malt_type ?? '');
        formData.append(
            'consumption_temperature',
            consumption_temperature?.toString() ?? '',
        );

        formData.append('product_id', product.id);

        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Asegura que axios envíe correctamente formData
            },
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.update_beer_attributes',
            });

            setIsLoading(false);
            return;
        }

        setIsLoading(false);
    };

    const updateInventory = async (formValues: ValidationSchema) => {
        // Ahora mismo no queremos mostrar el stock y el límite para avisar -> Por eso usamos is_available
        return;

        /*
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

        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Asegura que axios envíe correctamente formData
            },
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.update_stock',
            });

            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        queryClient.invalidateQueries('productList');
        */
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

        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Asegura que axios envíe correctamente formData
            },
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.update_packs',
            });

            return;
        }

        setIsLoading(false);
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
            formData.append(`awards[${index}].id`, award.id ?? '');
            formData.append(`awards[${index}].name`, award.name);
            formData.append(`awards[${index}].description`, award.description);
            formData.append(`awards[${index}].year`, award.year.toString());
            formData.append(`awards[${index}].img_url`, award.img_url);
            formData.append(
                `awards[${index}].img_url_changed`,
                award.img_url_changed?.toString() ?? 'false',
            );
            formData.append(
                `awards[${index}].img_url_from_db`,
                award.img_url_from_db ?? '',
            );
        });

        formData.append('awards_size', awards.length.toString());

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/awards`;

        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Asegura que axios envíe correctamente formData
            },
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.update_awards',
            });

            return;
        }

        setIsLoading(false);
        queryClient.invalidateQueries('productList');
    };

    const updateMultimediaSection = async (
        files: UploadedFile[],
        filesToDelete: UploadedFile[],
    ) => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/media`;

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

    const deleteAwards = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/awards`;

        const formData = new FormData();

        awardsToDeleteArray.map((award, index) => {
            formData.append(`awards[${index}].id`, award.id ?? '');
            formData.append(`awards[${index}].img_url`, award.img_url);
        });

        formData.append('awards_size', awardsToDeleteArray.length.toString());

        const response = await fetch(url, {
            method: 'DELETE',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.delete_awards',
            });

            return;
        }

        setIsLoading(false);
        queryClient.invalidateQueries('productList');
    };

    const handleUpdateProduct = async (formValues: any) => {
        const {
            // campaign,
            awards,
            packs,
        } = formValues;

        setActiveStep(0);
        setIsLoading(true);

        const randomUUID = await generateUUID();

        // Basic Info
        if (
            dirtyFields.name ||
            dirtyFields.description ||
            dirtyFields.type ||
            dirtyFields.price ||
            dirtyFields.is_public ||
            dirtyFields.is_available ||
            dirtyFields.weight ||
            dirtyFields.brewery_id
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
                dirtyFields.is_gluten ||
                dirtyFields.volume ||
                dirtyFields.format ||
                dirtyFields.weight ||
                dirtyFields.ibu ||
                dirtyFields.pairing ||
                dirtyFields.recommended_glass ||
                dirtyFields.brewers_note ||
                dirtyFields.og ||
                dirtyFields.fg ||
                dirtyFields.srm ||
                dirtyFields.ebc ||
                dirtyFields.hops_type ||
                dirtyFields.malt_type ||
                dirtyFields.consumption_temperature ||
                dirtyFields.ingredients?.includes(true)
            ) {
                await updateBeerSection(formValues);
            }

            /*
            if (
                dirtyFields.stock_quantity ||
                dirtyFields.stock_limit_notification
            ) {
                await updateInventory(formValues);
            }
            */

            const isPacksDirty = dirtyFields.packs?.some(
                (pack: { [key: string]: any }) => {
                    // Comprobar si hay algún elemento dentro del objeto que sea true. Si es así es que debemos de entrar porque hubieron cambios en los packs
                    return Object.values(pack).some((value) => value === true);
                },
            );

            // Packs
            if (dirtyFields.packs && isNotEmptyArray(packs) && isPacksDirty) {
                await updatePacks(packs);
            }

            // Awards
            if (awardsToDeleteArray.length > 0) {
                await deleteAwards();
            }

            await updateMultimediaSection(files, filesToDelete);

            if (dirtyFields.awards && awards && isNotEmptyArray(awards)) {
                await updateAwards(awards, randomUUID);
            }
        }

        setIsLoading(false);
        handleEditShowModal(false);
    };

    const updateProductMutation = useMutation({
        mutationKey: 'updateProduct',
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
    };

    const handleArrayOfAwardsToDelete = (award: {
        id: string;
        img_url: string;
    }) => {
        setAwardsToDeleteArray((current) => [...current, award]);
    };

    return (
        <FormProvider {...form}>
            <ModalWithForm
                showBtn={false}
                showModal={showModal}
                setShowModal={handleEditShowModal}
                title={'update_product'}
                btnTitle={'save'}
                description={''}
                classContainer={`${isLoading && ' opacity-75'}`}
                handler={() => {}}
                handlerClose={() => handleEditShowModal(false)}
                form={form}
                showTriggerBtn={false}
                showCancelBtn={false}
            >
                <ProductStepper
                    activeStep={activeStep}
                    handleSetActiveStep={handleSetActiveStep}
                    isSubmitting={isSubmitting}
                    handler={handleSubmit(onSubmit)}
                    btnTitle={'update_product'}
                >
                    <>
                        <ProductHeaderDescription />

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
                            <UpdateAwardsSection
                                form={form}
                                handleArrayOfAwardsToDelete={
                                    handleArrayOfAwardsToDelete
                                }
                            />
                        ) : (
                            <UpdateProductSummary form={form} />
                        )}
                    </>
                </ProductStepper>
            </ModalWithForm>
        </FormProvider>
    );
}
