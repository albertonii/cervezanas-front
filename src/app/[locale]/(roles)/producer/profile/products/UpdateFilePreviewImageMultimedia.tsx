'use client';

import FilePreviewBlurImage from '@/app/[locale]/components/common/FilePreviewBlurImage';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { MULTIMEDIA } from '@/constants';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';

interface Props {
    productId: string;
    form: UseFormReturn<any, any>;
    registerName: string;
    preUrl?: string;
    isBoxPack?: boolean;
}

export const UpdateFilePreviewImageMultimedia = ({
    productId,
    form,
    registerName,
    preUrl,
    isBoxPack,
}: Props) => {
    const t = useTranslations();

    const {
        getValues,
        setValue,
        formState: { errors },
    } = form;

    const [image, setImage] = useState<string | null>(); // Nuevo estado para almacenar la URL de la imagen
    const [prevImg, setPrevImg] = useState<string | null>(
        preUrl
            ? preUrl + decodeURIComponent(getValues(registerName))
            : URL.createObjectURL(getValues(registerName)),
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { handleMessage } = useMessage();

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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return console.info('No hay archivos');
        setImage(URL.createObjectURL(e.target.files[0])); // Almacenar la URL de la imagen en el estado
        setValue(registerName, e.target.files);

        setIsLoading(true);

        const updateValue = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

            const url = `${baseUrl}/api/products/${
                isBoxPack ? 'box_packs/multimedia' : 'multimedia'
            }`;

            const file = getValues(registerName);

            const formData = new FormData();
            formData.append('product_id', productId);

            if (registerName === MULTIMEDIA.P_PRINCIPAL) {
                const multimedia_type = MULTIMEDIA.P_PRINCIPAL;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                await fetch(url, {
                    method: 'PUT',
                    body: formData,
                })
                    .then((response) => {
                        console.log(response);
                        if (response.status !== 200) {
                            handleMessage({
                                type: 'error',
                                message: 'error_update_product_multimedia',
                            });
                            setImage(prevImg);

                            return;
                        }

                        if (response.status === 200) {
                            handleMessage({
                                type: 'success',
                                message: 'success_update_product_multimedia',
                            });
                        }
                    })
                    .finally(() => setIsLoading(false))
                    .catch((error) => {
                        setImage(prevImg);
                        console.error('Error al subir la imagen', error);
                    });
            } else if (registerName === MULTIMEDIA.P_BACK) {
                const multimedia_type = MULTIMEDIA.P_BACK;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                await fetch(url, {
                    method: 'PUT',
                    body: formData,
                })
                    .then((response) => {
                        if (response.status !== 200) {
                            handleMessage({
                                type: 'error',
                                message: 'error_update_product_multimedia',
                            });
                            return;
                        }

                        if (response.status === 200) {
                            handleMessage({
                                type: 'success',
                                message: 'success_update_product_multimedia',
                            });
                        }
                    })
                    .finally(() => setIsLoading(false))
                    .catch((error) => {
                        console.error('Error al subir la imagen', error);
                    });
            } else if (registerName === MULTIMEDIA.P_EXTRA_1) {
                const multimedia_type = MULTIMEDIA.P_EXTRA_1;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                await fetch(url, {
                    method: 'PUT',
                    body: formData,
                })
                    .then((response) => {
                        if (response.status !== 200) {
                            handleMessage({
                                type: 'error',
                                message: 'error_update_product_multimedia',
                            });
                            return;
                        }

                        if (response.status === 200) {
                            handleMessage({
                                type: 'success',
                                message: 'success_update_product_multimedia',
                            });
                        }
                    })
                    .finally(() => setIsLoading(false))
                    .catch((error) => {
                        console.error('Error al subir la imagen', error);
                    });
            } else if (registerName === MULTIMEDIA.P_EXTRA_2) {
                const multimedia_type = MULTIMEDIA.P_EXTRA_2;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                await fetch(url, {
                    method: 'PUT',
                    body: formData,
                })
                    .then((response) => {
                        if (response.status !== 200) {
                            handleMessage({
                                type: 'error',
                                message: 'error_update_product_multimedia',
                            });
                            return;
                        }

                        if (response.status === 200) {
                            handleMessage({
                                type: 'success',
                                message: 'success_update_product_multimedia',
                            });
                        }
                    })
                    .finally(() => setIsLoading(false))
                    .catch((error) => {
                        console.error('Error al subir la imagen', error);
                    });
            } else if (registerName === MULTIMEDIA.P_EXTRA_3) {
                const multimedia_type = MULTIMEDIA.P_EXTRA_3;

                formData.append('multimedia_type', multimedia_type);
                formData.append('multimedia', file[0]);

                await fetch(url, {
                    method: 'PUT',
                    body: formData,
                })
                    .then((response) => {
                        if (response.status !== 200) {
                            handleMessage({
                                type: 'error',
                                message: 'error_update_product_multimedia',
                            });
                            return;
                        }

                        if (response.status === 200) {
                            handleMessage({
                                type: 'success',
                                message: 'success_update_product_multimedia',
                            });
                        }
                    })
                    .finally(() => setIsLoading(false))
                    .catch((error) => {
                        console.error('Error al subir la imagen', error);
                    });
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 800);
        };

        try {
            updateValue();
        } catch (error) {
            console.error('Error al subir la imagen', error);
            setIsLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setValue(registerName, null);
        setImage(null); // Restablecer la URL de la imagen cuando se elimina
    };

    return (
        <section className="flex relative w-full flex-col items-center justify-center rounded-md bg-white p-4 shadow-md border border-gray-200">
            {isLoading && (
                <div className="absolute z-10 flex h-full w-full items-center justify-center bg-gray-200 bg-opacity-50 text-sm font-semibold">
                    Subiendo archivo ...
                </div>
            )}

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
                    />
                </div>
            )}

            {errors[registerName] && (
                <DisplayInputError message={errors[registerName]?.message} />
            )}
        </section>
    );
};
