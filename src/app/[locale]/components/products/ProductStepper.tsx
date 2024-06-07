import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductStepperButtons from './ProductStepperButtons';

interface Props {
    activeStep: number;
    handleSetActiveStep: React.Dispatch<React.SetStateAction<any>>;
    children: JSX.Element;
    isSubmitting: boolean;
}

export function ProductStepper({
    children,
    handleSetActiveStep,
    activeStep,
    isSubmitting,
}: Props) {
    const t = useTranslations();

    const statusPastClass = 'border-beer-softBlonde';
    const statusPresentClass = 'bg-beer-blonde';
    const statusFutureClass = 'border-gray-200';

    const statusPastIconClass = '#fdc300'; // Beer Blonde
    const statusPresentIconClass = 'white';
    const statusFutureIconClass = 'gray';

    const [detailsClass, setDetailsClass] = useState(statusPastClass);
    const [awardsClass, setAwardsClass] = useState(statusPastClass);
    const [multimediaClass, setMultimediaClass] = useState(statusPastClass);
    const [confirmClass, setConfirmClass] = useState(statusPastClass);

    const [detailsIconClass, setDetailsIconClass] = useState('');
    const [awardsIconClass, setAwardsIconClass] = useState('');
    const [multimediaIconClass, setMultimediaIconClass] = useState('');
    const [confirmIconClass, setConfirmIconClass] = useState('');

    useEffect(() => {
        handleStepper(0);
    }, []);

    const handleStepper = (param: number) => {
        handleSetActiveStep(param);

        if (param === 0) {
            setDetailsClass(statusPresentClass);
            setMultimediaClass(statusFutureClass);
            setAwardsClass(statusFutureClass);
            setConfirmClass(statusFutureClass);

            setDetailsIconClass(statusPresentIconClass);
            setMultimediaIconClass(statusFutureIconClass);
            setAwardsIconClass(statusFutureIconClass);
            setConfirmIconClass(statusFutureIconClass);
        } else if (param === 1) {
            setDetailsClass(statusPastClass);
            setMultimediaClass(statusPresentClass);
            setAwardsClass(statusFutureClass);
            setConfirmClass(statusFutureClass);

            setDetailsIconClass(statusPastIconClass);
            setMultimediaIconClass(statusPresentIconClass);
            setAwardsIconClass(statusFutureIconClass);
            setConfirmIconClass(statusFutureIconClass);
        } else if (param === 2) {
            setDetailsClass(statusPastClass);
            setMultimediaClass(statusPastClass);
            setAwardsClass(statusPresentClass);
            setConfirmClass(statusFutureClass);

            setDetailsIconClass(statusPastIconClass);
            setMultimediaIconClass(statusPastIconClass);
            setAwardsIconClass(statusPresentIconClass);
            setConfirmIconClass(statusFutureIconClass);
        } else {
            setDetailsClass(statusPastClass);
            setMultimediaClass(statusPastClass);
            setAwardsClass(statusPastClass);
            setConfirmClass(statusPresentClass);

            setDetailsIconClass(statusPastIconClass);
            setMultimediaIconClass(statusPastIconClass);
            setAwardsIconClass(statusPastIconClass);
            setConfirmIconClass(statusPresentIconClass);
        }
    };

    return (
        <section className={`p-5 ${isSubmitting && 'opacity-50'}`}>
            <div className="flex items-center">
                {/* Details  */}
                <figure className="relative flex items-center text-beer-draft">
                    <div
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
                    </div>

                    <h3 className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
                        {t('details')}
                    </h3>
                </figure>

                <span
                    className={`flex-auto border-t-2 transition duration-500 ease-in-out ${detailsClass}`}
                />

                {/* Multimedia  */}
                <figure className="relative flex items-center text-gray-500">
                    <div
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
                    </div>

                    <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
                        {t('multimedia')}
                    </div>
                </figure>

                {/* Awards  */}
                <span
                    className={`flex-auto border-t-2 transition duration-500 ease-in-out ${multimediaClass}`}
                ></span>

                <figure className="relative flex items-center text-white">
                    <div
                        className={`h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out ${awardsClass}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            stroke={`${awardsIconClass}`}
                            strokeWidth="30"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-user-plus "
                            viewBox="-100 0 584 512"
                        >
                            <path
                                d="M173.8 5.5c11-7.3 25.4-7.3 36.4 0L228 17.2c6 3.9 13 5.8 20.1 5.4l21.3-1.3c13.2-.8 
                                25.6 6.4 31.5 18.2l9.6 19.1c3.2 6.4 8.4 11.5 14.7 14.7L344.5 83c11.8 5.9 19 18.3 18.2 
                                31.5l-1.3 21.3c-.4 7.1 1.5 14.2 5.4 20.1l11.8 17.8c7.3 11 7.3 25.4 0 36.4L366.8 228c-3.9 
                                6-5.8 13-5.4 20.1l1.3 21.3c.8 13.2-6.4 25.6-18.2 31.5l-19.1 9.6c-6.4 3.2-11.5 8.4-14.7 
                                14.7L301 344.5c-5.9 11.8-18.3 19-31.5 18.2l-21.3-1.3c-7.1-.4-14.2 1.5-20.1 5.4l-17.8 
                                11.8c-11 7.3-25.4 7.3-36.4 0L156 366.8c-6-3.9-13-5.8-20.1-5.4l-21.3 1.3c-13.2 
                                .8-25.6-6.4-31.5-18.2l-9.6-19.1c-3.2-6.4-8.4-11.5-14.7-14.7L39.5 301c-11.8-5.9-19-18.3-18.2-31.5l1.3-21.3c.4-7.1-1.5-14.2-5.4-20.1L5.5 
                                210.2c-7.3-11-7.3-25.4 0-36.4L17.2 156c3.9-6 5.8-13 5.4-20.1l-1.3-21.3c-.8-13.2 6.4-25.6 18.2-31.5l19.1-9.6C65 70.2 70.2 65 73.4 58.6L83 39.5c5.9-11.8 18.3-19 31.5-18.2l21.3 1.3c7.1 .4 14.2-1.5 20.1-5.4L173.8 5.5zM272 192a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM1.3 441.8L44.4 339.3c.2 .1 .3 .2 .4 .4l9.6 19.1c11.7 23.2 36 37.3 62 35.8l21.3-1.3c.2 0 .5 0 .7 .2l17.8 11.8c5.1 3.3 10.5 5.9 16.1 7.7l-37.6 89.3c-2.3 5.5-7.4 9.2-13.3 9.7s-11.6-2.2-14.8-7.2L74.4 455.5l-56.1 8.3c-5.7 .8-11.4-1.5-15-6s-4.3-10.7-2.1-16zm248 60.4L211.7 413c5.6-1.8 11-4.3 16.1-7.7l17.8-11.8c.2-.1 .4-.2 .7-.2l21.3 1.3c26 1.5 50.3-12.6 62-35.8l9.6-19.1c.1-.2 .2-.3 .4-.4l43.2 
                                102.5c2.2 5.3 1.4 11.4-2.1 16s-9.3 6.9-15 6l-56.1-8.3-32.2 49.2c-3.2 5-8.9 7.7-14.8 7.2s-11-4.3-13.3-9.7z"
                            />
                        </svg>
                    </div>

                    <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
                        {t('awards')}
                    </div>
                </figure>

                {/* Confirm  */}
                <span
                    className={`flex-auto border-t-2 transition duration-500 ease-in-out ${awardsClass}`}
                ></span>

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

            <footer className="mt-8 pt-8">
                <ProductStepperButtons
                    activeStep={activeStep}
                    handleStepper={handleStepper}
                />

                <div>{children}</div>

                <ProductStepperButtons
                    activeStep={activeStep}
                    handleStepper={handleStepper}
                />
            </footer>
        </section>
    );
}
