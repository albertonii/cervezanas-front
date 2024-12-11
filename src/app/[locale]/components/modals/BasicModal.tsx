import Spinner from '../ui/Spinner';
import PortalModal from './PortalModal';
import useOnClickOutside from '../../../../hooks/useOnOutsideClickDOM';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isEmpty } from '@/utils/utils';
import { useTranslations } from 'next-intl';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    showModal: boolean;
    title: string;
    description: string;
    children: JSX.Element;
    setShowModal: (b: boolean) => void;
    showFooter?: boolean;
    handlerClose?: () => void;
    hasErrors?: boolean;
}

export default function BasicModal({
    showModal,
    title,
    description,
    children,
    setShowModal,
    handlerClose,
}: Props) {
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleShowModal = (b: boolean) => {
        setShowModal(b);
    };

    const handleClose = () => {
        if (handlerClose) {
            handlerClose(); // Ejecuta la lógica adicional antes de desmontar el modal
        }
        handleShowModal(false); // Cierra el modal definitivamente
    };

    useOnClickOutside(modalRef, () => handleClose());

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleClose();
        },
        [handleClose],
    );

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
                    <section
                        className={`fixed inset-0 z-50 flex items-start justify-center pt-16 outline-none focus:outline-none bg-beer-blonde bg-opacity-50 ${
                            isLoading
                                ? 'overflow-hidden overscroll-none'
                                : 'overflow-y-auto overflow-x-hidden'
                        }`}
                    >
                        {/* The modal  */}
                        <div
                            className={`relative mx-4 my-6 w-[94vw] lg:w-3/4 lg:max-w-none xl:w-3/5`}
                            ref={modalRef}
                        >
                            {/*content*/}
                            <div
                                className={`relative flex w-full flex-col rounded-lg border-0 bg-beer-foam shadow-lg outline-none focus:outline-none`}
                            >
                                {/*header*/}
                                <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5 text-beer-gold">
                                    <h3 className="text-3xl font-semibold">
                                        {t(title)}
                                    </h3>

                                    <button
                                        className="float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                                        onClick={() => handleClose()}
                                    >
                                        <span className=" block h-6 w-6 text-2xl text-black outline-none focus:outline-none">
                                            <FontAwesomeIcon
                                                icon={faXmark}
                                                style={{ color: 'beer-dark' }}
                                                onClick={() => handleClose()}
                                                title={'Close Modal'}
                                            />
                                        </span>
                                    </button>
                                </div>

                                {/*body*/}
                                <div className="relative flex-auto p-12 bg-[url('/assets/rec-graf5b.webp')] bg-cover bg-no-repeat">
                                    {!isEmpty(description) && (
                                        <p className="text-slate-500 my-4 sm:text-md leading-relaxed">
                                            {t(description)}
                                        </p>
                                    )}

                                    {children}
                                </div>

                                {isLoading && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                                        <Spinner
                                            size="large"
                                            color="blonde-beer"
                                            absolutePosition="center"
                                            absolute={true}
                                            class="z-50"
                                        />
                                    </div>
                                )}
                            </div>

                            {isLoading && (
                                <div className="absolute inset-0 z-40 bg-beer-softBlondeBubble opacity-75"></div>
                            )}
                        </div>
                    </section>
                </PortalModal>
            )}
        </>
    );
}
