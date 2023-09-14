import Image from "next/image";
import React from "react";
import { Spinner } from "./Spinner";

interface Props {
  message: string;
}

export function CustomLoading(props: Props) {
  const { message } = props;

  return (
    <div className="flex flex-col justifer-center items-center ">
      <div className="flex justify-center items-center">
        <Spinner color="beer-blonde" size="medium" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {message}
        </h1>
      </div>

      {/* Checkout Image loading  */}
      <div className=" flex justify-center mt-8 relative overflow-hidden sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[550px] lg:h-[550px] xl:w-[650px] xl:h-[650px]">
        <Image
          className="rounded-full object-cover"
          src="/assets/beer-bear-1.png"
          alt="Checkout"
          fill
        />
      </div>
    </div>
  );
}
