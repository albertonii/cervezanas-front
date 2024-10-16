import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

interface Props {
    form: UseFormReturn<any, any>;
}

export default function BasicEventForm({ form }: Props) {
    const t = useTranslations();

    return (
        <>
            {/* Event Information  */}
            <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                <legend className="text-2xl">{t('events_info')}</legend>

                {/* Event name  */}
                <InputLabel
                    form={form}
                    label={'name'}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder={t('introduce_event_name')}
                />

                {/* Event description  */}
                <InputTextarea
                    form={form}
                    label={'description'}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder={`${t('introduce_event_description')}`}
                />

                {/* Start date and end date  */}
                <div className="flex flex-row space-x-2">
                    <InputLabel
                        form={form}
                        label={'start_date'}
                        registerOptions={{
                            required: true,
                            valueAsDate: true,
                        }}
                        inputType="date"
                    />

                    <InputLabel
                        form={form}
                        label={'end_date'}
                        registerOptions={{
                            required: true,
                            valueAsDate: true,
                        }}
                        inputType="date"
                    />
                </div>
            </fieldset>

            {/* Logo and publicitary img */}
            <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                <legend className="text-2xl">{t('event_advertising')}</legend>

                {/* Logo */}

                {/* AD Img  */}
            </fieldset>
        </>
    );
}
