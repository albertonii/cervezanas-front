'use client';

import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from '../../../../components/common/DisplayInputError';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { MULTIMEDIA } from '../../../../../../constants';
import { useMessage } from '../../../../components/message/useMessage';

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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { handleMessage } = useMessage();

    const generateUUID = () => {
        return uuidv4();
    };

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

            if (!file) {
                setImage('/assets/nobeer.png');
                return;
            }

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
        // setValue(registerName, e.target.files, { shouldDirty: true });

        setIsLoading(true);

        const updateValue = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const url = `${baseUrl}/api/products/multimedia`;

            const file = getValues(registerName);

            const formData = new FormData();
            formData.append('product_id', productId);

            if (registerName === MULTIMEDIA.P_PRINCIPAL) {
                const multimedia_type = MULTIMEDIA.P_PRINCIPAL;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                const response = await fetch(url, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.status !== 200) {
                    handleMessage({
                        type: 'error',
                        message: t('error_update_product_multimedia'),
                    });
                    return;
                }

                if (response.status === 200) {
                    handleMessage({
                        type: 'success',
                        message: t('success_update_product_multimedia'),
                    });
                }
            } else if (registerName === MULTIMEDIA.P_BACK) {
                const multimedia_type = MULTIMEDIA.P_BACK;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                const response = await fetch(url, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.status !== 200) {
                    handleMessage({
                        type: 'error',
                        message: t('error_update_product_multimedia'),
                    });
                    return;
                }

                if (response.status === 200) {
                    handleMessage({
                        type: 'success',
                        message: t('success_update_product_multimedia'),
                    });
                }
            } else if (registerName === MULTIMEDIA.P_EXTRA_1) {
                const multimedia_type = MULTIMEDIA.P_EXTRA_1;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                const response = await fetch(url, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.status !== 200) {
                    handleMessage({
                        type: 'error',
                        message: t('error_update_product_multimedia'),
                    });
                    return;
                }

                if (response.status === 200) {
                    handleMessage({
                        type: 'success',
                        message: t('success_update_product_multimedia'),
                    });
                }
            } else if (registerName === MULTIMEDIA.P_EXTRA_2) {
                const multimedia_type = MULTIMEDIA.P_EXTRA_2;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                const response = await fetch(url, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.status !== 200) {
                    handleMessage({
                        type: 'error',
                        message: t('error_update_product_multimedia'),
                    });
                    return;
                }

                if (response.status === 200) {
                    handleMessage({
                        type: 'success',
                        message: t('success_update_product_multimedia'),
                    });
                }
            } else if (registerName === MULTIMEDIA.P_EXTRA_3) {
                const multimedia_type = MULTIMEDIA.P_EXTRA_3;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                const response = await fetch(url, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.status !== 200) {
                    handleMessage({
                        type: 'error',
                        message: t('error_update_product_multimedia'),
                    });
                    return;
                }

                if (response.status === 200) {
                    handleMessage({
                        type: 'success',
                        message: t('success_update_product_multimedia'),
                    });
                }
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
                    Subiendo archivo ...
                </div>
            )}

            {!image && (
                <div className="relative h-32 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 border-dotted   border-gray-400 shadow-md">
                    <input
                        type="file"
                        accept="image/gif, image/jpeg, image/png, image/webp"
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
