import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { ICustomizeSettings } from '../../../../../lib/types/types';
import { ModalAddBoxPackFormData } from '../../../../../lib/types/product';

interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export function BoxPackInfoSection({ form }: Props) {
    const t = useTranslations();

    const { register, setValue } = form;

    return (
        <>
            {/* Select product type  */}
            <section className="relative flex-auto pt-6">

            </section>
        </>
    );
}
