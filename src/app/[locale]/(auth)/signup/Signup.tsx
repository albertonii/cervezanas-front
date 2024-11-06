'use client';

import Link from 'next/link';
import Image from 'next/image';
import Spinner from '../../components/ui/Spinner';
import React, { useEffect, useState } from 'react';
import { VIEWS } from '@/constants';
import { SignUpForm } from './SignUpForm';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import Title from '../../components/ui/Title';

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
        return <Spinner color="beer-blonde" size={'fullScreen'} absolute />;
    }

    return (
        <section className="w-full lg:grid lg:grid-cols-2 bg-[url('/assets/home/bg-home.webp')] bg-auto bg-repeat bg-top h-full">
            {/* Signup form  */}
            <article className="mx-auto flex w-[80vw] sm:w-[60vw] flex-1 gap-4 flex-col justify-start pl-4 py-12 sm:pl-6 lg:w-full lg:flex-none lg:pl-20 xl:pl-24">
                <div className="w-full justify-start lg:w-full mx-auto flex flex-1 flex-col lg:flex-none ">
                    <Title size="xlarge" color="beer-blonde">
                        {t('create_account')}
                    </Title>

                    <SignUpForm />

                    <p className="my-2 flex w-full justify-start text-sm text-gray-700 dark:text-gray-300">
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
            <figure className="hidden lg:flex w-full justify-center items-center">
                <Image
                    style={{ aspectRatio: '4/5' }}
                    className="rounded-3xl w-auto lg:w-[40vw] xl:w-[30vw] object-cover"
                    alt="Cervezanas artesanales"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    width={1024}
                    height={768}
                    src={'/assets/profile_signup.jpg'}
                />
            </figure>
        </section>
    );
}
