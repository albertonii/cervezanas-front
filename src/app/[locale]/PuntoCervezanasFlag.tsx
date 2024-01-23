import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useLocale } from "next-intl";

export default function PuntoCervezanasFlag() {
  const locale = useLocale();

  return (
    <section className="absolute right-0 top-10 rounded-l-lg bg-beer-dark sm:top-24 z-10">
      <Link
        href={"/beer-me"}
        locale={locale}
        className="flex flex-col items-center justify-start space-x-4 sm:flex-row sm:rounded-l sm:px-2 sm:py-1"
      >
        <Image
          width={45}
          height={45}
          alt={"Find Cervezanas spots"}
          className={"mx-2 my-2 w-10 rounded-full sm:mx-0 sm:my-0 sm:w-12"}
          src={"/icons/beerme.svg"}
        />

        <div className="hidden sm:flex sm:flex-col">
          <span className="text-right text-beer-foam ">Puntos</span>
          <span className="text-right text-beer-foam ">Cervezanas</span>
        </div>
      </Link>
    </section>
  );
}
