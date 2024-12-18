import useOnClickOutside from '../../../../hooks/useOnOutsideClickDOM';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import PortalModal from './PortalModal';
import Button from '../ui/buttons/Button';

interface Props {
    isVisible: boolean;
}

export function SuccessfulReviewModal(props: Props) {
    const { isVisible } = props;

    const t = useTranslations();
    const locale = useLocale();

    const modalRef = useRef<HTMLDivElement>(null);

    const [showModal, setShowModal] = useState(isVisible);

    const handleShowModal = (b: boolean) => {
        setShowModal(b);
    };

    const handleClickOutsideCallback = () => {
        handleShowModal(false);
    };

    useOnClickOutside(modalRef, () => handleClickOutsideCallback());

    // handle what happens on key press
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') handleShowModal(false);
    }, []);

    useEffect(() => {
        if (showModal) {
            // attach the event listener if the modal is shown
            document.addEventListener('keydown', handleKeyPress);
            // remove the event listener
            return () => {
                document.removeEventListener('keydown', handleKeyPress);
            };
        }
    }, [handleKeyPress, showModal]);

    return (
        <>
            {showModal && (
                <PortalModal wrapperId="modal-portal">
                    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overflow-x-hidden pt-16 outline-none focus:outline-none">
                        {/* The modal  */}
                        <div
                            className="relative mx-auto my-6 w-auto max-w-3xl"
                            ref={modalRef}
                        >
                            {/*content*/}
                            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                {/*header*/}
                                <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                                    <p className="text-xl font-semibold">
                                        {t('successful_product_review_title')}
                                    </p>

                                    <button
                                        className="float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                                        onClick={() => handleShowModal(false)}
                                    >
                                        <span className=" block h-6 w-6 text-2xl text-black outline-none focus:outline-none">
                                            <FontAwesomeIcon
                                                // className={`${className} `}
                                                // onMouseEnter={() => setHoverColor("filled")}
                                                // onMouseLeave={() => setHoverColor("unfilled")}
                                                icon={faXmark}
                                                style={{ color: 'beer-dark' }}
                                                onClick={() =>
                                                    handleShowModal(false)
                                                }
                                                title={'Close Modal'}
                                            />
                                        </span>
                                    </button>
                                </div>

                                {/*body*/}
                                <div className="relative flex-auto p-6">
                                    <header className="flex w-full justify-center">
                                        <p className="text-slate-500 my-4 text-3xl font-semibold leading-relaxed text-beer-draft">
                                            ¡Gracias por tu opinión!
                                        </p>
                                    </header>

                                    <div className="space-y-4">
                                        <p className="text-slate-500 text-lg leading-relaxed">
                                            Acabas de conseguir 30 puntos por
                                            todo el contenido aportado en este
                                            formulario ¡Recuerda que a más
                                            contenido aportes, más puntos!
                                        </p>

                                        <p className="text-slate-500 text-lg leading-relaxed">
                                            Con tu valoración acabas de entrar
                                            al sorteo que se realiza todos los
                                            meses, en el que podrás ganar 50,
                                            100 o 200€ ¡Sigue así!
                                        </p>
                                    </div>

                                    <footer className="text-slate-500 my-4 sm:text-md leading-relaxed">
                                        {/* Underline link  */}
                                        <Link
                                            className="text-beer-draft underline hover:font-semibold"
                                            href="#"
                                            locale={locale}
                                        >
                                            Ver condiciones del sorteo
                                        </Link>
                                    </footer>
                                </div>

                                <footer className="border-slate-200 grid grid-cols-1 place-items-center gap-2 rounded-b border-t border-solid p-6">
                                    <Button
                                        accent
                                        class=""
                                        btnType="button"
                                        medium
                                        onClick={() => handleShowModal(false)}
                                    >
                                        {t('close')}
                                    </Button>
                                </footer>
                            </div>
                        </div>
                    </div>
                </PortalModal>
            )}
        </>
    );
}
