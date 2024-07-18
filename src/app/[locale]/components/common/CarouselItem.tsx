import React from 'react';
import DisplayImageProduct from './DisplayImageProduct';

interface Props {
    resource: {
        link: string;
        imageUrl: string;
        title: string;
    };
}

export function CarouselItem({ resource }: Props) {
    return (
        <DisplayImageProduct
            imgSrc={resource.imageUrl}
            alt={resource.title}
            class=" rounded transition duration-200 ease-in hover:opacity-100"
            objectFit="contain"
        />
    );
}
