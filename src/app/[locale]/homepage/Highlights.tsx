import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function Highlights() {
    const t = useTranslations();
    return (
        <section className="relative top-0 m-auto w-full max-w-screen-2xl justify-center bg-cerv-cream p-5 sm:block md:flex lg:flex">
            {/*  bloque 3 */}
            <article className="sm:w-full md:block md:w-1/2 md:px-3 lg:flex lg:w-1/2">
                <figure className="h-[350px] bg-[url('/assets/home/home-img-1.webp')] bg-center bg-no-repeat sm:bg-contain md:w-full lg:h-full lg:w-1/2 lg:bg-cover"></figure>
                <div className="p-8 sm:p-12 md:w-full md:p-8 lg:w-1/2 lg:p-5 xl:p-8">
                    <figure className="m-auto text-center">
                        <Image
                            className="m-auto"
                            src="/assets/home/detalle.svg"
                            width={80}
                            height={300}
                            alt="dingbat"
                        />
                    </figure>
                    <header className="pt-3 text-center text-2xl font-bold leading-6 text-cerv-titlehigh">
                        {t('homepage.highlights.header1')}
                    </header>
                    <div className="pt-3 text-justify leading-5">
                        {t('homepage.highlights.body1')}
                    </div>
                </div>
            </article>
            <article className="sm:w-full md:block md:w-1/2 md:px-3 lg:flex  lg:w-1/2">
                <figure className="h-[350px] bg-[url('/assets/home/home-img-2.webp')] bg-center bg-no-repeat sm:bg-contain  md:w-full lg:h-full lg:w-1/2   lg:bg-cover "></figure>
                <div className="p-8 sm:p-12 md:w-full md:p-8 lg:w-1/2 lg:p-5 xl:p-8">
                    <figure className="m-auto text-center">
                        <Image
                            className="m-auto"
                            src="/assets/home/detalle.svg"
                            width={80}
                            height={300}
                            alt="dingbat"
                        />
                    </figure>
                    <header className="pt-3 text-center text-2xl font-bold leading-6 text-cerv-titlehigh">
                        {t('homepage.highlights.header2')}
                    </header>
                    <div className="pt-3 text-justify leading-5">
                        {t('homepage.highlights.body2')}
                    </div>
                </div>
            </article>
        </section>
    );
}
