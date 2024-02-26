import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function Homeheader() {
  const t = useTranslations();
  return (
    <>
      {/*  bloque 1 */}
      <section className="relative m-auto flex h-[220px] max-w-screen-2xl justify-center overflow-hidden border-gray-400 bg-cerv-cream p-4">
        <div className="flex w-full max-w-screen-2xl justify-center border-8 border-double pt-1">
          <figure className="relative left-0  hidden h-[180px] w-[180px] bg-[url('/assets/rec-graf1.webp')] bg-cover bg-right bg-no-repeat opacity-10 sm:block"></figure>
          <div className=" block w-full justify-center pt-7 text-center text-2xl font-bold sm:inline-flex lg:text-4xl">
            <figure
              className="z-index-1 relative -left-12 -top-7 hidden
            bg-no-repeat sm:block"
            >
              <Image
                src="/assets/logo.svg"
                width={270}
                height={270}
                alt="Logo"
              />
            </figure>
            <h1 className="">
              {t('homepage.homeheader.meeting_point')}
              <span className="text-3xl text-cerv-titlehigh lg:text-5xl">
                {t('homepage.homeheader.craft_beer')}
              </span>
            </h1>
          </div>
          <div className="relative right-0  hidden h-[180px] w-[180px] bg-[url('/assets/rec-graF2.webp')] bg-cover bg-no-repeat  opacity-10 sm:block"></div>
        </div>
      </section>
      {/*  bloque 2 */}
      <figure className="relative -top-12 m-auto w-full max-w-screen-2xl">
        <Image
          style={{ aspectRatio: '845/291' }}
          src="/assets/home/home-fakebanner.webp"
          width={1400}
          height={300}
          alt="Banner"
        />
      </figure>
    </>
  );
}
