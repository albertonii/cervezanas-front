'use client';

import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from '../../../../components/common/DisplayInputError';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { generateFileNameExtension } from '../../../../../../utils/utils';
import { v4 as uuidv4 } from 'uuid';
import {
    ROUTE_ARTICLES,
    ROUTE_P_BACK,
    ROUTE_P_EXTRA_1,
    ROUTE_P_EXTRA_2,
    ROUTE_P_EXTRA_3,
    ROUTE_P_PRINCIPAL,
} from '../../../../../../config';
import { MULTIMEDIA } from '../../../../../../constants';

interface Props {
    productId: string;
    form: UseFormReturn<any, any>;
    registerName: string;
    preUrl?: string;
}

export const UpdateFilePreviewImageMultimedia = ({
    productId,
    form,
    registerName,
    preUrl,
}: Props) => {
    const t = useTranslations();
    const [image, setImage] = useState<string | null>(); // Nuevo estado para almacenar la URL de la imagen
    const { supabase } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateUUID = () => {
        return uuidv4();
    };

    const randomUUID = generateUUID();

    const {
        getValues,
        setValue,
        formState: { errors },
    } = form;

    useEffect(() => {
        if (getValues(registerName)) {
            const type = typeof getValues(registerName);

            const file =
                type === 'object'
                    ? getValues(registerName)[0].name
                    : getValues(registerName);

            preUrl
                ? setImage(preUrl + decodeURIComponent(file))
                : setImage(URL.createObjectURL(getValues(registerName)[0]));
        }
    }, [registerName]);

    const removeImageClick = () => {
        setValue(registerName, null);
        setImage(null); // Restablecer la URL de la imagen cuando se elimina
    };

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return console.info('No hay archivos');
        setImage(URL.createObjectURL(e.target.files[0])); // Almacenar la URL de la imagen en el estado
        setValue(registerName, e.target.files);

        setIsLoading(true);

        const updateValue = async () => {
            const file = getValues(registerName);

            if (registerName === MULTIMEDIA.P_PRINCIPAL) {
                const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_PRINCIPAL}/${randomUUID}`;
                const p_principal_url = encodeURIComponent(
                    `${fileName}${generateFileNameExtension(file[0].name)}`,
                );

                const { error } = await supabase.storage
                    .from('products')
                    .upload(
                        `${fileName}${generateFileNameExtension(file[0].name)}`,
                        file[0],
                        {
                            cacheControl: '3600',
                            upsert: false,
                        },
                    );
                if (error) throw error;

                const { error: multError } = await supabase
                    .from('product_multimedia')
                    .update({
                        p_principal: p_principal_url,
                    })
                    .eq('product_id', productId);

                if (multError) throw multError;
            } else if (registerName === MULTIMEDIA.P_BACK) {
                alert('DENTRO');
                const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_BACK}/${randomUUID}`;
                const p_back_url = encodeURIComponent(
                    `${fileName}${generateFileNameExtension(file[0].name)}`,
                );
                console.log(p_back_url);
                console.log(file[0]);

                const { error } = await supabase.storage
                    .from('products')
                    .upload(
                        `${fileName}${generateFileNameExtension(file[0].name)}`,
                        file[0],
                        {
                            cacheControl: '3600',
                            upsert: false,
                        },
                    );
                if (error) throw error;

                const { error: multError } = await supabase
                    .from('product_multimedia')
                    .update({
                        p_back: p_back_url,
                    })
                    .eq('product_id', productId);

                if (multError) throw multError;
            } else if (registerName === MULTIMEDIA.P_EXTRA_1) {
                const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_EXTRA_1}/${randomUUID}`;
                const p_extra_1_url = encodeURIComponent(
                    `${fileName}${generateFileNameExtension(file[0].name)}`,
                );

                const { error } = await supabase.storage
                    .from('products')
                    .upload(
                        `${fileName}${generateFileNameExtension(file[0].name)}`,
                        file[0],
                        {
                            cacheControl: '3600',
                            upsert: false,
                        },
                    );
                if (error) throw error;

                const { error: multError } = await supabase
                    .from('product_multimedia')
                    .update({
                        p_back: p_extra_1_url,
                    })
                    .eq('product_id', productId);

                if (multError) throw multError;
            } else if (registerName === MULTIMEDIA.P_EXTRA_2) {
                const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_EXTRA_2}/${randomUUID}`;
                const p_extra_2_url = encodeURIComponent(
                    `${fileName}${generateFileNameExtension(file[0].name)}`,
                );

                const { error } = await supabase.storage
                    .from('products')
                    .upload(
                        `${fileName}${generateFileNameExtension(file[0].name)}`,
                        file[0],
                        {
                            cacheControl: '3600',
                            upsert: false,
                        },
                    );
                if (error) throw error;

                const { error: multError } = await supabase
                    .from('product_multimedia')
                    .update({
                        p_back: p_extra_2_url,
                    })
                    .eq('product_id', productId);

                if (multError) throw multError;
            } else if (registerName === MULTIMEDIA.P_EXTRA_3) {
                const fileName = `${ROUTE_ARTICLES}/${productId}${ROUTE_P_EXTRA_3}/${randomUUID}`;
                const p_extra_3_url = encodeURIComponent(
                    `${fileName}${generateFileNameExtension(file[0].name)}`,
                );

                const { error } = await supabase.storage
                    .from('products')
                    .upload(
                        `${fileName}${generateFileNameExtension(file[0].name)}`,
                        file[0],
                        {
                            cacheControl: '3600',
                            upsert: false,
                        },
                    );
                if (error) throw error;

                const { error: multError } = await supabase
                    .from('product_multimedia')
                    .update({
                        p_back: p_extra_3_url,
                    })
                    .eq('product_id', productId);

                if (multError) throw multError;
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 800);
        };

        updateValue();
    };

    return (
        <section
            className={`
            flex w-full items-center justify-center rounded-md lg:w-full
            ${isLoading && 'animate-pulse bg-grey-500 opacity-40'}
        `}
        >
            {isLoading && (
                <div className="absolute z-10 flex h-full w-full items-center justify-center bg-gray-200 bg-opacity-50">
                    <i className="mdi mdi-loading mdi-spin text-[30px] text-gray-400"></i>
                    Subiendo archivo ...
                </div>
            )}
            {!image && (
                <div className="relative h-32 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 border-dotted   border-gray-400 shadow-md">
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="absolute z-10 h-full w-full opacity-0"
                        onChange={handleFile}
                    />

                    <div className="z-1 absolute top-0 flex h-full w-full flex-col items-center justify-center bg-gray-200 px-2">
                        <i className="mdi mdi-folder-open text-center text-[30px] text-gray-400"></i>
                        <span className="text-[12px]">
                            {t('drag_and_drop_file')}
                        </span>
                    </div>
                </div>
            )}

            {image && (
                <div className="z-1 relative flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2  border-dotted border-gray-400 bg-gray-200 shadow-md">
                    <figure className="flex h-32 flex-row items-center gap-2">
                        <Image
                            width={128}
                            height={128}
                            className="h-full w-full rounded"
                            src={image}
                            loader={() => image}
                            alt={''}
                        />
                    </figure>

                    <div
                        onClick={() => {
                            removeImageClick();
                        }}
                        className="absolute right-0 top-0 mr-1 mt-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-red-400 object-right-top"
                    >
                        <i className="mdi mdi-trash-can text-[16px] text-white">
                            x
                        </i>
                    </div>
                </div>
            )}

            {errors[registerName] && (
                <DisplayInputError message={errors[registerName]?.message} />
            )}
        </section>
    );
};
