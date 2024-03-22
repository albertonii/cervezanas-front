import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function MonthlyBeersDesign() {
    const t = useTranslations();
    return (
        <>
            {/*  bloque 4 */}
            <section className="relative -top-12 m-auto w-full max-w-screen-2xl justify-center bg-cerv-titlehigh p-5">
                <figure className="absolute right-0 h-[600px] w-[600px] bg-[url('/assets/rec-graF3.webp')] bg-contain bg-right-top bg-no-repeat opacity-20 mix-blend-multiply"></figure>
                <header className="relative z-10 text-3xl font-bold text-white md:text-5xl">
                    {t('homepage.monthlybeers.selection')}
                    <Image
                        className="float-left m-auto p-3"
                        src="/assets/detalle-w.svg"
                        width={160}
                        height={20}
                        alt="Dingbat"
                    />
                </header>
                <div className="relative z-10 w-full pb-6 pt-6 text-cerv-cream lg:w-8/12">
                    {t('homepage.monthlybeers.intro')}
                </div>
                <div className="block w-full sm:flex lg:w-8/12">
                    {/*  producto 1 */}
                    <article className="relative z-10 m-auto mb-4 w-[250px] bg-no-repeat sm:mr-4 sm:w-1/3">
                        <div className="bg-cerv-coffee text-center font-semibold text-cerv-cream uppercase">
                            CCVK La villana
                        </div>
                        <div className="h-[320px] bg-[url('/assets/home/ccvk-villana.jpg')] bg-cover bg-center bg-no-repeat">
                            <figure className="relative left-4 top-3">
                                <Image
                                    src="/assets/cerv-mes.webp"
                                    width={70}
                                    height={70}
                                    alt="Logo Cerveza del mes"
                                />
                            </figure>
                            <div className="relative right-2 float-right ">
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/heart.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    15
                                </figure>
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/bla.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    25
                                </figure>
                            </div>
                            <div className="relative top-48 w-max border-b-2  border-r-2 border-t-2 border-yellow-400 bg-cerv-coffee p-1 pr-3 text-xs font-bold text-white">
                                Comité expertos
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <figure className=" text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={18}
                                    alt="ranking"
                                />
                            </figure>
                            <a href="https://www.cervezanas.beer/es/products/7b25c112-6fa8-4a50-bc33-ee34a27f80d8">
                                <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream hover:bg-cerv-titlehigh cursor-pointer">
                                    {t('homepage.monthlybeers.get_it')}
                                </div>
                            </a>
                        </div>
                    </article>
                    {/*  producto 2 */}
                    <article className="relative z-10 m-auto mb-4 w-[250px] bg-no-repeat sm:mr-4 sm:w-1/3">
                        <div className="bg-cerv-coffee text-center font-semibold text-cerv-cream uppercase">
                            Fera de la Clamor Eco
                        </div>
                        <div className="h-[320px] bg-[url('/assets/home/fera.jpg')] bg-cover bg-no-repeat">
                            <figure className="relative left-4 top-3">
                                <Image
                                    src="/assets/cerv-mes.webp"
                                    width={70}
                                    height={70}
                                    alt="Logo Cerveza del mes"
                                />
                            </figure>
                            <div className="relative right-2 float-right ">
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/heart.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    10
                                </figure>
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/bla.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    21
                                </figure>
                            </div>
                            <div className="relative top-48 w-max border-b-2  border-r-2 border-t-2 border-yellow-400 bg-cerv-coffee p-1 pr-3 text-xs font-bold text-white">
                                Comunidad
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <figure className=" text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={18}
                                    alt="ranking"
                                />
                            </figure>
                            <a href="https://www.cervezanas.beer/es/products/9f03764d-1010-4fa7-9a6b-492cde611a34">
                                <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream hover:bg-cerv-titlehigh cursor-pointer">
                                    {t('homepage.monthlybeers.get_it')}
                                </div>
                            </a>
                        </div>
                    </article>
                    {/*  producto 3 */}
                    <article className="relative z-10 m-auto mb-4 w-[250px] bg-no-repeat sm:mr-4 sm:w-1/3">
                        <div className="bg-cerv-coffee text-center font-semibold text-cerv-cream uppercase">
                            CCVK VII TITS
                        </div>
                        <div className="h-[320px] bg-[url('/assets/home/ccvk-vii-tits.jpg')] bg-cover bg-no-repeat">
                            <div className="relative left-4 top-3">
                                <Image
                                    src="/assets/cerv-mes.webp"
                                    width={70}
                                    height={70}
                                    alt="Logo Cerveza del mes"
                                />
                            </div>
                            <div className="relative right-2 float-right ">
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/heart.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    12
                                </figure>
                                <figure className="h-[30px] w-[30px] bg-[url('/assets/bla.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
                                    15
                                </figure>
                            </div>
                            <div className="relative top-48 w-max border-b-2  border-r-2 border-t-2 border-yellow-400 bg-cerv-coffee p-1 pr-3 text-xs font-bold text-white">
                                Revelación
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <figure className=" text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={18}
                                    alt="ranking"
                                />
                            </figure>
                            <a href="https://www.cervezanas.beer/es/products/c685dccc-7c1a-4f87-a527-fa51c77b23dd">
                                <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream hover:bg-cerv-titlehigh cursor-pointer">
                                    {t('homepage.monthlybeers.get_it')}
                                </div>
                            </a>
                        </div>
                    </article>
                </div>
            </section>
        </>
    );
}
