import '../../styles/globals.css';

import HeaderMenu from './HeaderMenu';
import classNames from 'classnames';
import Providers from './providers';
import Footer from './components/Footer';
import readUserSession from '../../lib/actions';
import Breadcrumb from './components/Breadcrumb';
import createServerClient from '../../utils/supabaseServer';
import { notFound } from 'next/navigation';
import { INotification } from '../../lib/types/types';
import { MessageList } from './components/message/MessageList';

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
        messages = (
            await import(`../../lib/translations/messages/${locale}.json`)
        ).default;
    } catch (error) {
        notFound();
    }

    const notifications = await getNotifications();

    const i18n = {
        defaultLocale: 'es',
        locales: ['es', 'en'],
    };

    return (
        <Providers session={session} messages={messages} locale={locale}>
            <section className="relative flex flex-col bg-beer-foam dark:bg-gray-800">
                <HeaderMenu
                    notifications={notifications ?? []}
                    i18nLocaleArray={i18n.locales}
                />
                <section
                    className={classNames(
                        'relative mx-auto w-full overflow-auto lg:container max-w-[1536px] lg:max-w-[1536px]',
                    )}
                >
                    <Breadcrumb
                        homeElement={'Home'}
                        separator={<span> | </span>}
                        containerClasses="flex py-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-beer-dark text-beer-blonde text-sm px-4"
                        listClasses="hover:underline mx-1"
                        activeClasses="text-amber-500"
                        capitalizeLinks={true}
                    />
                </section>

                <main
                    className={classNames(
                        'relative mx-auto my-0 min-h-[60vh] w-full transform pt-0 transition lg:container mb-10 max-w-[1900px] lg:max-w-full',
                    )}
                >
                    <MessageList />
                    {children}
                </main>

                <Footer />
            </section>
        </Providers>
    );
}

const getNotifications = async () => {
    const supabase = await createServerClient();

    // Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
    const session = await readUserSession();

    if (!session) return;

    const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')

        .select(
            `
                *
            `,
        )
        .eq('user_id', session.id)
        .limit(15);

    if (notificationsError) throw notificationsError;
    return notifications as INotification[];
};
