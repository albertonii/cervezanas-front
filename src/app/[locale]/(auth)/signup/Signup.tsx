'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Context/useAuth';
import { VIEWS } from '../../../../constants';
import { SignUpForm } from './SignUpForm';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const DynamicSpinner = dynamic(
    () => import('../../components/common/Spinner'),
    {
        ssr: false,
    },
);

export default function Signup() {
    const t = useTranslations();
    const locale = useLocale();
    const [isPageLoad, setIsPageLoad] = useState(false);

    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setIsPageLoad(true);
    }, []);

    // If the user is already logged in, then
    // redirect them to home.
    useEffect(() => {
        if (user) {
            router.push(`/${locale}`);
        }
    }, [user]);

    if (!isPageLoad) {
        return (
            <DynamicSpinner color="beer-blonde" size={'fullScreen'} absolute />
        );
    }

    return (
        <section className="w-full lg:grid lg:grid-cols-2">
            {/* Signup form  */}
            <article className="mx-auto flex w-[80vw] sm:w-[60vw] flex-1 gap-4 flex-col justify-start px-4 py-12 sm:px-6 lg:w-full lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <span>
                        <h2 className="mt-6 text-start text-3xl font-bold tracking-tight text-gray-900">
                            {t('create_account')}
                        </h2>
                    </span>

                    <SignUpForm />

                    <p className="my-2 flex w-full justify-start text-sm text-gray-700">
                        {t('already_account')}
                        <Link
                            className="cursor-pointer font-bold"
                            href={VIEWS.SIGN_IN}
                            locale={locale}
                        >
                            <span className="mx-1 text-beer-darkGold hover:underline">
                                {t('access_account')}
                            </span>
                        </Link>
                    </p>
                </div>
            </article>

            {/* Hero Image */}
            <div className="hidden w-full justify-center lg:flex">
                <Image
                    style={{ aspectRatio: '4/5' }}
                    className="inset-0 rounded-3xl lg:w-[30vw]"
                    alt="Cervezanas artesanales"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    width={1024}
                    height={768}
                    src={'/assets/profile_signup.jpg'}
                />
            </div>
        </section>
    );
}
