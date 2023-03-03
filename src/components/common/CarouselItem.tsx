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
      <span className="...">
        <Image
          src={resource.imageUrl || ""}
          alt={resource.title}
          width={200}
          height={200}
          className=""
        />
      </span>
    </div>
  );
}
