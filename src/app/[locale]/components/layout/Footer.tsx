'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <footer className="relative z-10 w-full bg-cerv-coffee dark:bg-gray-900 border-t-8 border-beer-blonde px-4 pt-12 md:px-24 lg:px-8">
            <div className="absolute inset-0 z-[-1]">
                <Image
                    src="/assets/rec-graf4c.png"
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority={true}
                />
            </div>

            <div className="grid gap-16 lg:grid-cols-6 max-w-[1240px] mx-auto">
                {/* Descripción de la empresa */}
                <div className="lg:col-span-2">
                    <Link
                        href="/"
                        aria-label="Go home"
                        title="Company"
                        className="inline-flex items-center"
                        locale={locale}
                    >
                        <Image
                            src={'/logo_cervezanas.svg'}
                            alt="Logo"
                            width={64} // Adjusted to desired size
                            height={64}
                            priority={true}
                        />

                        <span className="ml-2 text-3xl font-bold uppercase tracking-wide text-cerv-banana">
                            Cervezanas
                        </span>
                    </Link>

                    <p className="w-full mt-4 text-lg text-white dark:text-gray-300 italic max-w-xl">
                        Somos una comunidad de productores, distribuidores y
                        apasionados de la cerveza artesanal, buscando fomentar
                        el intercambio de conocimientos y la innovación en el
                        sector
                    </p>
                </div>

                {/* Links */}
                <div className="row-gap-8 grid grid-cols-1 gap-5 sm:grid-cols-12 lg:col-span-12">
                    {/* Quienes somos  */}
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <p className="font-semibold tracking-wide text-cerv-banana">
                            {t('who_we_are_question')}
                        </p>

                        <ul className="mt-2 space-y-2">
                            <li>
                                <Link
                                    href="/quienes-somos"
                                    className="text-white transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                                    locale={locale}
                                >
                                    {t('who_we_are')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/compromisos"
                                    className="text-white transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                                    locale={locale}
                                >
                                    {t('commitments')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/condiciones-de-compra"
                                    className="text-white transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                                    locale={locale}
                                >
                                    {t('purchase_conditions')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/aviso-legal"
                                    className="text-white transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                                    locale={locale}
                                >
                                    {t('legal_notice')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacidad"
                                    className="text-white transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                                    locale={locale}
                                >
                                    {t('privacy_policy')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contactar  */}
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:flex gap-4">
                        <div>
                            <p className="font-semibold tracking-wide text-cerv-banana">
                                {t('contact_us')}
                            </p>

                            <p className="flex space-y-4 flex-col">
                                <span className=" text-white">
                                    {t('phone_number')}: <b>+34 687 85 96 55</b>
                                </span>
                                <span className=" text-white">
                                    {t('email')}: <b>info@cervezanas.beer</b>
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:flex gap-4">
                        <ul className="mt-2 space-y-2">
                            <li>
                                <Link
                                    href="/soporte"
                                    className="text-deep-purple-50 transition-colors duration-300 hover:font-semibold hover:text-beer-blonde text-white"
                                    locale={locale}
                                >
                                    {t('support_center')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/soporte/contacto"
                                    className="text-deep-purple-50 transition-colors duration-300 hover:font-semibold hover:text-beer-blonde text-white"
                                    locale={locale}
                                >
                                    {t('contact')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/soporte/devoluciones-y-garantia"
                                    className="text-deep-purple-50 transition-colors duration-300 hover:font-semibold hover:text-beer-blonde text-white"
                                    locale={locale}
                                >
                                    {t('returns_and_warranty')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/cookies"
                                    className="text-deep-purple-50 transition-colors duration-300 hover:font-semibold hover:text-beer-blonde text-white"
                                    locale={locale}
                                >
                                    {t('cookie_policy')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Sistemas de pago aceptado  */}
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <p className="font-semibold tracking-wide  text-cerv-banana">
                            {t('payment_system')}
                        </p>
                        <figure className="flex h-auto w-auto space-x-2">
                            {/* Visa card image logo */}
                            <Image
                                src={'/icons/payments/visa.png'}
                                alt="Visa"
                                width={80}
                                height={55}
                                priority={true}
                            />

                            {/* Mastercard card image logo */}
                            <Image
                                src={'/icons/payments/mastercard.png'}
                                alt="Mastercard"
                                width={80}
                                height={55}
                                priority={true}
                            />
                        </figure>
                    </div>
                </div>
            </div>

            <div className="border-deep-purple-accent-200 flex flex-col justify-between border-t pb-10 pt-5 sm:flex-row">
                <p className="text-sm text-gray-100 m-auto">{t('copyright')}</p>

                {/* RRSS Icons  */}
                <div className="mt-4 flex items-center justify-center space-x-4 sm:mt-0">
                    <Link
                        href="/"
                        className="text-deep-purple-100 transition-colors duration-300 hover:text-beer-blonde text-white"
                        locale={locale}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z"></path>
                        </svg>
                    </Link>

                    <Link
                        href="/"
                        className="text-deep-purple-100 transition-colors duration-300 hover:text-beer-blonde text-white"
                        locale={locale}
                    >
                        <svg
                            viewBox="0 0 30 30"
                            fill="currentColor"
                            className="h-6 w-6"
                        >
                            <circle cx="15" cy="15" r="4"></circle>
                            <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"></path>
                        </svg>
                    </Link>
                    <Link
                        href="/"
                        className="text-deep-purple-100 transition-colors duration-300 hover:text-beer-blonde text-white"
                        locale={locale}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"></path>
                        </svg>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
