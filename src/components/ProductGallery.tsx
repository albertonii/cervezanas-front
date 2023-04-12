import Carousel from "./common/Carousel";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./common";
import { ICarouselItem } from "../lib/types";
import DisplayImageString from "./common/DisplayImageString";

interface Props {
  gallery: ICarouselItem[];
  isLike: boolean;
  handleSetIsLike: Dispatch<SetStateAction<boolean>>;
}

export function ProductGallery({ gallery, isLike, handleSetIsLike }: Props) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [main, setMain] = useState(gallery[0]);
  // const [principal, setPrincipal] = useState(gallery[galleryIndex]);
  // const [back, setBack] = useState(gallery[galleryIndex + 1]);
  // const [extra_1, setExtra_1] = useState(gallery[galleryIndex + 2]);
  // const [extra_2, setExtra_2] = useState(gallery[galleryIndex + 3]);
  // const [extra_3, setExtra_3] = useState(gallery[galleryIndex + 4]);

  const heartColor = { filled: "#fdc300", unfilled: "grey" };

  useEffect(() => {
    setMain(gallery[galleryIndex]);
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
            <div className="flex justify-center w-full lg:w-4/5 lg:mb-0 py-4 px-10 2xl:mx-auto 2xl:px-0 max-h-[540px]">
              {/* Principal Image  */}
              <DisplayImageString
                src={main?.imageUrl}
                width={350}
                height={150}
                alt=""
                class="rounded"
                isBasePath={true}
              />
            </div>

            <div className="2xl:container 2xl:mx-auto 2xl:px-0 py-3 px-10 w-full">
              <Carousel
                gallery={gallery}
                isLike={isLike}
                handleSetIsLike={handleSetIsLike}
                handleSetGalleryIndex={handleSetGalleryIndex}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
