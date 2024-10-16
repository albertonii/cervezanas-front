import '../../styles/globals.css';

import Providers from './providers';
import HeaderMenu from './HeaderMenu';
import classNames from 'classnames';
import Footer from './components/layout/Footer';
import Breadcrumb from './components/layout/Breadcrumb';
import createServerClient from '@/utils/supabaseServer';
import { notFound } from 'next/navigation';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { MessageList } from './components/message/MessageList';
import AgeVerificationBanner from './components/ageBanner/AgeVerificationBanner';
import CookieBanner from './components/cookieBanner/CookieBanner';

type LayoutProps = {
    children: React.ReactNode;
    params: {
        locale: string;
    };
};

// This will ensure that every time a new route is loaded, our session data in RootLayout will always be up-to-date.
export const revalidate = 0;

export default async function AppLocaleLayout({
    children,
    params: { locale },
}: LayoutProps) {
    const supabase = await createServerClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    let messages;
    try {
        messages = (await import(`@/lib//translations/messages/${locale}.json`))
            .default;
    } catch (error) {
        notFound();
    }

    const i18n = {
        defaultLocale: 'es',
        locales: ['es', 'en'],
    };

    return (
        <Providers session={session} messages={messages} locale={locale}>
            <section className="relative flex flex-col bg-beer-foam dark:bg-gray-800">
                <HeaderMenu i18nLocaleArray={i18n.locales} />
                <section
                    className={classNames(
                        'relative mx-auto w-full overflow-auto lg:container max-w-[1536px] lg:max-w-[1536px]',
                    )}
                >
                    <Breadcrumb />
                </section>

                <main
                    className={classNames(
                        'relative mx-auto my-0 min-h-[60vh] w-full transform pt-0 transition lg:container mb-10 max-w-[1900px] lg:max-w-full',
                    )}
                >
                    <MessageList />
                    <SpeedInsights />
                    {children}
                </main>

                <Footer />
                <AgeVerificationBanner />
                <CookieBanner />
            </section>
        </Providers>
    );
}
