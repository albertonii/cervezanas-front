import { useTranslations } from 'next-intl';
import React from 'react';
import Button from '../common/Button';

interface Props {
    activeStep: number;
    handleStepper: (step: number) => void;
}

export default function ProductStepperButtons({
    activeStep,
    handleStepper,
}: Props) {
    const t = useTranslations();

    return (
        <div className="mt-4 flex p-2">
            {activeStep >= 1 && (
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
            )}
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

                {/* {activeStep !== 3 && (
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
                        )} */}
            </div>
        </div>
    );
}
