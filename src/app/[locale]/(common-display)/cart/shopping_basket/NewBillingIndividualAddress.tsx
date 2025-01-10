'use client';

import AddressForm from '@/app/[locale]/components/form/AddressForm';
import React, { forwardRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

interface Props {
    form: UseFormReturn<any, any>;
}

export const NewBillingIndividualAddress = forwardRef(({ form }: Props) => {
    const t = useTranslations();

    const {
        formState: { errors },
    } = form;

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.info('Validation errors:', errors);
        }
    }, [errors]);

    return <AddressForm form={form} addressNameId={'billing'} />;
});
