'use client';

import Button from './common/Button';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ROLE_ENUM } from '@/lib//enums';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    role: ROLE_ENUM;
}

export default function AuthorizedAccessLayout({ role }: Props) {
    const t = useTranslations();
    const router = useRouter();

    return (
        <section className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
                <div className="flex flex-col items-center mb-4 space-y-4">
                    <FontAwesomeIcon
                        icon={faLock}
                        style={{ color: 'bear-dark' }}
                        title={'Lock'}
                        className="text-beer-blonde"
                        size="3x"
                    />

                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                        Tu petición para obtener el rol de {t(`role.${role}`)}
                        está siendo procesada.
                    </h2>
                </div>

                <p className="text-gray-600 mb-4">
                    Por favor, espera a que el administrador autorice tu
                    solicitud.
                </p>
                <p className="text-red-600 font-bold mb-4 flex flex-col">
                    Si tienes alguna pregunta, por favor, contacta con el
                    administrador a través de:
                    <a
                        href="mailto:cervezanas@socialinnolabs.org"
                        className="text-beer-blonde font-semibold mt-2 hover:underline"
                    >
                        cervezanas@socialinnolabs.org
                    </a>
                </p>

                <div className="flex flex-col items-center mb-4">
                    <Button onClick={() => router.push('/')} primary small>
                        Volver a la página principal
                    </Button>
                </div>
            </div>
        </section>
    );
}
