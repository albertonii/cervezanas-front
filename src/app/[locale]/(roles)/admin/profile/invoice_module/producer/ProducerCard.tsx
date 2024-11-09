import UserAbout from '@/app/[locale]/(common-display)/user-info/[id]/UserAbout';
import ProducerInformation from '@/app/[locale]/(common-display)/user-info/[id]/ProducerInformation';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IProducerUser } from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
}

const ProducerCard = ({ producer }: Props) => {
    const t = useTranslations();

    return (
        <section className="space-y-8 border border-xl rounded-lg border-gray-300 p-8">
            <UserAbout user={producer.users!} />
            <ProducerInformation producer={producer} />
        </section>
    );
};

export default ProducerCard;
