'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from './DisplayInputError';
import FilePreviewBlurImage from './FilePreviewBlurImage';

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
        formState: { errors, dirtyFields },
    } = form;

    useEffect(() => {
        console.info('Errores detectados con multimedia', errors);
    }, [errors]);

    useEffect(() => {
        if (getValues(registerName)) {
            const file = getValues(registerName);

            preUrl
                ? setImage(preUrl + decodeURIComponent(file))
                : setImage(URL.createObjectURL(getValues(registerName)));
        }
    }, [registerName]);

    const removeImageClick = () => {
        setValue(registerName, null);
        setImage(null); // Restablecer la URL de la imagen cuando se elimina
    };

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return console.info('No hay archivos');

        setImage(URL.createObjectURL(e.target.files[0])); // Almacenar la URL de la imagen en el estado
        setValue(registerName, e.target.files[0]);
    };

    return (
        <section className="flex w-full items-center justify-center rounded-md lg:w-full group">
            {!image && (
                <div className="hover:cursor-pointer relative h-32 w-full items-center overflow-hidden rounded-md border-2 border-dotted border-gray-400 shadow-md">
                    <input
                        type="file"
                        accept="image/gif, image/jpeg, image/png, image/webp"
                        className="absolute z-10 h-full w-full opacity-0 hover:cursor-pointer"
                        onChange={handleFile}
                        id={registerName}
                    />

                    <div className="z-1 absolute top-0 flex h-full w-full flex-col items-center justify-center bg-gray-200 px-2 hover:cursor-pointer">
                        <i className="mdi mdi-folder-open text-center text-[30px] text-gray-400"></i>
                        <span className="text-[12px]">
                            {t('drag_and_drop_file')}
                        </span>
                    </div>
                </div>
            )}

            {image && (
                <FilePreviewBlurImage
                    image={image}
                    removeImageClick={removeImageClick}
                />
            )}

            {errors[registerName] && (
                <DisplayInputError message={errors[registerName]?.message} />
            )}
        </section>
    );
};
