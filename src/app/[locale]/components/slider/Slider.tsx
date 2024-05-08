'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { images } from './constants';
import Description from './Description';

const Slider = () => {
    const [activeImage, setActiveImage] = useState(0);

    const clickNext = () => {
        activeImage === images.length - 1
            ? setActiveImage(0)
            : setActiveImage(activeImage + 1);
    };
    const clickPrev = () => {
        activeImage === 0
            ? setActiveImage(images.length - 1)
            : setActiveImage(activeImage - 1);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            clickNext();
        }, 10000);
        return () => {
            clearTimeout(timer);
        };
    }, [activeImage]);
    return (
        <div className="grid place-items-center md:grid-cols-2 grid-cols-1 w-full mx-auto max-w-full shadow-2xl h-[300px] relative overflow-hidden">
            <div
                className={`w-full flex justify-center items-center gap-4 transition-transform ease-in-out duration-500 p-6 md:p-0 absolute  h-[300px]`}
            >
                {images.map((elem, idx) => (
                    <div
                        key={idx}
                        className={`${
                            idx === activeImage
                                ? 'block w-full object-cover transition-all duration-500 ease-in-out'
                                : 'hidden'
                        }`}
                    >
                        <Image
                            src={elem.src}
                            alt=""
                            width={1600}
                            height={369}
                            className="w-full h-[300px] object-cover"
                        />
                    </div>
                ))}
            </div>
            <Description
                activeImage={activeImage}
                clickNext={clickNext}
                clickPrev={clickPrev}
            />
        </div>
    );
};

export default Slider;
