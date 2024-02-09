import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function Community() {
    const t = useTranslations();
    return (
        <>
            {/*  bloque 6 */}
            <section className="relative m-auto w-full max-w-screen-2xl justify-center bg-cerv-cream bg-[url('/assets/rec-graf5.webp')] bg-contain pb-20 pt-10">
                <figure className="z-index-1 relative -top-8 m-auto h-[190px] w-[190px]  bg-[url('/assets/logo.svg')] bg-contain bg-no-repeat"></figure>
                <header className="mb-10 text-center text-4xl font-bold text-cerv-coffee md:text-6xl">
                    {t('homepage.community.header')}
                </header>
                {/*  Productor */}
                <article className="m-auto block sm:flex">
                    <figure className="m-auto w-full  max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto p-0 sm:p-16"
                            src="/assets/home/com-1.webp"
                            width={600}
                            height={600}
                            alt="Productor"
                        />
                    </figure>
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <h3 className="mb-8 pt-3 text-center text-4xl font-bold text-cerv-banana">
                            {t('homepage.community.manufacturer')}
                        </h3>
                        <div className="mb-8 pt-3 text-xl font-normal text-black">
                            {t('homepage.community.manufacturer_body')}
                        </div>
                        <figure className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={120}
                                height={20}
                                alt="Dingbat"
                            />
                        </figure>
                    </div>
                </article>
                {/*  Consumidor */}
                <article className="m-auto block sm:flex">
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <h3 className="mb-8 pt-3 text-center text-4xl font-bold text-cerv-banana">
                            {t('homepage.community.consumer')}
                        </h3>
                        <div className="mb-8 pt-3 text-xl font-normal text-black">
                            {t('homepage.community.consumer_body')}
                        </div>
                        <figure className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={120}
                                height={20}
                                alt="Dingbat"
                            />
                        </figure>
                    </div>
                    <div className="m-auto w-full  max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto p-0 sm:p-16"
                            src="/assets/home/com-2.webp"
                            width={600}
                            height={600}
                            alt="Consumidor"
                        />
                    </div>
                </article>
                {/*  Distribuidores */}
                <article className="m-auto block sm:flex">
                    <figure className="m-auto w-full  max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto p-0 sm:p-16"
                            src="/assets/home/com-1.webp"
                            width={600}
                            height={600}
                            alt="Distribuidores"
                        />
                    </figure>
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <h3 className="mb-8 pt-3 text-center text-4xl font-bold text-cerv-banana">
                            {t('homepage.community.dealers')}
                        </h3>
                        <div className="mb-8 pt-3 text-xl font-normal text-black">
                            {t('homepage.community.dealers_body')}
                        </div>
                        <figure className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={120}
                                height={20}
                                alt="Dingbat"
                            />
                        </figure>
                    </div>
                </article>
                {/*  Puntos cervezanos */}
                <article className="m-auto block sm:flex">
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <h3 className="mb-8 pt-3 text-center text-4xl font-bold text-cerv-banana">
                            {t('homepage.community.points')}
                        </h3>
                        <div className="mb-8 pt-3 text-xl font-normal text-black">
                            {t('homepage.community.points_body')}
                        </div>
                        <figure className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={120}
                                height={20}
                                alt="Dingbat"
                            />
                        </figure>
                    </div>
                    <figure className="m-auto w-full  max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto p-0 sm:p-16"
                            src="/assets/home/com-4.webp"
                            width={600}
                            height={600}
                            alt="Puntos cervezanos"
                        />
                    </figure>
                </article>
            </section>
        </>
    );
}
