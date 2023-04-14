import Image from "next/image";
import React from "react";
import { Button } from "../common";

export default function Hero() {
  const style = {
    backgroundImage: `url(${"/assets/golden_wave_pattern.png"})`,
  };

  return (
    <>
      <div className="bg-[url('/assets/golden_wave_pattern.png')] h-[60px] "></div>
      <div className="w-100% h-[50vh] bg-beer-blonde flex justify-center pt-10 ">
        <div className="container grid sm:grid-cols-1 lg:grid-cols-2 gap-10">
          {/* copywriting  */}
          <div className="w-full space-y-4">
            {/* Title */}
            <div className="text-4xl font-bold text-beer-dark">
              <h1>Un punto de encuentro</h1>
            </div>
            {/* Content 1 */}
            <div className="text-xl">
              Para nosotros, la cerveza es más que una pasión. Es una comunidad
              de gente de toda condición que viaja para crear nuevos recuerdos y
              entablar nuevas relaciones y experiencias en torno a una birra
              bien fría. Es un estilo de vida, con raíces históricas que se
              extienden por nuestra región y cultura. Es una profesión, con
              miles de empleos y aficiones en la zona, todos ellos relacionados
              con el barril.
            </div>

            {/* Content 2 */}
            <div className="text-xl">
              Queremos que conozcas los experimentos cerveceros más locos,
              aquellas joyas escondidas y fabricadas con mimo para ti. Somos el
              puente entre aquellos fabricantes de cerveza artesanal aún por
              descubrir y tú.
            </div>

            <div className="flex space-x-4">
              <Button primary xLarge>
                Saber más
              </Button>

              <Button accent xLarge>
                Cervezas
              </Button>
            </div>
          </div>

          {/* Photography  */}
          <div className="w-full relative flex justify-end items-start">
            <Image
              src={"/assets/hero.png"}
              width={550}
              height={450}
              alt={"hero image"}
              className="absolute top-0 left-auto right-auto z-10 drop-shadow-2xl	 rounded-md	"
            />
            <Image
              src={"/assets/bg_dots.png"}
              width={450}
              height={450}
              alt={"hero image"}
              className="absolute top-10 left-20"
            />
          </div>
        </div>
      </div>
    </>
  );
}
