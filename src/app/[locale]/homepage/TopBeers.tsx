import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function TopBeers() {
    const t = useTranslations();
    return (
        <>
            {/*  bloque 6 */}
            <section className="relative m-auto w-full max-w-screen-2xl justify-center bg-cerv-softBlonde pt-10 pb-0  rounded-t-full border-l-2 border-beer-blonde overflow-visible">
                <header className="mb-10 text-center text-4xl font-bold text-cerv-titlehigh md:text-6xl font-['NexaRust']">
                    {t('homepage.topbeers.header')}
                    <p className="font-['NexaRust-script'] text-6xl md:text-8xl -mt-2 -mb-8 text-beer-draft -rotate-2">
                        {' '}
                        {t('homepage.topbeers.header2')}
                    </p>
                </header>
                <figure className="absolute left-2/4 m-auto -ml-80 hidden h-[700px] w-[700px] max-w-full bg-[url('/assets/rec-graf4.webp')] bg-contain bg-no-repeat opacity-10 sm:block sm:w-full -mt-28"></figure>
                <div className="relative z-10 m-auto grid max-w-[300px] grid-cols-1 gap-0 sm:max-w-[600px] sm:grid-cols-2 md:gap-2 lg:max-w-full lg:grid-cols-5">
                    {/*  producto 1 */}
                    <article className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream uppercase">
                            CCVK Redkahs
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/ccvk-redkahs.jpeg')] bg-cover bg-center  bg-no-repeat">
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
                            <a href="https://www.cervezanas.beer/es/products/f851ee0a-8175-4a2f-a6be-fe4c4dd2a0a0">
                                <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream hover:bg-cerv-titlehigh cursor-pointer">
                                    {t('homepage.topbeers.get_it')}
                                </div>
                            </a>
                        </div>
                    </article>
                    {/*  producto 2 */}
                    <article className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream uppercase">
                            DouGall's IPA 4
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/dougalls-ipa.jpeg')] bg-cover bg-center bg-no-repeat">
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
                            <a href="https://www.cervezanas.beer/es/products/c4e7b2f8-b5d4-4225-aca9-89f823aeff62">
                                <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream hover:bg-cerv-titlehigh cursor-pointer">
                                    {t('homepage.topbeers.get_it')}
                                </div>
                            </a>
                        </div>
                    </article>
                    {/*  producto 3 */}
                    <article className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream uppercase">
                            CCVK Dark Sidekahs
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/ccvk-dark-side.jpg')] bg-cover bg-center  bg-no-repeat">
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
                            <a href="https://www.cervezanas.beer/es/products/d47a2356-5375-4de7-81ff-c55b14e9c497">
                                <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream hover:bg-cerv-titlehigh cursor-pointer">
                                    {t('homepage.topbeers.get_it')}
                                </div>
                            </a>
                        </div>
                    </article>
                    {/*  producto 4 */}
                    <article className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream uppercase">
                            CCVK Panda Beer Wit-toria
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/ccvk-panda.jpg')] bg-cover bg-center bg-no-repeat">
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
                            <a href="https://www.cervezanas.beer/es/products/14e82f01-ffc2-40f4-ba05-7c845425f658">
                                <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream hover:bg-cerv-titlehigh cursor-pointer">
                                    {t('homepage.topbeers.get_it')}
                                </div>
                            </a>
                        </div>
                    </article>
                    {/*  producto 5 */}
                    <article className="mr-4 hidden w-full max-w-[300px] bg-no-repeat lg:block">
                        <h4 className="bg-cerv-coffee text-center font-semibold text-cerv-cream uppercase">
                            Benzin
                        </h4>
                        <div className="h-[320px] bg-[url('/assets/home/benzin.jpg')] bg-cover bg-center bg-no-repeat">
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
                            <a href="https://www.cervezanas.beer/es/products/4a7e278e-085f-4ffc-81bf-739e88583be8">
                                <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream hover:bg-cerv-titlehigh cursor-pointer">
                                    {t('homepage.topbeers.get_it')}
                                </div>
                            </a>
                        </div>
                    </article>
                </div>
            </section>
        </>
    );
}
