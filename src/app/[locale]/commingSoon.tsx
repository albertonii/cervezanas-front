import React from "react";
import Image from "next/image";

export default function commingSoon() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4">
      <div
        className="absolute top-0 left-0 h-full w-full bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('/cervezanas-min.jpg')`,
        }}
      ></div>

      <h1 className="z-10 mb-8 text-5xl font-bold text-white md:text-7xl">
        Proximamente
      </h1>
      <p className="text-xl text-white md:text-2xl">
        Estamos trabajando para que puedas disfrutar de una experiencia
        Cervezanas completa
      </p>
      <Image
        src="/logo_cervezanas.svg"
        alt="Cervezanas Logo"
        width={500}
        height={100}
        style={{ objectFit: "contain" }}
        priority={true}
        className="mt-10"
      />
    </div>
  );
}
