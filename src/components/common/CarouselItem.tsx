import React from "react";
import DisplayImageProduct from "./DisplayImageProduct";

interface Props {
  resource: {
    link: string;
    imageUrl: string;
    title: string;
  };
}

export function CarouselItem({ resource }: Props) {
  return (
    <div className="flex flex-col items-center">
      <DisplayImageProduct
        imgSrc={resource.imageUrl}
        alt={resource.title}
        width={120}
        height={120}
        class="h-[120px] rounded transition duration-200 ease-in hover:opacity-80"
      />
    </div>
  );
}
