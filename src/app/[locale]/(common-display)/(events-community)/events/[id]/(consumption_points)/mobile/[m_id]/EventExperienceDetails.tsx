import React from 'react';
import Button from '../../../../../../../components/common/Button';
import { useRouter } from 'next/navigation';
import { IEventExperience } from '../../../../../../../../../lib/types/types';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../../../../(auth)/Context/useAuth';
import { useMessage } from '../../../../../../../components/message/useMessage';
import { ROLE_ENUM } from '../../../../../../../../../lib/enums';

interface Props {
    eventExperience: IEventExperience;
}

export default function EventExperienceDetails({ eventExperience }: Props) {
    const t = useTranslations();
    const { experiences: experience } = eventExperience;

    const router = useRouter();
    const locale = useLocale();
    const { isLoggedIn, user } = useAuth();
    const { handleMessage } = useMessage();

    const handleOnClick = () => {
        if (!isLoggedIn) {
            handleMessage({
                type: 'info',
                message: 'must_be_logged_in_add_store',
            });
            return;
        }

        if (
            user.role === ROLE_ENUM.Productor ||
            user.role === ROLE_ENUM.Distributor
        ) {
            handleMessage({
                type: 'info',
                message: 'must_be_user_role_consumer_to_participate',
            });
            return;
        }

        router.push(
            `/${locale}/events/${eventExperience.event_id}/experiences/${eventExperience?.id}`,
        );
    };

    return (
        <section className="relative bg-white bg-opacity-30 border-beer-blonde border-4 p-10 rounded-md shadow-xl space-y-4">
            <div className="absolute top-2 right-2 font-semibold ">
                {experience?.price} €
            </div>

            <div className="flex justify-between flex-col">
                <h2 className="font-semibold text-2xl">{experience?.name}</h2>
                <span>Tipo de experiencia: {t(experience?.type)}</span>
            </div>

            <div className="flex flex-col">
                Descripción:
                <span>{experience?.description}</span>
            </div>

            <Button
                title={t('participate')}
                accent
                small
                onClick={handleOnClick}
            >
                {t('participate')}
            </Button>
        </section>
    );
}
