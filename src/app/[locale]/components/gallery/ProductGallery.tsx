'use client';

import React, { ComponentProps, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ImageModal } from '../modals/ImageModal';
import { ICarouselItem } from '@/lib//types/types';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '../ui/buttons/IconButton';
import DisplayImageProduct from '../ui/DisplayImageProduct';
import { Carousel } from '../ui/Carousel';

interface Props {
    gallery: ICarouselItem[];
    isLike: boolean;
    handleSetIsLike?: ComponentProps<any>;
}

export function ProductGallery({ gallery, isLike, handleSetIsLike }: Props) {
    const t = useTranslations();

    const [galleryIndex, setGalleryIndex] = useState(0);
    const [main, setMain] = useState(gallery[0]);
    const [showModal, setShowModal] = useState(false);

    const heartColor = { filled: '#fdc300', unfilled: 'grey' };

    useEffect(() => {
        if (gallery.length === 0) return;
        gallery[galleryIndex].imageUrl = decodeURIComponent(
            gallery[galleryIndex].imageUrl,
        );

        setMain(gallery[galleryIndex]);
    }, [gallery, galleryIndex]);

    const handleSetGalleryIndex = (index: number) => {
        setGalleryIndex(index);
    };

    if (!main) return null;

    return (
        <>
            <section className="rounded-b-10xl w-full overflow-hidden container mx-auto px-4 relative justify-center">
                {/* Add to fav button  */}
                <figure className="index-50 absolute right-8 top-6">
                    <IconButton
                        icon={faHeart}
                        onClick={() => handleSetIsLike(!isLike)}
                        isActive={isLike}
                        color={heartColor}
                        classContainer={
                            'hover:bg-beer-foam transition ease-in duration-300 bg-gray-800 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0'
                        }
                        classIcon={''}
                        title={t('add_to_favs')}
                    ></IconButton>
                </figure>

                <figure className="flex flex-wrap">
                    <div
                        className="flex w-full justify-center px-2 py-4 hover:cursor-pointer lg:mb-0 2xl:mx-auto 2xl:px-0"
                        onClick={() => setShowModal(true)}
                    >
                        {/* Main Image  */}
                        <DisplayImageProduct
                            imgSrc={main.imageUrl}
                            width={0}
                            height={0}
                            alt="Product Gallery Principal Image"
                            class="h-full w-[300px] h-[400px] md:max-w-[380px] md:h-[320px] lg:max-w-[500px] lg:h-[340px]"
                            objectFit="contain"
                        />
                    </div>

                    <div className="w-full lg:px-3 lg:py-3 2xl:container 2xl:mx-auto 2xl:px-0">
                        <Carousel
                            gallery={gallery}
                            handleSetGalleryIndex={handleSetGalleryIndex}
                        />
                    </div>
                </figure>
            </section>

            <ImageModal showModal={showModal} setShowModal={setShowModal}>
                <>
                    <DisplayImageProduct
                        imgSrc={main.imageUrl}
                        width={500}
                        height={500}
                        alt={'Product main image'}
                        class="rounded-md lg:max-h-[600px] lg:max-w-[800px]"
                        objectFit="contain"
                    />
                </>
            </ImageModal>
        </>
    );
}
