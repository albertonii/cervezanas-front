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
    console.log(eventExperience.id);
    router.push(
      `/${locale}/events/${eventExperience.event_id}/experiences/${eventExperience?.id}`,
    );
  };

  return (
    <section>
      <div>Tipo de experiencia: {t(experience?.type)}</div>

      <div>Nombre: {experience?.name}</div>
      <div> Descripcioón: {experience?.description}</div>
      <div> Precio: {experience?.price}</div>

      <Button title={t('participate')} accent small onClick={handleOnClick}>
        {t('access')}
      </Button>
    </section>
  );
}
