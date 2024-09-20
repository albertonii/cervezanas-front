import Image from "next/image";
import React from "react";
import Spinner from "./Spinner";

interface Props {
  message: string;
}

export function CustomLoading(props: Props) {
  const { message } = props;

  return (
    <section className="justifer-center flex flex-col items-center ">
      <div className="flex items-center justify-center">
        <Spinner color="beer-blonde" size="medium" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {message}
        </h1>
      </div>

      {/* Checkout Image loading  */}
      <div className=" relative mt-8 flex justify-center overflow-hidden sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] lg:h-[550px] lg:w-[550px] xl:h-[650px] xl:w-[650px]">
        <Image
          className="rounded-full object-cover"
          src={"/assets/beer-bear-1.png"}
          loader={() => "/assets/beer-bear-1.png"}
          alt="Checkout"
          fill
        />
      </div>
    </section>
  );
}
