import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
    activeStep: number;
    handleSetActiveStep: React.Dispatch<React.SetStateAction<any>>;
    children: JSX.Element;
    isSubmitting: boolean;
}

export function BoxPackStepper({
    children,
    handleSetActiveStep,
    activeStep,
    isSubmitting,
}: Props) {
    const t = useTranslations();

    const statusPastClass = 'border-beer-softBlonde';
    const statusPresentClass = 'bg-beer-blonde';
    const statusFutureClass = 'border-beer-softBlonde';

    const statusPastIconClass = '#fdc300'; // Beer Blonde
    const statusPresentIconClass = 'white';
    const statusFutureIconClass = 'gray';

    const [detailsClass, setDetailsClass] = useState(statusPastClass);
    const [productSlotsClass, setProductSlotsClass] = useState(statusPastClass);
    const [multimediaClass, setMultimediaClass] = useState(statusPastClass);
    const [confirmClass, setConfirmClass] = useState(statusPastClass);

    const [detailsIconClass, setDetailsIconClass] = useState('');
    const [productSlotsIconClass, setProductSlotsIconClass] = useState('');
    const [multimediaIconClass, setMultimediaIconClass] = useState('');
    const [confirmIconClass, setConfirmIconClass] = useState('');

    useEffect(() => {
        handleStepper(0);
    }, []);

    const handleStepper = (param: number) => {
        handleSetActiveStep(param);

        if (param === 0) {
            setDetailsClass(statusPresentClass);
            setProductSlotsClass(statusFutureClass);
            setMultimediaClass(statusFutureClass);
            setConfirmClass(statusFutureClass);

            setDetailsIconClass(statusPresentIconClass);
            setProductSlotsIconClass(statusFutureIconClass);
            setMultimediaIconClass(statusFutureIconClass);
            setConfirmIconClass(statusFutureIconClass);
        } else if (param === 1) {
            setDetailsClass(statusPastClass);
            setProductSlotsClass(statusPresentClass);
            setMultimediaClass(statusFutureClass);
            setConfirmClass(statusFutureClass);

            setDetailsIconClass(statusPastIconClass);
            setProductSlotsIconClass(statusPresentIconClass);
            setMultimediaIconClass(statusFutureIconClass);
            setConfirmIconClass(statusFutureIconClass);
        } else if (param === 2) {
            setDetailsClass(statusPastClass);
            setProductSlotsClass(statusPastClass);
            setMultimediaClass(statusPresentClass);
            setConfirmClass(statusFutureClass);

            setDetailsIconClass(statusPastIconClass);
            setProductSlotsIconClass(statusPastIconClass);
            setMultimediaIconClass(statusPresentIconClass);
            setConfirmIconClass(statusFutureIconClass);
        } else {
            setDetailsClass(statusPastClass);
            setProductSlotsClass(statusPastClass);
            setMultimediaClass(statusPastClass);
            setConfirmClass(statusPresentClass);

            setDetailsIconClass(statusPastIconClass);
            setMultimediaIconClass(statusPastIconClass);
            setProductSlotsIconClass(statusPastIconClass);
            setConfirmIconClass(statusPresentIconClass);
        }
    };

    return (
        <section className={`p-5 ${isSubmitting && 'opacity-50'}`}>
            <div className="flex items-center">
                <div className="relative flex items-center text-beer-draft">
                    <figure
                        className={`h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out ${detailsClass} `}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke={`${detailsIconClass}`}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-bookmark "
                        >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </figure>
                    <h3 className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
                        {t('details')}
                    </h3>
                </div>

                <div
                    className={`flex-auto border-t-2 transition duration-500 ease-in-out ${productSlotsClass}`}
                ></div>

                <div className="relative flex items-center text-gray-500">
                    <figure
                        className={`h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out ${productSlotsClass}`}
                    >
                        <svg
                            width="100%"
                            height="100%"
                            fill="none"
                            stroke={`${productSlotsIconClass}`}
                            strokeWidth="30"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-mail "
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="-100 0 840 512"
                        >
                            <path d="M58.9 42.1c3-6.1 9.6-9.6 16.3-8.7L320 64 564.8 33.4c6.7-.8 13.3 2.7 16.3 8.7l41.7 83.4c9 17.9-.6 39.6-19.8 45.1L439.6 217.3c-13.9 4-28.8-1.9-36.2-14.3L320 64 236.6 203c-7.4 12.4-22.3 18.3-36.2 14.3L37.1 170.6c-19.3-5.5-28.8-27.2-19.8-45.1L58.9 42.1zM321.1 128l54.9 91.4c14.9 24.8 44.6 36.6 72.5 28.6L576 211.6v167c0 22-15 41.2-36.4 46.6l-204.1 51c-10.2 2.6-20.9 2.6-31 0l-204.1-51C79 419.7 64 400.5 64 378.5v-167L191.6 248c27.8 8 57.6-3.8 72.5-28.6L318.9 128h2.2z" />
                        </svg>
                    </figure>

                    <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
                        {t('slots')}
                    </div>
                </div>

                <div
                    className={`flex-auto border-t-2 transition duration-500 ease-in-out ${multimediaClass}`}
                ></div>

                <div className="relative flex items-center text-gray-500">
                    <figure
                        className={`h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out ${multimediaClass}`}
                    >
                        <svg
                            width="100%"
                            height="100%"
                            fill="none"
                            stroke={`${multimediaIconClass}`}
                            strokeWidth="40"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-mail "
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="-100 0 800 512"
                        >
                            <path
                                d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 
                                3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 
                                112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 
                                28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
                            />
                        </svg>
                    </figure>

                    <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
                        {t('multimedia')}
                    </div>
                </div>

                <div
                    className={`flex-auto border-t-2 transition duration-500 ease-in-out ${confirmClass}`}
                ></div>
                <figure className="relative flex items-center text-gray-500">
                    <div
                        className={`h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out ${confirmClass}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke={`${confirmIconClass}`}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-database "
                        >
                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                        </svg>
                    </div>
                    <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
                        {t('confirm')}
                    </div>
                </figure>
            </div>

            <div className="mt-8 ">
                <div>{children}</div>

                <div className="mt-4 flex p-2">
                    <button
                        type="button"
                        disabled={activeStep === 0}
                        onClick={() => handleStepper(activeStep - 1)}
                        className="flex cursor-pointer justify-center rounded border border-gray-600 bg-gray-100 px-4 py-2 text-base 
                            font-bold  
                            text-gray-700 
                            transition 
                            duration-200 ease-in-out hover:scale-110 
                            hover:bg-gray-200 focus:outline-none"
                    >
                        {t('back')}
                    </button>

                    <div className="flex flex-auto flex-row-reverse">
                        {activeStep < 3 && (
                            <button
                                type="button"
                                onClick={() => handleStepper(activeStep + 1)}
                                className="ml-2  flex  cursor-pointer justify-center rounded border border-beer-draft bg-beer-blonde px-4 py-2 text-base 
                                    font-bold  
                                    text-beer-draft 
                                    transition 
                                    duration-200 ease-in-out hover:scale-110 
                                    hover:bg-beer-softBlondeBubble focus:outline-none"
                            >
                                {t('next')}
                            </button>
                        )}

                        {activeStep !== 3 && (
                            <button
                                type="button"
                                onClick={() => handleStepper(3)}
                                className="flex cursor-pointer justify-center rounded border border-beer-draft bg-bear-alvine px-4 py-2 text-base 
                                    font-bold  
                                    text-beer-draft 
                                    transition 
                                    duration-200 ease-in-out hover:scale-110 
                                    hover:bg-bear-blonde focus:outline-none"
                            >
                                {t('skip')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}