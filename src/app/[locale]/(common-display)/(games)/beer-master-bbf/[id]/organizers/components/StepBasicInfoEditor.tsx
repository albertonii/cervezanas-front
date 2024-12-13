import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { IConfigurationStepFormData } from '@/lib/types/beerMasterGame';

interface Props {
    form: UseFormReturn<IConfigurationStepFormData, any>;
}

const StepBasicInfoEditor = ({ form }: Props) => {
    const t = useTranslations('bm_game');
    return (
        <div className="space-y-4">
            <div>
                <InputLabel
                    form={form}
                    label="title"
                    placeholder="Ej. Los Orígenes de la cerveza catalana"
                />

                <InputLabel
                    form={form}
                    label="step_number"
                    registerOptions={{ valueAsNumber: true, min: 1 }}
                />
            </div>

            <div>
                <InputTextarea
                    rows={3}
                    form={form}
                    label="description"
                    placeholder="Ej. Una breve descripción del paso"
                />
            </div>

            <div>
                <InputLabel
                    form={form}
                    label="location"
                    labelText="bm_game.location"
                    placeholder="Ej. Stand de cervezas artesanas"
                />
            </div>

            <div className="flex items-center space-x-2">
                <InputLabel
                    inputType="checkbox"
                    form={form}
                    label="is_unlocked"
                    labelText={'step_locked_initially'}
                />
            </div>
        </div>
    );
};

export default StepBasicInfoEditor;
