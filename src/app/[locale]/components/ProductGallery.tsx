'use client';

import React, { ComponentProps, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Carousel } from './common/Carousel';
import { IconButton } from './common/IconButton';
import { ImageModal } from './modals/ImageModal';
import { ICarouselItem } from '../../../lib/types/types';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import DisplayImageProduct from './common/DisplayImageProduct';

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
      <section className="rounded-b-10xl w-full overflow-hidden ">
        <div className="container mx-auto px-4">
          <div className="relative -mx-4 justify-center">
            {/* Add to fav button  */}
            <figure className="index-50 absolute right-8 top-2">
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
                  width={350}
                  height={150}
                  alt="Product Gallery Principal Image"
                  class="h-full max-h-[400px] rounded md:max-h-[380px] lg:max-h-[500px] border-cerv-brown border-4"
                  objectFit="contain"
                />
              </div>

              <div className="w-full px-10 py-3 2xl:container 2xl:mx-auto 2xl:px-0">
                <Carousel
                  gallery={gallery}
                  handleSetGalleryIndex={handleSetGalleryIndex}
                />
              </div>
            </figure>
          </div>
        </div>
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
