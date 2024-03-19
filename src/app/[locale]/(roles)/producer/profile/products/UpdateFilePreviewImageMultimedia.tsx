'use client';

import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from '../../../../components/common/DisplayInputError';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { generateFileNameExtension } from '../../../../../../utils/utils';
import { v4 as uuidv4 } from 'uuid';

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
        // TODO: VOLVER A ESTE CAMINO
        const updateValue = async () => {
            const fileName = `articles/${productId}/p_principal/${randomUUID}`;
            const p_principal = getValues(registerName);

            const p_principal_url = encodeURIComponent(
                `${fileName}${generateFileNameExtension(p_principal[0].name)}`,
            );

            console.log(p_principal);
            console.log(p_principal_url);

            const { error: pPrincipalError } = await supabase.storage
                .from('products')
                .upload(
                    `${fileName}${generateFileNameExtension(
                        p_principal[0].name,
                    )}`,
                    p_principal[0],
                    {
                        cacheControl: '3600',
                        upsert: false,
                    },
                );
            if (pPrincipalError) throw pPrincipalError;

            const { error: multError } = await supabase
                .from('product_multimedia')
                .update({
                    p_principal: p_principal_url,
                })
                .eq('product_id', productId);

            if (multError) throw multError;
        };

        const p_principal = getValues(registerName);
        console.log(p_principal);

        if (p_principal && p_principal[0].name !== '') {
            updateValue();
        }
    }, [image]);

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

            console.log(preUrl + decodeURIComponent(file));
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
    };

    return (
        <section className="flex w-full items-center justify-center rounded-md lg:w-full">
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
