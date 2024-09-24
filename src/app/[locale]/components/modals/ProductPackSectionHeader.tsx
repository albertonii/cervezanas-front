import Title from '../ui/Title';
import Description from '../ui/Description';
import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
    title: string;
}

const ProductPackSectionHeader = ({ title }: Props) => {
    const t = useTranslations();
    return (
        <>
            <Title size={'medium'} color={'black'}>
                {t(title)}
            </Title>

            <div className="space-y-2 mb-4">
                <Description size={'xsmall'} color={'black'}>
                    {t('add_product_pack_description')}
                </Description>

                <Description size={'xsmall'} color={'black'}>
                    {t('add_product_pack_description_2')}
                </Description>

                <Description size={'xsmall'} color={'black'}>
                    {t('add_product_pack_description_3')}
                </Description>
            </div>
        </>
    );
};

export default ProductPackSectionHeader;
