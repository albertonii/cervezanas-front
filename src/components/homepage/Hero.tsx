import Image from "next/image";
import React from "react";
import { Button } from "../common";

export default function Hero() {
  return (
    <>
      <div className="h-[60px] bg-[url('/assets/golden_wave_pattern.png')] "></div>

      <div className="flex w-full justify-center bg-beer-blonde pt-10 sm:h-[50vh] md:h-[59vh]">
        <div className="container gap-10 sm:grid sm:grid-cols-1 lg:grid-cols-2">
          {/* copywriting  */}
          <div className="h-full w-full space-y-8 p-4 sm:p-0">
            {/* Title */}
            <div className="text-3xl font-bold text-beer-dark sm:text-4xl">
              <span>Un punto de encuentro</span>
            </div>

            {/* Content 1 */}
            <div className="text-md sm:text-xl">
              Para nosotros, la cerveza es más que una pasión. Es una comunidad
              de gente de toda condición que viaja para crear nuevos recuerdos y
              entablar nuevas relaciones y experiencias en torno a una birra
              bien fría. Es un estilo de vida, con raíces históricas que se
              extienden por nuestra región y cultura. Es una profesión, con
              miles de empleos y aficiones en la zona, todos ellos relacionados
              con el barril.
            </div>

            {/* Content 2 */}
            <div className="text-md sm:text-xl">
              Queremos que conozcas los experimentos cerveceros más locos,
              aquellas joyas escondidas y fabricadas con mimo para ti. Somos el
              puente entre aquellos fabricantes de cerveza artesanal aún por
              descubrir y tú.
            </div>

            <div className="flex space-x-4">
              <Button primary medium>
                Saber más
              </Button>

              <Button accent medium>
                Cervezas
              </Button>
            </div>
          </div>

          {/* Photography  */}
          <div className="relative top-10 flex w-full items-start justify-end sm:-top-10 md:top-0 ">
            <Image
              src={"/assets/hero.png"}
              width={550}
              height={450}
              alt={"hero image"}
              className="absolute top-0 left-auto right-20 z-10 w-1/2 rounded-md	drop-shadow-2xl sm:right-44 sm:w-2/5 md:right-20 lg:w-3/4"
            />
            <Image
              src={"/assets/bg_dots.png"}
              width={450}
              height={450}
              alt={"hero image"}
              className="absolute top-10 left-20 w-1/2 sm:left-56 sm:w-1/4 lg:w-2/3"
            />
          </div>
        </div>
      </div>
    </>
  );
}
