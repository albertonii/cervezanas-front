import useOnClickOutside from '../../../../hooks/useOnOutsideClickDOM';
import React, {
    ComponentProps,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import Button from '../common/Button';
import { IconButton } from '../common/IconButton';
import Spinner from '../common/Spinner';
import { UseFormReturn } from 'react-hook-form';
import PortalModal from './PortalModal';

interface Props {
    showBtn?: boolean;
    showModal: boolean;
    title: string;
    btnTitle: string;
    description: string;
    children: JSX.Element;
    icon?: IconDefinition;
    classIcon: string;
    classContainer: string;
    color?: { filled: string; unfilled: string };
    btnSize?: 'small' | 'medium' | 'large' | 'xLarge' | 'xxLarge';
    setShowModal: (b: boolean) => void;
    showFooter?: boolean;
    btnCancelTitle?: string;
    handler: ComponentProps<any>;
    handlerClose?: () => void;
    handleCustomClose?: () => void;
    form: UseFormReturn<any, any>;
}

export default function ModalWithForm(props: Props) {
    const {
        btnTitle,
        title,
        description,
        children,
        handler,
        handlerClose,
        icon,
        classIcon,
        classContainer,
        color,
        btnSize,
        showBtn,
        showModal,
        setShowModal,
        showFooter: showFooter = true,
        btnCancelTitle,
        handleCustomClose: hCustomCLose,
        form,
    } = props;

    const t = useTranslations();

    const { trigger } = form;

    const [isLoading, setIsLoading] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);

    const handleShowModal = (b: boolean) => {
        setShowModal(b);
    };

    const handleClickOutsideCallback = () => {
        if (handlerClose) handlerClose();
        handleShowModal(false);
    };

    const handleAccept = async () => {
        trigger().then((res: boolean) => {
            if (!res) return;

            setIsLoading(true);

            setTimeout(() => {
                handler()
                    .then(() => {
                        // TODO: Tener en cuenta si hay errores en el formulario antes de cerrar el modal
                        handleShowModal(false);
                        setIsLoading(false);
                    })
                    .catch((e: Error) => {
                        console.error(e);
                    });
            }, 300);
        });
    };

    const handleClose = () => {
        if (handlerClose) handlerClose();
        handleShowModal(false);
    };

    const handleCustomClose = () => {
        if (hCustomCLose) hCustomCLose();
    };

    useOnClickOutside(modalRef, () => handleClickOutsideCallback());

    // handle what happens on key press
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            const handleClose = () => {
                handleShowModal(false);
                if (handlerClose) handlerClose();
            };

            if (event.key === 'Escape') handleClose();
        },
        [handlerClose],
    );

    useEffect(() => {
        handleShowModal(showModal);
    }, [showModal]);

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
                    {icon ? (
                        <IconButton
                            icon={icon}
                            classIcon={classIcon}
                            classContainer={classContainer}
                            onClick={() => handleShowModal(true)}
                            isActive={false}
                            color={color}
                            title={title}
                            size={btnSize}
                        >
                            {t(btnTitle)}
                        </IconButton>
                    ) : (
                        <Button
                            class={`${classContainer} px-2 py-1`}
                            onClick={() => handleShowModal(true)}
                            title={title}
                            primary
                        >
                            {t(btnTitle)}
                        </Button>
                    )}
                </>
            )}

            {showModal && (
                <PortalModal wrapperId="form-modal-portal">
                    <section
                        className={`${
                            isLoading
                                ? 'overflow-hidden overscroll-none'
                                : 'overflow-y-auto overflow-x-hidden'
                        } fixed inset-0 z-50 flex items-start justify-center  pt-16 outline-none focus:outline-none`}
                    >
                        {/* The modal  */}
                        <div
                            className={`relative mx-4 my-6 w-full lg:w-3/4 lg:max-w-none xl:w-3/5`}
                            ref={modalRef}
                        >
                            {/*content*/}
                            <div
                                className={`relative flex w-full flex-col rounded-lg border-0 bg-beer-foam shadow-lg outline-none focus:outline-none`}
                            >
                                {/*header*/}
                                <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5">
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
                                <div className="relative flex-auto p-6">
                                    <p className="text-slate-500 my-4 text-lg leading-relaxed">
                                        {t(description)}
                                    </p>

                                    {children}
                                </div>

                                {/*footer*/}
                                {showFooter && (
                                    <footer className="border-slate-200 grid grid-cols-1 place-items-center gap-2 rounded-b border-t border-solid p-6 sm:grid-cols-2">
                                        <Button
                                            primary
                                            class="mr-4"
                                            medium
                                            btnType="submit"
                                            onClick={handleAccept}
                                        >
                                            {t(btnTitle)}
                                        </Button>

                                        {btnCancelTitle ? (
                                            <>
                                                <Button
                                                    accent
                                                    class=""
                                                    btnType="button"
                                                    medium
                                                    onClick={handleCustomClose}
                                                >
                                                    {t(btnCancelTitle)}
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                accent
                                                class=""
                                                btnType="button"
                                                medium
                                                onClick={handleClose}
                                            >
                                                {t('close')}
                                            </Button>
                                        )}
                                    </footer>
                                )}

                                {isLoading && (
                                    <figure className="fixed inset-0 z-50 flex items-center justify-center">
                                        <Spinner
                                            size="large"
                                            color="blonde-beer"
                                            center={true}
                                            absolute={true}
                                            class="z-50"
                                        />
                                    </figure>
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
