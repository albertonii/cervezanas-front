import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function Highlights() {
    const t = useTranslations();
    return (
        <section className="relative top-0 m-auto w-full max-w-screen-2xl justify-center bg-cerv-cream p-2 sm:p-5 sm:block md:flex lg:flex rounded-b-full -mb-6 border-l-2 border-beer-blonde overflow-hidden sm:overflow-visible">
            {/*  bloque 3 */}
            <article className="bg-cerv-cream lg:bg-transparent sm:w-full md:block md:w-1/2 md:px-10 px-0 lg:px-4 lg:flex lg:w-1/2 rounded-full border-l-2 border-beer-blonde shadow-md mr-0 md:-mr-8 py-4 md:py-20">
                <figure className="h-[220px] lg:h-full bg-[url('/assets/home/home-img-1.webp')] bg-center bg-no-repeat sm:bg-contain md:w-[220px] lg:w-1/2 lg:bg-cover rounded-l-full border-r-4 border-none lg:border-beer-blonde pl-10 m-auto"></figure>

                <div className="p-4 sm:p-12  md:p-8 md:w-full lg:w-1/2 lg:p-5 xl:p-8">
                    <figure className="m-auto text-center">
                        <Image
                            className="m-auto"
                            src="/assets/home/detalle.svg"
                            width={80}
                            height={300}
                            alt="dingbat"
                        />
                    </figure>

                    <header className="pt-3 text-center text-2xl font-bold leading-6 text-cerv-titlehigh mb-6 max-w-full">
                        {t('homepage.highlights.header1')}
                    </header>

                    <div className="pt-3 text-justify md:leading-5 leading-6 m-auto w-[400px] md:w-full text-lg p-4 md:p-0 max-w-full">
                        {t('homepage.highlights.body1')}
                    </div>
                </div>
            </article>

            <article className="sm:w-full md:block md:w-1/2 md:px-10 lg:flex  lg:w-1/2 rounded-full border-l-2 border-beer-blonde shadow-md bg-cerv-cream lg:bg-transparent py-4 md:py-20">
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

                    <header className="pt-3 text-center text-2xl font-bold leading-6 text-cerv-titlehigh w-[250px] m-auto md:w-full mb-6 max-w-full">
                        {t('homepage.highlights.header2')}
                    </header>

                    <div className="pt-3 text-justify md:leading-5 leading-6 m-auto w-[400px] md:w-full text-lg p-4 md:p-0 max-w-full">
                        {t('homepage.highlights.body2')}
                    </div>
                </div>

                <figure className="relative w-full md:w-[220px] lg:w-1/2 h-[220px] lg:h-auto rounded-r-full border-l-4 border-none lg:border-beer-blonde pl-10 m-auto">
                    <Image
                        src="/assets/home/home-img-2.webp"
                        alt="Image 2"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-r-full"
                    />
                </figure>
            </article>
        </section>
    );
}
