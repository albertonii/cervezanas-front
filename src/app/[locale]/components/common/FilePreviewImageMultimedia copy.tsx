'use client';

import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { useAppContext } from '../../../context/AppContext';
import { SupabaseProps } from '../../../../constants';

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
    const { imageData, addImage, removeImage } = useAppContext();
    const [fileList, setFileList] = useState<FileList | null>(null);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState<string | null>(); // Nuevo estado para almacenar la URL de la imagen
    // const [image, setImage] = useState<File | null>(); // Nuevo estado para almacenar la URL de la imagen

    const { register, formState, getValues } = form;
    // useEffect(() => {
    //   console.log(imageData[registerName]);
    //   if (imageData[registerName]) {
    //     setImage(imageData[registerName]);
    //   }
    // }, []);

    useEffect(() => {
        if (getValues(registerName)) {
            preUrl
                ? setImage(preUrl + getValues(registerName))
                : setImage(getValues(registerName));
        }
    }, [registerName]);

    // useEffect(() => {
    //   if (imageData[registerName]) {
    //     setImage(imageData[registerName]);
    //   }
    // }, [imageData]);

    // const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    //   if (!e.target.files) return console.info("No hay archivos");

    //   setFileList(e.target.files);
    //   setMessage("");
    //   addImage(registerName, e.target.files[0]);
    //   setImage(e.target.files[0]); // Almacenar la URL de la imagen en el estado
    // };

    // useEffect(() => {
    //   if (fileList && fileList.length > 0) {
    //     switch (registerName) {
    //       case "p_principal":
    //         setValue("p_principal", fileList);
    //         break;
    //       case "p_back":
    //         setValue("p_back", fileList);
    //         break;
    //       case "p_extra_1":
    //         setValue("p_extra_1", fileList);
    //         break;
    //       case "p_extra_2":
    //         setValue("p_extra_2", fileList);
    //         break;
    //       case "p_extra_3":
    //         setValue("p_extra_3", fileList);
    //         break;
    //       default:
    //         setValue(registerName, fileList);
    //         break;
    //     }
    //   }
    // }, [fileList, registerName, setValue]);

    const removeImageClick = () => {
        setFileList(null);
        setImage(null); // Restablecer la URL de la imagen cuando se elimina
        removeImage(registerName);
    };

    return (
        <section className="flex w-full items-center justify-center rounded-md md:w-4/5 lg:w-full">
            <h2 className="mb-1 flex items-center justify-center bg-white text-[12px] text-red-500">
                {message}
            </h2>

            {!image && (
                <div className="relative h-32 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 border-dotted   border-gray-400 shadow-md">
                    <input
                        type="file"
                        // onChange={handleFile}
                        accept="image/gif, image/jpeg, image/png, image/webp"
                        className="absolute z-10 h-full w-full opacity-0"
                        {...register(registerName, {
                            required: false,
                        })}
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
        </section>
    );
};
