'use client';

import DisplayImageProduct from '../ui/DisplayImageProduct';
import React, { useState } from 'react';
import { Carousel } from '../ui/Carousel';
import { useTranslations } from 'next-intl';
import { ImageModal } from '../modals/ImageModal';
import { ICarouselItem } from '@/lib//types/types';
import { IconButton } from '../ui/buttons/IconButton';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';

interface Props {
    gallery: ICarouselItem[];
    isLike: boolean;
    handleSetIsLike?: (value: boolean) => void;
}

export function ProductGallery({ gallery, isLike, handleSetIsLike }: Props) {
    const t = useTranslations();

    const [galleryIndex, setGalleryIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const main = gallery[galleryIndex];

    const heartColor = { filled: '#fdc300', unfilled: 'grey' };

    if (!main) return null;

    const decodedImageUrl = decodeURIComponent(main.imageUrl);

    return (
        <>
            <section
                className="w-full overflow-hidden container mx-auto px-0 sm:px-4 relative flex justify-center"
                aria-label={t('Product Gallery')}
            >
                {/* Botón para añadir a favoritos */}
                <div className="absolute right-8 top-6">
                    <IconButton
                        icon={faHeart}
                        onClick={() =>
                            handleSetIsLike && handleSetIsLike(!isLike)
                        }
                        isActive={isLike}
                        color={heartColor}
                        classContainer="hover:bg-gray-200 transition ease-in duration-300 bg-gray-800 shadow hover:shadow-md text-gray-500 w-10 h-10 text-center p-2 rounded-full"
                        title={t('add_to_favs')}
                    />
                </div>

                <figure className="flex flex-col items-center">
                    <div
                        className="w-full flex justify-center px-2 py-4 cursor-pointer"
                        onClick={() => setShowModal(true)}
                    >
                        {/* Imagen principal */}
                        <DisplayImageProduct
                            imgSrc={decodedImageUrl}
                            width={0}
                            height={0}
                            alt="Product Gallery Principal Image"
                            class="h-full w-[300px] md:max-w-[380px] md:h-[320px] lg:max-w-[500px] lg:h-[340px]"
                            objectFit="contain"
                        />
                    </div>

                    <div className="w-full px-3 py-3">
                        <Carousel
                            gallery={gallery}
                            handleSetGalleryIndex={setGalleryIndex}
                        />
                    </div>
                </figure>
            </section>

            {showModal && (
                <ImageModal showModal={showModal} setShowModal={setShowModal}>
                    <DisplayImageProduct
                        imgSrc={main.imageUrl}
                        width={800}
                        height={800}
                        alt={'Product main image'}
                        class="rounded-md max-w-full w-[500px] h-auto md:w-[600px] lg:w-[750px]"
                        objectFit="contain"
                    />
                </ImageModal>
            )}
        </>
    );
}
