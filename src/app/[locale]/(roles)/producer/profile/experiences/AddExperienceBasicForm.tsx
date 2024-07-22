import InputLabel from '@/app/[locale]/components/common/InputLabel';
import SelectInput from '@/app/[locale]/components/common/SelectInput';
import InputTextarea from '@/app/[locale]/components/common/InputTextarea';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';

enum ExperienceTypes {
    beer_master = 'beer_master',
    blind_tasting = 'bling_tasting',
}

export const experience_options: {
    label: string;
    value: ExperienceTypes;
}[] = [
    { label: 'beer_master', value: ExperienceTypes.beer_master },
    { label: 'blind_tasting', value: ExperienceTypes.blind_tasting },
];

interface Props {
    form: UseFormReturn<any, any>;
    setIsBeerMasterExperience: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddExperienceBasicForm({
    form,
    setIsBeerMasterExperience,
}: Props) {
    const t = useTranslations();

    const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === ExperienceTypes.beer_master) {
            setIsBeerMasterExperience(true);
        } else {
            setIsBeerMasterExperience(false);
        }
    };

    return (
        <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
            <legend className="text-2xl">{t('experiences_info')}</legend>

            {/* Experience type  */}
            <SelectInput
                form={form}
                labelTooltip={'experience_tooltip'}
                options={experience_options}
                label={'experience'}
                registerOptions={{
                    required: true,
                }}
                onChange={selectOnChange}
            />

            {/* PRICE  */}
            <InputLabel
                form={form}
                label={'price'}
                registerOptions={{
                    required: true,
                    valueAsNumber: true,
                }}
                inputType="number"
                labelText="Price (€)"
                defaultValue={0}
            />

            {/* Experience name  */}
            <InputLabel
                form={form}
                label={'name'}
                registerOptions={{
                    required: true,
                }}
                placeholder={t('introduce_experience_name')}
            />

            {/* Experience description  */}
            <InputTextarea
                form={form}
                label={'description'}
                registerOptions={{
                    required: true,
                }}
                placeholder={`${t('introduce_experience_description')}`}
            />
        </fieldset>
    );
}
