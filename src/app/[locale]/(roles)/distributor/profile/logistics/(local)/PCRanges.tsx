import React from 'react';
import { UseFormRegister, UseFormReturn } from 'react-hook-form';
import { IPCRangesProps } from '../../../../../../../lib/types/types';
import InputForm from '../../../../../components/InputForm';
import Label from '../../../../../components/Label';
import InputLabel from '../../../../../components/common/InputLabel';
import { useTranslations } from 'next-intl';

interface Props {
    item: IPCRangesProps;
    index: number;
    form: UseFormReturn<any>;
}

export default function PCRanges({ item, index, form }: Props) {
    const t = useTranslations();
    const { register } = form;

    // const [from, setFrom] = useState(item?.from ?? 35600);
    // const [to, setTo] = useState(item?.to ?? 35699);

    // const handleStart = (e: string) => {
    //   const value = parseInt(e);
    //   setFrom(value);
    // };

    // const handleEnd = (e: string) => {
    //   const value = parseInt(e);
    //   setTo(value);
    // };

    return (
        <div className="grid grid-cols-2 space-x-4">
            <Label>
                <InputForm
                    register={register}
                    inputName={`ranges.${index}.from`}
                    required={true}
                    type={'number'}
                    // id={`${index}-from`}
                    // defaultValue={item.from}
                />
            </Label>

            <InputLabel
                form={form}
                label={'postal_code'}
                labelText={`${t('postal_code')}`}
                registerOptions={{
                    required: true,
                    valueAsNumber: true,
                }}
                placeholder={'0'}
                inputType="number"
            />

            <Label>
                <InputForm
                    register={register}
                    inputName={`ranges.${index}.to`}
                    required={true}
                    type={'number'}
                    // id={`${index}-to`}
                    // defaultValue={item.to}
                />
            </Label>
        </div>
    );
}
