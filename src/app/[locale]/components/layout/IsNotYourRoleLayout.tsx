'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ROLE_ENUM } from '@/lib//enums';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../ui/buttons/Button';

interface Props {
    role: ROLE_ENUM;
}

export default function IsNotYourRoleLayout({ role }: Props) {
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
                        Tu cuenta de usuario no tiene los permisos necesarios
                        para acceder a esta página. Debes de tener el rol de{' '}
                        {t(`role.${role}`)} para poder entrar.
                    </h2>
                </div>

                <p className="text-gray-600 mb-4">
                    Para ello debe de tramitar una solicitud para agregar el rol
                    de {t(`role.${role}`)} a tu cuenta.
                </p>
                <p className="text-red-600 font-bold mb-4 flex flex-col">
                    Si tienes alguna pregunta, por favor, contacta con el
                    administrador a través de:
                    <a
                        href="mailto:info@cervezanas.beer"
                        className="text-beer-blonde font-semibold mt-2 hover:underline"
                    >
                        info@cervezanas.beer
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
