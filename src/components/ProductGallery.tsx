import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./common";
import { ICarouselItem } from "../lib/types";
import Carousel from "./common/Carousel";

interface Props {
  gallery: ICarouselItem[];
  isLike: boolean;
  handleSetIsLike: Dispatch<SetStateAction<boolean>>;
}

export function ProductGallery({ gallery, isLike, handleSetIsLike }: Props) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [principal, setPrincipal] = useState(gallery[galleryIndex]);
  const [back, setBack] = useState(gallery[galleryIndex + 1]);
  const [extra_1, setExtra_1] = useState(gallery[galleryIndex + 2]);
  const [extra_2, setExtra_2] = useState(gallery[galleryIndex + 3]);
  const [extra_3, setExtra_3] = useState(gallery[galleryIndex + 4]);

  const heartColor = { filled: "#fdc300", unfilled: "grey" };

  useEffect(() => {
    setPrincipal(gallery[galleryIndex]);
    setBack(gallery[galleryIndex + 1]);
    setExtra_1(gallery[galleryIndex + 2]);
    setExtra_2(gallery[galleryIndex + 3]);
    setExtra_3(gallery[galleryIndex + 4]);
  }, [gallery, galleryIndex]);

  const handleSetGalleryIndex = (index: number) => {
    setGalleryIndex(index);
  };

  return (
    <section className="bg-blueGray-100 rounded-b-10xl overflow-hidden mt-4 mb-6 w-full">
      <div className="container px-4 mx-auto">
        <div className="-mx-4 justify-center relative">
          {/* Add to fav button  */}
          <div className="absolute top-2 right-8 index-50">
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
            <div className="flex justify-center w-full lg:w-4/5 lg:mb-0 py-4 px-10 2xl:mx-auto 2xl:px-0 ">
              {/* Principal Image  */}
              <Image
                src={principal?.imageUrl ?? "/marketplace_product_default.png"}
                width={250}
                height={250}
                alt=""
              />
            </div>

            <div className="2xl:container 2xl:mx-auto 2xl:px-0 py-3 px-10">
              <Carousel
                gallery={[
                  {
                    imageUrl:
                      principal?.imageUrl ?? "/marketplace_product_default.png",
                    link: principal?.link ?? "",
                    title: principal?.title ?? "",
                  },
                  {
                    imageUrl:
                      back?.imageUrl ?? "/marketplace_product_default.png",
                    link: back?.link ?? "",
                    title: back?.title ?? "",
                  },
                  {
                    imageUrl:
                      extra_1?.imageUrl ?? "/marketplace_product_default.png",
                    link: extra_1?.link ?? "",
                    title: extra_1?.title ?? "",
                  },
                  {
                    imageUrl:
                      extra_2?.imageUrl ?? "/marketplace_product_default.png",
                    link: extra_2?.link ?? "",
                    title: extra_2?.title ?? "",
                  },
                  {
                    imageUrl:
                      extra_3?.imageUrl ?? "/marketplace_product_default.png",
                    link: extra_3?.link ?? "",
                    title: extra_3?.title ?? "",
                  },
                ]}
                isLike={isLike}
                handleSetIsLike={handleSetIsLike}
                handleSetGalleryIndex={handleSetGalleryIndex}
              />
            </div>
          </div>
          {/* 
          <div className="w-full px-4 text-center flex sm:flex-row items-center justify-around">
             Arrow left 
            {gallery.length > 1 && (
              <FontAwesomeIcon
                className={`cursor-pointer transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300`}
                icon={faAngleLeft}
                style={{ color: "#000", width: "20px" }}
                onClick={() => {
                  if (galleryIndex > 0 && galleryIndex < gallery.length)
                    setGalleryIndex(galleryIndex - 1);
                }}
              />
            )}

            Snapshot Gallery
            <div className="pt-6 flex flex-row space-x-1">
              {gallery.map((photo, index) => {
                return (
                  <a
                    key={index}
                    className={`h-30 block mb-4 mr-2 sm:mr-0 ${
                      galleryIndex === index
                        ? "border-2 border-beer-foam rounded"
                        : ""
                    }`}
                    href="#"
                  >
                    <Image
                      className="m-1"
                      width={50}
                      height={50}
                      src={photo.imageUrl}
                      alt=""
                      onClick={() => setGalleryIndex(index)}
                    />
                  </a>
                );
              })}
            </div>

            Arrow Right
            {gallery.length > 1 && (
              <FontAwesomeIcon
                className={`cursor-pointer transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300`}
                icon={faAngleRight}
                style={{ color: "#000", width: "20px" }}
                onClick={() => {
                  if (galleryIndex >= 0 && galleryIndex < gallery.length - 1)
                    setGalleryIndex(galleryIndex + 1);
                }}
              />
            )}
          </div> */}
        </div>
      </div>
    </section>
  );
}
