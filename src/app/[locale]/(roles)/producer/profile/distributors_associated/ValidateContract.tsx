import React from 'react';
import InputTextarea from '@/app/[locale]/components/common/InputTextarea';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';

interface Props {
    form: UseFormReturn<any>;
}

export default function CollaborationDetails({ form }: Props) {
    const t = useTranslations();
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <section className="border-1 rounded-medium space-y-8 border p-4 bg-cerv-brown bg-opacity-10">
            <div className="flex flex-col space-y-2">
                {/* Checkbox input to agree with the distribution contract terms and services */}
                <label htmlFor="terms" className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="terms"
                        value=""
                        {...register('is_accept_terms')}
                        className="h-4 w-4 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde"
                    />
                    <p>
                        {' '}
                        {t('agree_terms_and_conditions_contract_distribution')}
                    </p>
                </label>

                {/* Error input isSigned */}
                {errors.is_accept_terms && (
                    <DisplayInputError message="errors.is_accept_terms" />
                )}
            </div>

            {/* Text area to write a message to the distributor to formalize the contract  */}
            <InputTextarea
                form={form}
                label={'message'}
                labelText={t('message_to_distributor_contract_distribution')}
                registerOptions={{
                    required: true,
                }}
                placeholder={t('introduce_message_to_distributor')}
            />
        </section>
    );
}
