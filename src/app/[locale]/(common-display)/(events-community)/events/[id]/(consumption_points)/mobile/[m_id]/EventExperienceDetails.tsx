import React from 'react';
import Button from '../../../../../../../components/common/Button';
import { useRouter } from 'next/navigation';
import { IEventExperience } from '../../../../../../../../../lib/types';
import { useLocale, useTranslations } from 'next-intl';

interface Props {
  eventExperience: IEventExperience;
}

export default function EventExperienceDetails({ eventExperience }: Props) {
  const t = useTranslations();
  const { experiences: experience } = eventExperience;

  const router = useRouter();
  const locale = useLocale();

  const handleOnClick = () => {
    router.push(
      `/${locale}/events/${eventExperience.event_id}/experiences/${eventExperience?.id}`,
    );
  };

  return (
    <section className="relative bg-beer-softFoam p-4 rounded-md shadow-xl space-y-4">
      <div className="absolute top-2 right-2 font-semibold ">
        {experience?.price} €
      </div>

      <div className="flex justify-between">
        <div className="font-semibold">{experience?.name}</div>
        <div>Tipo de experiencia: {t(experience?.type)}</div>
      </div>

      <div className="flex flex-col">
        Descripción:
        <span>{experience?.description}</span>
      </div>

      <Button title={t('participate')} accent small onClick={handleOnClick}>
        {t('participate')}
      </Button>
    </section>
  );
}
