import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function History() {
    const t = useTranslations();
    return (
        <>
            {/*  bloque 5 */}
            <section className="relative m-auto w-full max-w-screen-2xl justify-center bg-[url('/assets/home/fondo-marcas.webp')] bg-cover bg-no-repeat p-8 pb-20">
                <header className="mb-8 text-center text-4xl font-bold text-cerv-coffee md:text-5xl lg:text-left">
                    {t('homepage.history.brand_history_header')}
                </header>
                <figure className="absolute -top-6 right-0 hidden h-[600px] w-[140px] bg-[url('/assets/home/botella-qr.webp')] bg-contain bg-right-top bg-no-repeat lg:block"></figure>
                <div className="block lg:flex">
                    <div className="text-1xl mb-4 mr-6 w-full bg-cerv-titlehigh bg-opacity-80 p-7 pt-20 text-white lg:w-1/2">
                        {t('homepage.history.brand_history_body')}
                        <Image
                            className="m-auto mt-8"
                            src="/assets/detalle-w.svg"
                            width={160}
                            height={30}
                            alt="Dingbat"
                        />
                    </div>
                    <div className="w-full  bg-cerv-cream p-7 text-center lg:w-1/2 lg:pr-32">
                        <div className="text-4xl font-bold text-cerv-coffee">
                            {t('homepage.history.brand_scan_QR')}
                        </div>
                        <div className="pt-4 text-2xl">
                            {t('homepage.history.adventages_header')}
                            <ul className="pt-4 font-semibold">
                                <li>
                                    {t('homepage.history.adventages_item1')}
                                </li>
                                <li>
                                    {t('homepage.history.adventages_item2')}
                                </li>
                                <li>
                                    {t('homepage.history.adventages_item3')}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
