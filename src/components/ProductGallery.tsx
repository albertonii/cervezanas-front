import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "./common/IconButton";

interface Props {
  gallery: string[];
  isLike: boolean;
  handleSetIsLike: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProductGallery({
  gallery,
  isLike,
  handleSetIsLike,
}: Props) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [principal, setPrincipal] = useState(gallery[galleryIndex]);

  const heartColor = { filled: "#fdc300", unfilled: "grey" };

  useEffect(() => {
    setPrincipal(gallery[galleryIndex]);
  }, [gallery, galleryIndex]);

  return (
    <section className="bg-blueGray-100 rounded-b-10xl overflow-hidden mt-4 mb-6">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-4 justify-center">
          <div className="w-full lg:w-4/5 px-4 lg:mb-0">
            <div className="flex -mx-4 flex-col flex-wrap items-center justify-between lg:justify-start lg:items-start xl:items-center">
              <div className="w-full sm:w-11/12 px-4 relative">
                {/* Add to fav button  */}
                <div className="absolute top-0 right-0 ">
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

                <div className="w-[36vw] h-[22vh] ">
                  <Image className="" fill src={principal} alt="" />
                </div>
              </div>

              <div className="w-full sm:w-full min-w-max px-4 text-center flex sm:flex-row items-center justify-around">
                {/* Arrow Up */}
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

                <div className="pt-6">
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
                          src={photo}
                          alt=""
                          onClick={() => setGalleryIndex(index)}
                        />
                      </a>
                    );
                  })}
                </div>

                {/* Arrow Down */}
                {gallery.length > 1 && (
                  <FontAwesomeIcon
                    className={`cursor-pointer transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300`}
                    icon={faAngleRight}
                    style={{ color: "#000", width: "20px" }}
                    onClick={() => {
                      if (
                        galleryIndex >= 0 &&
                        galleryIndex < gallery.length - 1
                      )
                        setGalleryIndex(galleryIndex + 1);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/*
          <div className="w-full lg:w-1/2 px-4">
            <div className="max-w-md mb-6">
              <span className="text-xs text-gray-400 tracking-wider">
                APPLE #3299803
              </span>
              <h2 className="mt-6 mb-4 text-5xl md:text-7xl lg:text-8xl font-heading font-medium">
                Apple iPhone 12 Pro (128GB) - Silver
              </h2>
              <p className="flex items-center mb-6">
                <span className="mr-2 text-sm text-blue-500 font-medium">
                  $
                </span>
                <span className="text-3xl text-blue-500 font-medium">
                  44.90
                </span>
              </p>
              <p className="text-lg text-gray-400">
                The nulla commodo, commodo eros a lor, tristique lectus. Lorem
                sad 128 GB silver.
              </p>
            </div>
            <div className="flex mb-6 items-center">
              <div className="inline-flex mr-4">
                <button className="mr-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 7.91679H12.4167L10 0.416779L7.58333 7.91679H0L6.18335 12.3168L3.81668 19.5835L10 15.0835L16.1834 19.5835L13.8167 12.3168L20 7.91679Z"
                      fill="#C1C9D3"
                    ></path>
                  </svg>
                </button>
                <button className="mr-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 7.91679H12.4167L10 0.416779L7.58333 7.91679H0L6.18335 12.3168L3.81668 19.5835L10 15.0835L16.1834 19.5835L13.8167 12.3168L20 7.91679Z"
                      fill="#C1C9D3"
                    ></path>
                  </svg>
                </button>
                <button className="mr-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 7.91679H12.4167L10 0.416779L7.58333 7.91679H0L6.18335 12.3168L3.81668 19.5835L10 15.0835L16.1834 19.5835L13.8167 12.3168L20 7.91679Z"
                      fill="#C1C9D3"
                    ></path>
                  </svg>
                </button>
                <button className="mr-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 7.91679H12.4167L10 0.416779L7.58333 7.91679H0L6.18335 12.3168L3.81668 19.5835L10 15.0835L16.1834 19.5835L13.8167 12.3168L20 7.91679Z"
                      fill="#C1C9D3"
                    ></path>
                  </svg>
                </button>
                <button>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 7.91679H12.4167L10 0.416779L7.58333 7.91679H0L6.18335 12.3168L3.81668 19.5835L10 15.0835L16.1834 19.5835L13.8167 12.3168L20 7.91679Z"
                      fill="#C1C9D3"
                    ></path>
                  </svg>
                </button>
              </div>
              <span className="text-md text-gray-400">4.59</span>
            </div>
            <div className="mb-6">
              <h4 className="mb-3 font-heading font-medium">
                <span>Color:</span>
                <span className="text-gray-400">Silver</span>
              </h4>
              <button className="inline-flex items-center justify-center p-1 rounded-full border border-gray-300">
                <div className="w-6 h-6 rounded-full bg-white"></div>
              </button>
              <button className="inline-flex items-center justify-center p-1 rounded-full border border-transparent">
                <div className="w-6 h-6 rounded-full bg-orange-800"></div>
              </button>
              <button className="inline-flex items-center justify-center p-1 rounded-full border border-transparent">
                <div className="w-6 h-6 rounded-full bg-blue-900"></div>
              </button>
              <button className="inline-flex items-center justify-center p-1 rounded-full border border-transparent">
                <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
              </button>
            </div>
            <div className="mb-10">
              <h4 className="mb-3 font-heading font-medium">Qty:</h4>
              <input
                className="w-24 px-3 py-2 text-center bg-white border-2 border-blue-500 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
                type="text"
                placeholder="1"
              />
            </div>
            <div className="flex flex-wrap -mx-2 mb-12">
              <div className="w-full md:w-2/3 px-2 mb-2 md:mb-0">
                <a
                  className="block py-4 px-2 leading-8 font-heading font-medium tracking-tighter text-xl text-white text-center bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:bg-blue-600 rounded-xl"
                  href="#"
                >
                  Add to bag
                </a>
              </div>
              <div className="w-full md:w-1/3 px-2">
                <a
                  className="flex w-full py-4 px-2 items-center justify-center leading-8 font-heading font-medium tracking-tighter text-xl text-center bg-white focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 hover:bg-opacity-60 rounded-xl"
                  href="#"
                >
                  <span className="mr-2">Wishlist</span>
                  <svg
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.3235 20.1324L2.52488 10.8515C1.75232 10.0706 1.24237 9.06367 1.06728 7.97339C0.8922 6.88311 1.06086 5.76477 1.54936 4.7768V4.7768C1.91837 4.03089 2.45739 3.3843 3.12201 2.89033C3.78663 2.39635 4.55781 2.06911 5.37203 1.93558C6.18626 1.80205 7.0202 1.86605 7.80517 2.1223C8.59013 2.37855 9.30364 2.81972 9.88691 3.40946L11.3235 4.86204L12.7601 3.40946C13.3434 2.81972 14.0569 2.37855 14.8419 2.1223C15.6269 1.86605 16.4608 1.80205 17.275 1.93558C18.0892 2.06911 18.8604 2.39635 19.525 2.89033C20.1897 3.3843 20.7287 4.03089 21.0977 4.7768V4.7768C21.5862 5.76477 21.7549 6.88311 21.5798 7.97339C21.4047 9.06367 20.8947 10.0706 20.1222 10.8515L11.3235 20.1324Z"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-6 font-heading font-medium">
                More information
              </h4>
              <button className="flex w-full pl-6 lg:pl-12 pr-6 py-4 mb-4 justify-between items-center leading-7 rounded-2xl border-2 border-blueGray-200 hover:border-blueGray-300">
                <h3 className="text-lg font-heading font-medium">
                  Shipping &amp; returns
                </h3>
                <span>
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.4594 0.289848C10.8128 -0.096616 11.3841 -0.096616 11.7349 0.289848C12.0871 0.676312 12.0897 1.30071 11.7349 1.68718L6.63794 7.21015C6.28579 7.59662 5.71584 7.59662 5.36108 7.21015L0.264109 1.68718C-0.0880363 1.30215 -0.0880363 0.676312 0.264109 0.289848C0.617558 -0.096616 1.18882 -0.096616 1.53966 0.289848L6.00147 4.81927L10.4594 0.289848Z"
                      fill="black"
                    ></path>
                  </svg>
                </span>
              </button>
              <button className="flex w-full pl-6 lg:pl-12 pr-6 py-4 justify-between items-center leading-7 rounded-2xl border-2 border-blueGray-200 hover:border-blueGray-300">
                <h3 className="text-lg font-heading font-medium">
                  Product details
                </h3>
                <span>
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.4594 0.289848C10.8128 -0.096616 11.3841 -0.096616 11.7349 0.289848C12.0871 0.676312 12.0897 1.30071 11.7349 1.68718L6.63794 7.21015C6.28579 7.59662 5.71584 7.59662 5.36108 7.21015L0.264109 1.68718C-0.0880363 1.30215 -0.0880363 0.676312 0.264109 0.289848C0.617558 -0.096616 1.18882 -0.096616 1.53966 0.289848L6.00147 4.81927L10.4594 0.289848Z"
                      fill="black"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
           */}
        </div>
      </div>
    </section>
  );
}
