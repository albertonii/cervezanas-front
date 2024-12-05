import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function Community() {
    const t = useTranslations();
    return (
        <>
            {/*  bloque 6 */}
            <section className="relative m-auto w-full max-w-screen-2xl justify-center bg-cerv-cream bg-[url('/assets/rec-graf5.webp')] bg-contain pb-20 pt-10 rounded-b-full overflow-hidden md:overflow-visible dark:bg-cerv-coffee">
                <figure className="-mt-8 absolute top-2 m-auto h-[80px] w-full  bg-[url('/assets/home/bg-brush.webp')] bg-cover bg-no-repeat bg-top"></figure>
                <figure className="z-index-2 relative top-2 m-auto h-[190px] w-[190px]  bg-[url('/assets/logo.svg')] bg-contain bg-no-repeat"></figure>
                <header className="mb-10 text-center text-3xl font-bold text-cerv-titlehigh md:text-5xl font-['NexaRust']">
                    {t('homepage.community.header')}
                    <p className="font-['NexaRust-script'] text-6xl md:text-8xl -mt-2 -mb-8 text-beer-draft -rotate-2 dark:text-beer-softBlonde">
                        {' '}
                        {t('homepage.community.header2')}
                    </p>
                </header>
                {/*  Productor */}
                <article className="m-auto flex w-[900px] flex-col md:flex-row max-w-full">
                    <figure className="m-auto w-full max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto p-8 md:p-16 rounded-l-full border-l-2 border-beer-blonde max-w-[400px] md:max-w-[500px]"
                            src="/assets/home/com-1.webp"
                            width={600}
                            height={600}
                            alt="Productor"
                        />
                    </figure>
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <h3 className="mb-8 pt-3 text-center text-4xl md:text-6xl font-bold text-cerv-banana font-['NexaRust-script']">
                            {t('homepage.community.manufacturer')}
                        </h3>
                        <div className="mb-8 pt-3 text-xl font-normal text-black text-center dark:text-white">
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
                <article className="m-auto flex w-[900px] flex-col md:flex-row max-w-full">
                    <div className="m-auto w-full p-10 sm:w-2/4  order-2 md:order-1">
                        <h3 className="mb-8 pt-3 text-center text-4xl md:text-6xl font-bold text-cerv-banana font-['NexaRust-script']">
                            {t('homepage.community.consumer')}
                        </h3>
                        <div className="mb-8 pt-3 text-xl font-normal text-black text-center  dark:text-white">
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
                    <div className="m-auto w-full  max-w-[300px] sm:w-2/4 sm:max-w-5xl order-1 md:order-2">
                        <Image
                            className="m-auto p-8 sm:p-16 rounded-r-full border-r-2 border-beer-blonde max-w-[300px] md:max-w-[500px] pl-0 -ml-4"
                            src="/assets/home/com-2.webp"
                            width={600}
                            height={600}
                            alt="Consumidor"
                        />
                    </div>
                </article>
                {/*  Distribuidores */}
                <article className="m-auto flex w-[900px] flex-col md:flex-row max-w-full">
                    <figure className="m-auto w-full  max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto p-8 sm:p-16 rounded-l-full border-l-2 border-beer-blonde max-w-[400px] md:max-w-[500px]"
                            src="/assets/home/com-3.webp"
                            width={600}
                            height={600}
                            alt="Distribuidores"
                        />
                    </figure>
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <h3 className="mb-8 pt-3 text-center text-4xl md:text-6xl font-bold text-cerv-banana font-['NexaRust-script']">
                            {t('homepage.community.dealers')}
                        </h3>
                        <div className="mb-8 pt-3 text-xl font-normal text-black text-center dark:text-white">
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
                <article className="m-auto flex w-[900px] flex-col md:flex-row max-w-full">
                    <div className="m-auto w-full p-10 sm:w-2/4 order-2 md:order-1 ">
                        <h3 className="mb-8 pt-3 text-center text-4xl md:text-6xl font-bold text-cerv-banana font-['NexaRust-script']">
                            {t('homepage.community.points')}
                        </h3>
                        <div className="mb-8 pt-3 text-xl font-normal text-black text-center dark:text-white">
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
                    <figure className="m-auto w-full  max-w-[300px] sm:w-2/4 sm:max-w-5xl order-1 md:order-2">
                        <Image
                            className="m-auto p-8 sm:p-16 rounded-r-full border-r-2 border-beer-blonde max-w-[300px] md:max-w-[500px] pl-0 -ml-4"
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
