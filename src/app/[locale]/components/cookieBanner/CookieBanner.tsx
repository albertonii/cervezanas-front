'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const CookieBanner: React.FC = () => {
    const [cookiesHandled, setCookiesHandled] = useState(false);
    const t = useTranslations();
    const locale = useLocale();

    useEffect(() => {
        const hasAcceptedCookies = Cookies.get('cookiesAccepted');
        const hasRejectedCookies = Cookies.get('cookiesRejected');

        if (hasAcceptedCookies || hasRejectedCookies) {
            setCookiesHandled(true);
        }
    }, []);

    const acceptCookies = () => {
        Cookies.set('cookiesAccepted', 'true', { expires: 365 });
        setCookiesHandled(true);
    };

    const rejectCookies = () => {
        Cookies.set('cookiesRejected', 'true', { expires: 365 });
        setCookiesHandled(true);
    };

    if (cookiesHandled) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex bg-gray-800 p-4 text-white">
            <div className="flex-grow">
                <div className="mb-5 text-sm">
                    Para ofrecer la mejor experiencia, utilizamos tecnologías
                    como las cookies para almacenar y/o acceder a la información
                    del dispositivo. El consentimiento a estas tecnologías nos
                    permitirá procesar datos como el comportamiento de
                    navegación o las identificaciones únicas en este sitio. No
                    consentir o retirar el consentimiento, puede afectar
                    negativamente a ciertas características y funciones.
                </div>
                <div className="mb-3 flex justify-center space-x-6">
                    {' '}
                    <Link
                        href="/cookies"
                        className="text-xs text-gray-200 transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                        locale={locale}
                    >
                        {t('cookie_policy')}
                    </Link>
                    <Link
                        href="/privacidad"
                        className="text-xs text-gray-200  transition-colors duration-300 hover:font-semibold hover:text-beer-blonde"
                        locale={locale}
                    >
                        {t('privacy_policy')}
                    </Link>
                </div>
            </div>
            <div className="ml-4 flex flex-col">
                {' '}
                <button
                    onClick={acceptCookies}
                    className="mb-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    Aceptar
                </button>
                <button
                    onClick={rejectCookies}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                    Rechazar
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;
