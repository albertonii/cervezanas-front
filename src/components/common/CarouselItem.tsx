import Image from "next/image";
import React from "react";

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
      <Image
        src={resource.imageUrl || ""}
        alt={resource.title}
        width={120}
        height={120}
        className="rounded hover:opacity-80 transition ease-in duration-200 max-h-[240px]"
      />
    </div>
  );
}
