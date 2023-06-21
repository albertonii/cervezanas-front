"use client";

import DisplayImageProduct from "../../../components/common/DisplayImageProduct";
import React, { ComponentProps, useEffect, useState } from "react";
import { Carousel } from "../../../components/common";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "../../../components/common";
import { ICarouselItem } from "../../../lib/types.d";
import { ImageModal } from "../../../components/modals/ImageModal";
import Image from "next/image";

interface Props {
  gallery: ICarouselItem[];
  isLike: boolean;
  handleSetIsLike?: ComponentProps<any>;
}

export function ProductGallery({ gallery, isLike, handleSetIsLike }: Props) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [main, setMain] = useState(gallery[0]);
  const [showModal, setShowModal] = useState(true);

  const heartColor = { filled: "#fdc300", unfilled: "grey" };

  useEffect(() => {
    setMain(gallery[galleryIndex] ?? "");
  }, [gallery, galleryIndex]);

  const handleSetGalleryIndex = (index: number) => {
    setGalleryIndex(index);
  };

  return (
    <>
      <section className="bg-blueGray-100 rounded-b-10xl mb-6 mt-4 w-full overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative -mx-4 justify-center">
            {/* Add to fav button  */}
            <div className="index-50 absolute right-8 top-2">
              <IconButton
                icon={faHeart}
                onClick={() => handleSetIsLike(!isLike)}
                isActive={isLike}
                color={heartColor}
                classContainer={
                  "hover:bg-beer-foam transition ease-in duration-300 bg-gray-800 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0"
                }
                classIcon={""}
                title="Add to favorites"
              ></IconButton>
            </div>

            <div className="flex flex-wrap">
              <div
                className="flex w-full justify-center px-10 py-4 hover:cursor-pointer lg:mb-0 lg:w-4/5 2xl:mx-auto 2xl:px-0"
                onClick={() => setShowModal(true)}
              >
                {/* Main Image  */}
                <DisplayImageProduct
                  imgSrc={decodeURIComponent(main.imageUrl)}
                  width={350}
                  height={150}
                  alt="Product Gallery Principal Image"
                  class="h-[500px] rounded"
                />
              </div>

              <div className="w-full px-10 py-3 2xl:container 2xl:mx-auto 2xl:px-0">
                <Carousel
                  gallery={gallery}
                  handleSetGalleryIndex={handleSetGalleryIndex}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ImageModal showModal={showModal} setShowModal={setShowModal}>
        <>
          <Image
            className=" rounded-md lg:max-h-[600px] lg:max-w-[800px]"
            src={main.imageUrl}
            alt={"Product main image"}
            width={500}
            height={500}
          />
        </>
      </ImageModal>
    </>
  );
}
