import Image from 'next/image';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
    image: string;
    removeImageClick: () => void;
    icon: IconProp;
}

export default function FilePreviewBlurImage({
    image,
    removeImageClick,
    icon,
}: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <div className="z-1 relative py-22 flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2  border-dotted border-gray-400 bg-gray-200 shadow-md">
            <figure
                className={`    
                ${
                    isLoading ?? 'animate-pulse grayscale-0 blur-2xl'
                } w-full flex h-32 flex-row items-center gap-2 group-hover:opacity-75 transition-all duration-300
                `}
            >
                <Image
                    className={`
                        h-full w-full rounded 
                     `}
                    src={image}
                    loader={() => image}
                    alt={''}
                    objectFit="contain"
                    layout="fill"
                    onLoadingComplete={() => {
                        setTimeout(() => {
                            setIsLoading(false);
                        }, 1000);
                    }}
                />
            </figure>

            <div
                onClick={() => {
                    removeImageClick();
                }}
                className="absolute right-0 top-0 mr-1 mt-1 h-6 w-6 cursor-pointer rounded-sm bg-red-400 object-right-top text-white"
            >
                <FontAwesomeIcon icon={icon} className="w-full" />
            </div>
        </div>
    );
}
