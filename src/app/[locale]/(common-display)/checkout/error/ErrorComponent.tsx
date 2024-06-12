'use client';

import { useLocale } from 'next-intl';
import { redirect, useRouter } from 'next/navigation';
import React from 'react';
import Button from '../../../components/common/Button';

export default function ErrorComponent() {
    const router = useRouter();
    const locale = useLocale();

    return (
        <section className="container mx-auto sm:py-4 lg:py-6">
            <div className=" gap-4 px-4 sm:flex flex flex-col sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 sm:space-x-4">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    Error detectado en el proceso de pago
                </h1>

                <p className="text-gray-600">
                    Ha ocurrido un error en el proceso de pago. Por favor,
                    inténtalo de nuevo.
                </p>

                <div className="flex justify-center">
                    <Button
                        onClick={() => router.push(`/${locale}`)}
                        primary
                        medium
                    >
                        Volver a la página principal
                    </Button>
                </div>
            </div>
        </section>
    );
}
