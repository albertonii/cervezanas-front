'use client';

import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from './DisplayInputError';

interface Props {
    form: UseFormReturn<any, any>;
    registerName: string;
    preUrl?: string;
}

export const FilePreviewImageMultimedia = ({
    form,
    registerName,
    preUrl,
}: Props) => {
    const t = useTranslations();
    const [image, setImage] = useState<string | null>(); // Nuevo estado para almacenar la URL de la imagen

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
    };

    return (
        <section className="flex w-full items-center justify-center rounded-md lg:w-full">
            {!image && (
                <div className="relative h-32 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 border-dotted   border-gray-400 shadow-md">
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute z-10 h-full w-full opacity-0"
                        onChange={handleFile}
                        id={registerName}
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
