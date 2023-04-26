import React from "react";
import DisplayImageProduct from "./DisplayImageProduct";

interface Props {
  resource: {
    link: string;
    imageUrl: string;
    title: string;
  };
}

export default function CarouselItem({ resource }: Props) {
  return (
    <div className="flex flex-col items-center">
      <DisplayImageProduct
        imgSrc={resource.imageUrl}
        alt={resource.title}
        width={120}
        height={120}
        class="rounded hover:opacity-80 transition ease-in duration-200 max-h-[240px]"
      />
    </div>
  );
}
