import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function TopBeers() {
    const t = useTranslations();
    return (
        <>
            {/*  bloque 6 */}
            <section className="relative m-auto w-full max-w-screen-2xl justify-center overflow-hidden bg-cerv-cream pb-20 pt-10">
                <figure className="absolute left-2/4 m-auto -ml-80 hidden h-[700px] w-[700px] max-w-full bg-[url('/assets/rec-graf4.webp')] bg-cover bg-no-repeat opacity-10 sm:block sm:w-full"></figure>
                <header className="mb-10 text-center text-4xl font-bold text-cerv-coffee md:text-5xl">
                    {t('homepage.topbeers.header')}
                </header>
                <div className="relative z-10 m-auto grid max-w-[300px] grid-cols-1 gap-0 sm:max-w-[600px] sm:grid-cols-2 md:gap-2 lg:max-w-full lg:grid-cols-5">
                    {/*  producto 1 */}
                    <article className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            MÍSTICA
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/prod-1.webp')] bg-cover bg-center  bg-no-repeat">
                            <div className="relative right-2 float-right mt-10 ">
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/heart.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    20
                                </figure>
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/bla.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    11
                                </figure>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <figure className=" text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={20}
                                    alt="review"
                                />
                            </figure>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                {t('homepage.topbeers.get_it')}
                            </div>
                        </div>
                    </article>
                    {/*  producto 2 */}
                    <article className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            BOSQUE ROJO
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/prod-2.webp')] bg-cover bg-center bg-no-repeat">
                            <div className="relative right-2 float-right mt-10 ">
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/heart.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    20
                                </figure>
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/bla.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    22
                                </figure>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <figure className="text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={20}
                                    alt="review"
                                />
                            </figure>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                {t('homepage.topbeers.get_it')}
                            </div>
                        </div>
                    </article>
                    {/*  producto 3 */}
                    <article className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            AMARILLA
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/prod-3.webp')] bg-cover bg-center  bg-no-repeat">
                            <div className="relative right-2 float-right mt-10 ">
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/heart.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    15
                                </figure>
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/bla.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    17
                                </figure>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <figure className="text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={20}
                                    alt="review"
                                />
                            </figure>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                {t('homepage.topbeers.get_it')}
                            </div>
                        </div>
                    </article>
                    {/*  producto 4 */}
                    <article className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            LÚPULO DORADO
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/prod-4.webp')] bg-cover bg-center bg-no-repeat">
                            <div className="relative right-2 float-right mt-10 ">
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/heart.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    10
                                </figure>
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/bla.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    21
                                </figure>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <figure className=" text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={20}
                                    alt="review"
                                />
                            </figure>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                {t('homepage.topbeers.get_it')}
                            </div>
                        </div>
                    </article>
                    {/*  producto 5 */}
                    <article className="mr-4 hidden w-full max-w-[300px] bg-no-repeat lg:block">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            LUPULENSIS
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/prod-5.webp')] bg-cover bg-center bg-no-repeat">
                            <div className="relative right-2 float-right mt-10 ">
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/heart.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    12
                                </figure>
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/bla.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    13
                                </figure>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <figure className="text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={20}
                                    alt="review"
                                />
                            </figure>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                {t('homepage.topbeers.get_it')}
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </>
    );
}
