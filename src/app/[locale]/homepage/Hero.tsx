import Image from "next/image";
import React from "react";
import { Button } from "../components/common/Button";

export function Hero() {
  return (
    <>
      <div className="h-[60px] bg-[url('/assets/golden_wave_pattern.png')] "></div>

      <div className="flex w-screen justify-center bg-beer-blonde pt-10 sm:h-[50vh] md:h-[59vh]">
        <div className="container ml-8 gap-10 sm:grid sm:grid-cols-1 lg:grid-cols-2">
          {/* copywriting  */}
          <div className="h-full w-full space-y-8 sm:p-0 md:p-4">
            {/* Title */}
            <div className="nd:text-4xl text-xl font-bold text-beer-dark md:text-3xl">
              <span>Un punto de encuentro</span>
            </div>

            {/* Content 1 */}
            <div className="text-md text-[balance] sm:text-xl">
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
              priority
              src={"/assets/hero.png"}
              loader={() => "/assets/hero.png"}
              width={550}
              height={450}
              alt={"hero image"}
              className="absolute left-auto right-20 top-0 z-10 w-1/2 rounded-md	drop-shadow-2xl sm:right-44 sm:w-2/5 md:right-20 lg:w-3/4"
            />
            <Image
              priority
              src={"/assets/bg_dots.png"}
              loader={() => "/assets/bg_dots.png"}
              width={450}
              height={450}
              alt={"hero image"}
              className="absolute left-20 top-10 w-1/2 sm:left-56 sm:w-1/4 lg:w-2/3"
            />
          </div>
        </div>
      </div>
    </>
  );
}
