import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { ModalAddBoxPackFormData } from '../../../../../lib/types/product';

interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export default function BoxPackItems({ form }: Props) {
    const { control } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'box_packs',
    });

    return <div>BoxPackItems</div>;
}
