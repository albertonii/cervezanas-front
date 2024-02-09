import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function Reviews() {
    const t = useTranslations();
    return (
        <>
            {/*  bloque 7 */}
            <section className="relative m-auto w-full  max-w-screen-2xl justify-center overflow-hidden bg-cerv-titlehigh p-5 ">
                <figure className="absolute -left-36 top-20 h-[600px] w-[600px] bg-[url('/assets/rec-graf4.webp')] bg-contain bg-right-top bg-no-repeat opacity-20 mix-blend-multiply"></figure>
                <header className="mb-20 mt-10 text-center text-4xl font-bold text-white md:text-5xl">
                    {t('homepage.history.brand_history_header')}
                </header>
                {/*  review 1 */}
                <article className="relative z-10 m-auto block max-w-4xl bg-cerv-brown bg-opacity-70 px-10 pt-10 sm:flex">
                    <div className="w-full border-b-2 pb-10 text-white sm:w-2/6 sm:border-yellow-400">
                        <div className="text-xs">01/01/2023</div>
                        <div className="text-center text-xl sm:text-left">
                            Iñaki Aranguren
                        </div>
                        <div className="text-center text-ml sm:text-left text-beer-softFoam">
                            Consumidor Cervezano
                        </div>
                    </div>
                    <figure className="w-full border-b-2 pb-10 sm:w-1/6 sm:border-yellow-400">
                        <Image
                            className="m-auto"
                            src="/assets/estrellas-fake.webp"
                            width={100}
                            height={20}
                            alt="ranking"
                        />
                    </figure>
                    <div className="w-full border-b-2 border-yellow-400 px-10 pb-10 sm:w-3/6">
                        <div className="font-bold text-yellow-400 ">
                            Todo perfecto
                        </div>
                        <div className="text-white">
                            Hice un pedido de cervezas para probar y todo ha ido
                            sobre ruedas. Las cervezas me han encantado, ojalá
                            sigan ampliando pronto el catálogo{' '}
                        </div>
                    </div>
                </article>
                {/*  review 2 */}
                <article className="relative z-10 m-auto block max-w-4xl bg-cerv-brown bg-opacity-70 px-10 pt-10 sm:flex">
                    <div className="w-full border-b-2 pb-10 text-white sm:w-2/6 sm:border-yellow-400">
                        <div className="text-xs">01/01/2023</div>
                        <div className="text-center text-xl sm:text-left">
                            María Schneider
                        </div>{' '}
                        <div className="text-center sm:text-left text-beer-softFoam">
                            Productor Cervezano
                        </div>
                    </div>
                    <figure className=" w-full border-b-2 pb-10 sm:w-1/6 sm:border-yellow-400">
                        <Image
                            className="m-auto"
                            src="/assets/estrellas-fake.webp"
                            width={100}
                            height={20}
                            alt="ranking"
                        />
                    </figure>
                    <div className="w-full border-b-2 border-yellow-400 px-10 pb-10 sm:w-3/6">
                        <div className="font-bold text-yellow-400 ">
                            Una plataforma muy completa
                        </div>
                        <div className="text-white">
                            Me registré para formar parte de la Comunidad
                            Cervezanas hace dos semanas. Desde entonces he
                            podido aumentar la distribución y la venta de mis
                            cervezas en toda España y en eventos donde antes era
                            imposible.
                        </div>
                    </div>
                </article>
                {/*  review 3 */}
                <article className="relative z-10 m-auto block max-w-4xl bg-cerv-brown bg-opacity-70 px-10 pt-10 sm:flex">
                    <div className="w-full border-b-2 pb-10 text-white sm:w-2/6 sm:border-yellow-400">
                        <div className="text-xs">01/01/2023</div>
                        <div className="text-center text-xl sm:text-left">
                            Pedro Moliner
                        </div>
                        <div className="text-center sm:text-left text-beer-softFoam">
                            Creador de eventos
                        </div>
                    </div>
                    <figure className=" w-full border-b-2 pb-10 sm:w-1/6 sm:border-yellow-400">
                        <Image
                            className="m-auto"
                            src="/assets/estrellas-fake.webp"
                            width={100}
                            height={20}
                            alt="ranking"
                        />
                    </figure>
                    <div className="w-full border-b-2 border-yellow-400 px-10 pb-10 sm:w-3/6">
                        <div className="font-bold text-yellow-400 ">
                            Una manera fácil de ofrecer más variedad
                        </div>
                        <div className="text-white">
                            Organizo eventos que por sus características encajan
                            muy bien con el público cervecero. Con la plataforma
                            puedo ofrecer mucha más variedad que antes y de la
                            manera más fácil.
                        </div>
                    </div>
                </article>
            </section>
            {/*  bloque 8 */}
            <div className=""></div>
            <figure className="relative m-auto w-full max-w-screen-2xl justify-center">
                <Image
                    className="m-auto w-full"
                    src="/assets/home/prefooter.webp"
                    width={1400}
                    height={300}
                    alt="Cervezas"
                />
            </figure>
        </>
    );
}
