import '../../styles/globals.css';

import Header from './Header';
import classNames from 'classnames';
import Providers from './providers';
import Footer from './components/Footer';
import readUserSession from '../../lib/actions';
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
            <section className="relative flex flex-col bg-beer-foam">
                <Header
                    notifications={notifications ?? []}
                    i18nLocaleArray={i18n.locales}
                />
                <section
                    className={classNames(
                        'relative mx-auto min-h-0 w-full overflow-auto',
                        // "h-[calc(100vh - 340px)] mx-auto mt-[10vh] w-full overflow-y-auto"
                    )}
                >
                    {/* <Breadcrumb getDefaultTextGenerator={(path) => titleize(path)} /> */}
                </section>

                <main
                    className={classNames(
                        'relative mx-auto min-h-full w-full transform pt-0 transition lg:container',
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
        .eq('read', false)
        .eq('user_id', session.id);

    if (notificationsError) throw notificationsError;
    return notifications as INotification[];
};
