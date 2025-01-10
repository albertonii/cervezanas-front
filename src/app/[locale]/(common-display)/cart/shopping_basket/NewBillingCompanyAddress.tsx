'use client';

import AddressCompanyForm from '@/app/[locale]/components/form/AddressCompanyForm';
import React, { forwardRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

export type NewBillingCompanyAddressRef = {
    submit: () => void;
    trigger: () => Promise<boolean>;
};

interface Props {
    form: UseFormReturn<any, any>;
}

export const NewBillingCompanyAddress = forwardRef(({ form }: Props) => {
    const t = useTranslations();

    const {
        formState: { errors },
    } = form;

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.info('Validation errors:', errors);
        }
    }, [errors]);

    return <AddressCompanyForm form={form} addressNameId={'billing'} />;
});
