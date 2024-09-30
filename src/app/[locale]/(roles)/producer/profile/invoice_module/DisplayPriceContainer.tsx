import Label from '@/app/[locale]/components/ui/Label';
import Title from '@/app/[locale]/components/ui/Title';
import React from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
    text: string;
    price: number;
}

const DisplayPriceContainer = ({ text, price }: Props) => {
    const t = useTranslations();

    return (
        <div className="border border-xl border-gray-300 rounded-md flex flex-col items-center justify-center h-40">
            <Label size="medium" color="black" font="semibold">
                {t(text)}
            </Label>

            <Title size="large" color="beer-draft">
                {formatCurrency(price)}
            </Title>
        </div>
    );
};

export default DisplayPriceContainer;
