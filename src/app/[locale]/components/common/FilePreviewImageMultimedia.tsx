'use client';

import FilePreviewBlurImage from '../ui/FilePreviewBlurImage';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { DisplayInputError } from '../ui/DisplayInputError';

interface Props {
    form: UseFormReturn<any, any>;
    registerName: string;
    preUrl?: string;
    handleOnChangeImg?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FilePreviewImageMultimedia = ({
    form,
    registerName,
    preUrl,
    handleOnChangeImg,
}: Props) => {
    const t = useTranslations();
    const [image, setImage] = useState<string | null>(); // Nuevo estado para almacenar la URL de la imagen

    const {
        getValues,
        setValue,
        formState: { errors },
    } = form;

    useEffect(() => {
        if (Object.keys(errors).length > 0)
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

    const handleRemoveImage = () => {
        setValue(registerName, null);
        setImage(null); // Restablecer la URL de la imagen cuando se elimina
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return console.info('No hay archivos');

        const url = URL.createObjectURL(e.target.files[0]);

        setImage(url); // Almacenar la URL de la imagen en el estado
        setValue(registerName, e.target.files[0], { shouldDirty: true });
        handleOnChangeImg && handleOnChangeImg(e);
    };

    return (
        <section className="flex w-full flex-col items-center justify-center rounded-md bg-white p-4 shadow-md border border-gray-200 my-2">
            {!image ? (
                <div className="relative flex flex-col items-center justify-center h-32 w-full rounded-md border-2 border-dotted border-gray-400 hover:cursor-pointer bg-gray-50">
                    <input
                        type="file"
                        accept="image/gif, image/jpeg, image/png, image/webp"
                        className="absolute z-10 h-full w-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        id={registerName}
                    />
                    <div className="flex flex-col items-center text-center justify-center text-gray-400">
                        <i className="mdi mdi-folder-open text-[30px]"></i>
                        <span className="text-[12px]">
                            {t('drag_and_drop_file')}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="relative flex flex-col items-center w-full">
                    <FilePreviewBlurImage
                        image={image}
                        removeImageClick={handleRemoveImage}
                        icon={faX}
                    />
                </div>
            )}

            {errors[registerName] && (
                <DisplayInputError message={errors[registerName]?.message} />
            )}
        </section>
    );
};
