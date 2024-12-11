import PortalModal from './PortalModal';
import Button from '../ui/buttons/Button';
import useOnClickOutside from '../../../../hooks/useOnOutsideClickDOM';
import React, {
    ComponentProps,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { isEmpty } from '@/utils/utils';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface Props {
    showBtn?: boolean;
    showModal: boolean;
    title: string;
    btnTitle: string;
    triggerBtnTitle?: string;
    description?: string;
    children: JSX.Element;
    icon?: IconDefinition;
    classContainer?: string;
    setShowModal: (b: boolean) => void;
    showFooter?: boolean;
    btnCancelTitle?: string;
    handler: () => ComponentProps<any>;
    handlerClose?: () => void;
    handleCustomClose?: () => void;
    form: UseFormReturn<any, any>;
    showTriggerBtn?: boolean;
    showCancelBtn?: boolean;
}

export default function ModalWithForm({
    btnTitle,
    triggerBtnTitle,
    title,
    description,
    children,
    handler,
    handlerClose,
    icon,
    classContainer,
    showBtn,
    showModal,
    setShowModal,
    showFooter: showFooter = true,
    btnCancelTitle,
    handleCustomClose: hCustomCLose,
    form,
    showTriggerBtn = true,
    showCancelBtn = true,
}: Props) {
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { trigger } = form;

    const handleShowModal = (b: boolean) => {
        setShowModal(b);
    };

    const handleAccept = async () => {
        setIsLoading(true);

        const isFormValid = await trigger();

        if (!isFormValid) {
            setIsLoading(false);
            return;
        }

        try {
            await handler();
            handleShowModal(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (handlerClose) handlerClose();
        handleShowModal(false);
    };

    const handleCustomClose = () => {
        if (hCustomCLose) hCustomCLose();
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
            {showBtn && (
                <>
                    <Button
                        class={`${classContainer} px-2 py-1`}
                        onClick={() => handleShowModal(true)}
                        title={title}
                        primary
                        icon={icon}
                    >
                        {triggerBtnTitle ? t(triggerBtnTitle) : t(btnTitle)}
                    </Button>
                </>
            )}

            {showModal && (
                <PortalModal wrapperId="form-modal-portal">
                    <section
                        className={`${
                            isLoading
                                ? 'overflow-hidden overscroll-none'
                                : 'overflow-y-auto overflow-x-hidden'
                        } fixed inset-0 z-50 flex items-start justify-center  pt-16 outline-none focus:outline-none
                            bg-beer-dark bg-opacity-70

                            `}
                    >
                        {/* The modal  */}
                        <div
                            className={`relative mx-4 my-6 w-[94vw] lg:w-3/4 lg:max-w-none xl:w-3/5`}
                            ref={modalRef}
                        >
                            {/*content*/}
                            <div
                                className={`relative flex w-full flex-col rounded-lg border-0 bg-beer-foam dark:bg-beer-draft shadow-lg outline-none focus:outline-none`}
                            >
                                {/*header*/}
                                <div className="border-slate-200 flex items-start justify-between rounded-t p-5 pb-2 bg-beer-blonde border-b-beer-dark border-b-4">
                                    <h3 className="text-4xl sm:text-5xl md:text-6xl font-semibold font-['NexaRust-script'] text-white">
                                        {t(title)}
                                    </h3>

                                    <button
                                        className="float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                                        onClick={() => handleClose()}
                                    >
                                        <span className=" block h-6 w-6 text-2xl text-black outline-none focus:outline-none">
                                            <FontAwesomeIcon
                                                icon={faXmark}
                                                style={{
                                                    color: 'beer-dark',
                                                }}
                                                onClick={() => handleClose()}
                                                title={'Close Modal'}
                                            />
                                        </span>
                                    </button>
                                </div>

                                {/*body*/}
                                <div className="relative flex-auto px-0 sm:px-5 py-5">
                                    {!isEmpty(description) && (
                                        <p className="text-slate-500 my-4 sm:text-md leading-relaxed">
                                            {t(description)}
                                        </p>
                                    )}

                                    {children}
                                </div>

                                {/*footer*/}
                                {showFooter && (
                                    <footer className="border-slate-200 grid grid-cols-1 place-items-center gap-2 rounded-b border-t border-solid p-6 sm:grid-cols-2">
                                        {showTriggerBtn && (
                                            <Button
                                                primary
                                                class="mr-4"
                                                medium
                                                btnType="submit"
                                                onClick={handleAccept}
                                                disabled={isLoading}
                                            >
                                                {t(btnTitle)}
                                            </Button>
                                        )}

                                        {showCancelBtn && (
                                            <>
                                                {btnCancelTitle ? (
                                                    <>
                                                        <Button
                                                            accent
                                                            class=""
                                                            btnType="button"
                                                            medium
                                                            onClick={
                                                                handleCustomClose
                                                            }
                                                            disabled={isLoading}
                                                        >
                                                            {t(btnCancelTitle)}
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        class=""
                                                        btnType="button"
                                                        danger
                                                        medium
                                                        onClick={handleClose}
                                                        disabled={isLoading}
                                                    >
                                                        {t('close')}
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </footer>
                                )}
                            </div>

                            <figure
                                className={`${
                                    isLoading &&
                                    'absolute inset-0 z-40 bg-beer-softBlondeBubble opacity-75'
                                }`}
                            ></figure>
                        </div>
                    </section>
                </PortalModal>
            )}
        </>
    );
}
