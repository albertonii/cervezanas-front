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
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={100}
                    priority
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
                            src="/logo_cervezanas.svg"
                            alt="Logo"
                            width={64}
                            height={64}
                            priority
                        />
                        <span className="ml-2 text-3xl font-bold uppercase tracking-wide text-cerv-banana">
                            Cervezanas
                        </span>
                    </Link>

                    <p className="w-full mt-4 text-lg text-white dark:text-gray-300 italic max-w-xl">
                        {t('footer_description') ||
                            'Somos una comunidad de productores, distribuidores y apasionados de la cerveza artesanal, fomentando el intercambio de conocimientos.'}
                    </p>
                </div>

                {/* Sección de enlaces */}
                <div className="row-gap-8 grid grid-cols-1 gap-5 sm:grid-cols-12 lg:col-span-12">
                    {/* Quiénes somos */}
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

                    {/* Contactar */}
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:flex gap-4">
                        <div>
                            <p className="font-semibold tracking-wide text-cerv-banana">
                                {t('contact_us')}
                            </p>
                            <p className="flex flex-col space-y-4">
                                <span className="text-white">
                                    {t('phone_number')}: <b>+34 687 85 96 55</b>
                                </span>
                                <span className="text-white">
                                    {t('email')}: <b>info@cervezanas.beer</b>
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Soporte / Otros links */}
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:flex gap-4">
                        <ul className="mt-2 space-y-2">
                            <li>
                                <Link
                                    href="/soporte"
                                    className="text-white transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                                    locale={locale}
                                >
                                    {t('support_center')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/soporte/contacto"
                                    className="text-white transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                                    locale={locale}
                                >
                                    {t('contact')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/soporte/devoluciones-y-garantia"
                                    className="text-white transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                                    locale={locale}
                                >
                                    {t('returns_and_warranty')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/cookies"
                                    className="text-white transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                                    locale={locale}
                                >
                                    {t('cookie_policy')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Sistemas de pago aceptado */}
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <p className="font-semibold tracking-wide  text-cerv-banana">
                            {t('payment_system')}
                        </p>
                        <figure className="flex h-auto w-auto space-x-2">
                            <Image
                                src="/icons/payments/visa.png"
                                alt="Visa"
                                width={80}
                                height={55}
                                priority
                            />
                            <Image
                                src="/icons/payments/mastercard.png"
                                alt="Mastercard"
                                width={80}
                                height={55}
                                priority
                            />
                        </figure>
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse justify-between border-t border-deep-purple-accent-200 pb-10 pt-5 sm:flex-row">
                <p className="m-auto text-sm text-gray-100 sm:m-0">
                    {t('copyright')}
                </p>

                {/* RRSS Icons */}
                <div className="mt-4 flex items-center justify-center space-x-4 sm:mt-0">
                    <Link
                        href="/"
                        className="text-white transition-colors duration-300 hover:text-beer-blonde"
                        locale={locale}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8 ..."></path>
                        </svg>
                    </Link>

                    <Link
                        href="/"
                        className="text-white transition-colors duration-300 hover:text-beer-blonde"
                        locale={locale}
                    >
                        <svg
                            viewBox="0 0 30 30"
                            fill="currentColor"
                            className="h-6 w-6"
                        >
                            <circle cx="15" cy="15" r="4"></circle>
                            <path d="M19.999,3h-10C6.14,3,3, ..."></path>
                        </svg>
                    </Link>

                    <Link
                        href="/"
                        className="text-white transition-colors duration-300 hover:text-beer-blonde"
                        locale={locale}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0, ..."></path>
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Botón llamativo para ir a /report en nueva pestaña */}
            <div className="my-6 flex justify-center">
                <Link
                    href="/report"
                    target="_blank"
                    className="inline-block rounded-md bg-beer-blonde px-6 py-3 text-base font-semibold text-cerv-coffee
                     transition-colors duration-300 hover:bg-beer-draft hover:text-beer-blonde"
                    locale={locale}
                >
                    {t('report_button_label') || '¡Reportar un problema!'}
                </Link>
            </div>
        </footer>
    );
}
