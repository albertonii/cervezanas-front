'use client';

import Image from 'next/image';
import Button from '@/app/[locale]/components/common/Button';
import InputLabel from '@/app/[locale]/components/common/InputLabel';
import React, { useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useAuth } from '../Context/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../components/common/Spinner';

type FormData = {
    password: string;
    confirm_password: string;
};

const schema: ZodType<FormData> = z
    .object({
        password: z.string().min(8, { message: 'errors.password_8_length' }),
        confirm_password: z
            .string()
            .min(8, { message: 'errors.password_8_length' }),
    })
    .refine((data) => data.password === data.confirm_password, {
        path: ['confirm_password'],
        message: 'errors.password_match',
    });

type ValidationSchema = z.infer<typeof schema>;

/**
 * Reset password page will send a reset password email to the user
 * @returns
 */
export default function ResetPassword() {
    const t = useTranslations();

    const [isResetSubmitLoading, setResetSubmitLoading] = useState(false);
    const { updatePassword } = useAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const { handleSubmit } = form;

    useEffect(() => {
        console.log(isResetSubmitLoading);

        return () => {};
    }, [isResetSubmitLoading]);

    async function updPassword(formData: ValidationSchema) {
        setResetSubmitLoading(true);
        updatePassword(formData.password);
        setResetSubmitLoading(false);
    }

    return (
        <section className="w-full lg:grid lg:grid-cols-2 relative">
            {isResetSubmitLoading && (
                <span>
                    <Spinner
                        color={'beer-blonde'}
                        size={'large'}
                        absolute
                        absolutePosition={'center'}
                    />
                </span>
            )}

            <article className="mx-auto flex w-[60vw] flex-1 flex-col justify-start px-4 py-12 sm:px-6 lg:w-full lg:flex-none lg:px-20 xl:px-24">
                <h1 className="text-3xl font-extrabold text-gray-900">
                    {t('update_password')}
                </h1>

                <form
                    onSubmit={handleSubmit(updPassword)}
                    className="mt-8 w-full space-y-6"
                    action="#"
                    method="POST"
                >
                    <section className="flex w-full flex-col -space-y-px rounded-md shadow-sm">
                        <InputLabel
                            form={form}
                            label={'password'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="*****"
                            inputType="password"
                        />

                        <InputLabel
                            form={form}
                            label={'confirm_password'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="*****"
                            inputType="password"
                        />
                    </section>

                    <Button
                        title={'reset_password'}
                        btnType="submit"
                        class={
                            'group relative my-4 flex w-full justify-center rounded-md border border-none border-transparent bg-beer-blonde px-4 py-2 text-sm font-medium hover:bg-beer-draft hover:font-semibold hover:text-beer-blonde focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2 '
                        }
                        fullSize
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon
                                icon={faLock}
                                style={{ color: 'bear-dark' }}
                                title={'Lock'}
                                className="text-base text-beer-softBlonde group-hover:text-beer-blonde"
                            />
                        </span>
                        {t('confirm_password')}
                    </Button>
                </form>
            </article>

            {/* Hero Image */}
            <figure className="hidden w-full justify-center lg:flex">
                <Image
                    style={{ aspectRatio: '4/5' }}
                    className="inset-0 rounded-3xl w-auto lg:w-[40vw] xl:w-[30vw]"
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
