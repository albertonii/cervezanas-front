'use client';

import { useState, useEffect, ComponentProps } from 'react';
import { CarouselItem } from './CarouselItem';
import { ICarouselItem } from '@/lib/types/types';

interface Props {
    gallery: ICarouselItem[];
    handleSetGalleryIndex: ComponentProps<any>;
}

export function Carousel({ gallery, handleSetGalleryIndex }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const movePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
            handleSetGalleryIndex((prevIndex: number) => prevIndex - 1);
        }
    };

    const moveNext = () => {
        if (currentIndex < gallery.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            handleSetGalleryIndex((prevIndex: number) => prevIndex + 1);
        }
    };

    const isDisabled = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            return currentIndex <= 0;
        }

        if (direction === 'next') {
            return currentIndex >= gallery.length - 1;
        }

        return false;
    };

    useEffect(() => {
        const carousel = document.getElementById('carousel');
        if (carousel) {
            carousel.scrollLeft = carousel.offsetWidth * currentIndex;
        }
    }, [currentIndex]);

    const handleClick = (index: number) => {
        setCurrentIndex(index);
        handleSetGalleryIndex(index);
    };

    return (
        <section className="carousel mx-auto my-4 lg:my-6 relative overflow-hidden ">
            <div className="top left absolute flex h-full w-full justify-between">
                <button
                    onClick={movePrev}
                    className="z-10 m-0 h-full w-10 p-0 text-center text-white opacity-75 transition-all duration-300 ease-in-out hover:bg-beer-gold hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-25"
                    disabled={isDisabled('prev')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="-ml-5 h-12 w-20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span className="sr-only">Prev</span>
                </button>

                <button
                    onClick={moveNext}
                    className="z-10 m-0 h-full w-10 p-0 text-center text-white opacity-75 transition-all duration-300 ease-in-out hover:bg-beer-gold hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-25"
                    disabled={isDisabled('next')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="-ml-5 h-12 w-20 text-cerv-banana hover:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                    <span className="sr-only">Next</span>
                </button>
            </div>

            <div className="carousel-container relative z-0 flex touch-pan-x snap-x snap-mandatory gap-2 overflow-hidden scroll-smooth px-10">
                {gallery.map((resource, index) => {
                    return (
                        <>
                            <div
                                key={resource.title + index}
                                className={`
                                        relative snap-start overflow-hidden text-center transition-all hover:cursor-pointer bg-white border-2 
                                        rounded-md w-[60px] h-[60px] lg:w-[70px] lg:h-[70px] xl:w-[120px] xl:h-[120px]
                                        ${
                                            currentIndex === index
                                                ? 'border-beer-blonde'
                                                : 'opacity-75 hover:opacity-100 border-beer-blonde'
                                        }`}
                                onClick={() => {
                                    handleClick(index);
                                }}
                            >
                                <CarouselItem
                                    resource={{
                                        link: resource.link,
                                        imageUrl: resource.imageUrl,
                                        title: resource.title,
                                    }}
                                />
                            </div>
                        </>
                    );
                })}
            </div>
        </section>
    );
}
