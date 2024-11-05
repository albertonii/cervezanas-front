'use client';

import Link from 'next/link';
import Image from 'next/image';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/buttons/Button';
import InputLabel from '../../components/form/InputLabel';
import React, { useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import { useLocale } from 'next-intl';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { useAuth } from '../Context/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Title from '../../components/ui/Title';

type SigninFormData = {
    email: string;
    password: string;
};

type ResetFormData = {
    email: string;
};

const signInSchema: ZodType<SigninFormData> = z.object({
    email: z
        .string()
        .email({
            message: 'errors.input_email_invalid',
        })
        .min(5, { message: 'errors.input_required' }),
    password: z.string().min(8, { message: 'errors.password_8_length' }),
});

type SignInValidationSchema = z.infer<typeof signInSchema>;

const resetSchema: ZodType<ResetFormData> = z.object({
    email: z
        .string()
        .email({
            message: 'errors.input_email_invalid',
        })
        .min(5, { message: 'errors.input_required' }),
});

type ResetValidationSchema = z.infer<typeof resetSchema>;

export default function SignIn() {
    const { signInWithProvider, signIn, sendResetPasswordEmail } = useAuth();
    const [resetPassword, setResetPassword] = useState<boolean>(false);
    const [isResetPasswordLoading, setIsResetPasswordLoading] =
        useState<boolean>(false);

    const t = useTranslations();

    const locale = useLocale();

    const signInForm = useForm<SigninFormData>({
        resolver: zodResolver(signInSchema),
    });

    const resetForm = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
    });

    const { handleSubmit: handleSubmitSignIn, reset: resetSignIn } = signInForm;

    const { handleSubmit: handleSubmitReset, reset: resetReset } = resetForm;

    const [isPageLoad, setIsPageLoad] = useState(false);

    useEffect(() => {
        setIsPageLoad(true);
    }, []);

    const handleCredentialsSignIn = async (form: SignInValidationSchema) => {
        const { email, password } = form;
        const isSignedIn = await signIn(email, password);

        if (isSignedIn) {
            resetSignIn();
        }
    };

    const handleCredentialsMutation = useMutation({
        mutationKey: 'credentialsSignIn',
        mutationFn: handleCredentialsSignIn,
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmitSignin: SubmitHandler<SignInValidationSchema> = (
        formValues: SigninFormData,
    ) => {
        try {
            handleCredentialsMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    const handleResetPassword = async (email: string) => {
        setIsResetPasswordLoading(true);
        const isMessageSent = await sendResetPasswordEmail(email);
        if (isMessageSent) {
            resetReset();
        }
        setIsResetPasswordLoading(false);
    };

    const handleResetPasswordMutation = useMutation({
        mutationKey: 'resetPassword',
        mutationFn: handleResetPassword,
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmitReset = (formValues: ResetValidationSchema) => {
        try {
            handleResetPasswordMutation.mutate(formValues.email);
            setResetPassword(true);
        } catch (e) {
            console.error(e);
        }
    };

    const toggleResetPassword = () => {
        setResetPassword(!resetPassword);
    };

    const handleGoogleSignIn = async () => {
        signInWithProvider('google');
    };

    if (!isPageLoad) {
        return <Spinner color="beer-blonde" size={'fullScreen'} absolute />;
    }

    return (
        <section className="w-full lg:grid lg:grid-cols-2 bg-[url('/assets/home/bg-home.webp')] bg-auto bg-repeat bg-top h-full">
            {!resetPassword && (
                <article className="mx-auto flex w-[80vw] sm:w-[60vw] flex-1 gap-4 flex-col justify-start pl-4 py-12 sm:pl-6 lg:w-full lg:flex-none lg:pl-20 xl:pl-24">
                    {/* Login form */}
                    <div className="justify-start lg:w-full mx-auto flex flex-1 flex-col lg:flex-none ">
                        <Title size="xlarge" color="beer-blonde">
                            {t('sign_in')}
                        </Title>

                        <form
                            className="mt-4 space-y-4"
                            onSubmit={handleSubmitSignIn(onSubmitSignin)}
                            id="login-form"
                        >
                            <fieldset className="space-y-4">
                                {/* email  */}
                                <InputLabel
                                    form={signInForm}
                                    label={'email'}
                                    registerOptions={{
                                        required: true,
                                    }}
                                    placeholder="user@cervezanas.com"
                                    inputType="email"
                                />

                                {/* password  */}
                                <InputLabel
                                    form={signInForm}
                                    label={'password'}
                                    registerOptions={{
                                        required: true,
                                    }}
                                    inputType="password"
                                    placeholder="*****"
                                />

                                {/* submit  */}
                                <Button
                                    title={'sign_in'}
                                    class="w-full bg-beer-blonde text-white py-2 rounded-md hover:bg-beer-draft transition"
                                    btnType="submit"
                                >
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="mr-2"
                                    />
                                    {t('sign_in')}
                                </Button>
                            </fieldset>
                        </form>

                        <p className="my-2 flex flex-col sm:flex-row w-full items-start justify-start text-sm text-gray-700 dark:text-gray-100">
                            {t('not_registered_question')}
                            <Link
                                className="cursor-pointer font-bold "
                                href={'/signup'}
                                locale={locale}
                            >
                                <span className="mx-1 text-beer-darkGold dark:text-beer-gold hover:underline">
                                    {t('sign_me_up')}
                                </span>
                            </Link>
                        </p>

                        <p className="my-2 flex flex-col sm:flex-row w-full items-start justify-start text-sm text-gray-700  dark:text-gray-100">
                            {t('forgot_password_question')}

                            <button
                                onClick={() => toggleResetPassword()}
                                className="mx-1 cursor-pointer font-bold text-beer-darkGold dark:text-beer-gold hover:underline"
                            >
                                {t('reset_password')}
                            </button>
                        </p>
                    </div>

                    {/* TODO: Volver y arreglar esto  */}
                    <Button
                        accent
                        class=" mr-2 w-full rounded-lg border bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 
                        dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        onClick={() => handleGoogleSignIn()}
                    >
                        <div className="flex items-center ">
                            <span className="mx-2 my-2 flex h-6 w-6 items-center justify-center">
                                <svg
                                    className="w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 32 32"
                                    width="64"
                                    height="64"
                                >
                                    <defs>
                                        <path
                                            id="A"
                                            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                                        />
                                    </defs>
                                    <clipPath id="B">
                                        <use xlinkHref="#A" />
                                    </clipPath>
                                    <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
                                        <path
                                            d="M0 37V11l17 13z"
                                            clipPath="url(#B)"
                                            fill="#fbbc05"
                                        />
                                        <path
                                            d="M0 11l17 13 7-6.1L48 14V0H0z"
                                            clipPath="url(#B)"
                                            fill="#ea4335"
                                        />
                                        <path
                                            d="M0 37l30-23 7.9 1L48 0v48H0z"
                                            clipPath="url(#B)"
                                            fill="#34a853"
                                        />
                                        <path
                                            d="M48 48L17 24l-4-3 35-10z"
                                            clipPath="url(#B)"
                                            fill="#4285f4"
                                        />
                                    </g>
                                </svg>
                            </span>

                            <span className="ml-2 text-md sm:text-lg">
                                {t('continue_with_google')}
                            </span>
                        </div>
                    </Button>
                </article>
            )}

            {resetPassword && (
                <article className="mx-auto flex w-[80vw] sm:w-[60vw] flex-1 gap-4 flex-col justify-start pl-4 py-12 sm:pl-6 lg:w-full lg:flex-none lg:pl-20 xl:pl-24">
                    {isResetPasswordLoading && (
                        <Spinner
                            color={'beer-blonde'}
                            size={'large'}
                            absolute
                            absolutePosition={'top'}
                        />
                    )}

                    {/* Reset form */}
                    <div className="justify-start lg:w-full mx-auto flex flex-1 flex-col lg:flex-none ">
                        <Title size="xlarge" color="beer-blonde">
                            {t('reset_password')}
                        </Title>

                        <form
                            className="mt-4 space-y-4"
                            onSubmit={handleSubmitReset(onSubmitReset)}
                            id="reset-form"
                        >
                            <fieldset className="space-y-4">
                                {/* email  */}
                                <InputLabel
                                    form={resetForm}
                                    label={'email'}
                                    registerOptions={{
                                        required: true,
                                    }}
                                    placeholder="user@cervezanas.com"
                                    inputType="email"
                                />

                                {/* submit  */}
                                <Button
                                    title={'reset_password'}
                                    class="w-full bg-beer-blonde text-white py-2 rounded-md hover:bg-beer-draft transition"
                                    btnType="submit"
                                    form="reset-form"
                                    disabled={isResetPasswordLoading}
                                    isLoading={isResetPasswordLoading}
                                >
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FontAwesomeIcon
                                            icon={faLock}
                                            style={{ color: 'bear-dark' }}
                                            title={'Lock'}
                                            className="text-base text-beer-softBlonde group-hover:text-beer-blonde"
                                        />
                                    </span>
                                    {t('reset_password')}
                                </Button>
                            </fieldset>
                        </form>

                        <p className="my-2 flex flex-col sm:flex-row w-full items-start justify-start text-sm text-gray-700 dark:text-gray-100">
                            {t('come_back_to_signin')}

                            <button
                                onClick={() => toggleResetPassword()}
                                className="mx-1 cursor-pointer font-bold text-beer-darkGold dark:text-beer-gold hover:underline"
                            >
                                {t('sign_in')}
                            </button>
                        </p>
                    </div>
                </article>
            )}

            {/* Hero Image */}
            <figure className="hidden w-full justify-center lg:flex text-left">
                <Image
                    style={{ aspectRatio: '4/5' }}
                    className="inset-0 rounded-3xl w-auto lg:w-[40vw] xl:w-[30vw]"
                    alt="Cervezanas artesanales"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    width={1024}
                    height={768}
                    src={'/assets/min_logo.svg'}
                />
            </figure>
        </section>
    );
}
