'use client';

import React, { useState } from 'react';
import Button from '../../../../../../components/common/Button';
import { IEventExperience } from '../../../../../../../../lib/types';
import QuizPanel from '../../../../../../components/quiz/QuizPanel';

interface Props {
  eventExperience: IEventExperience;
}

export default function EventExperience({ eventExperience }: Props) {
  const { experiences: experience } = eventExperience;

  const [participate, setParticipate] = useState(false);

  const handleOnClickParticipate = () => {
    setParticipate(true);
  };

  return (
    <section>
      <div> Tipo de experiencia: {experience?.type}</div>
      <div> Precio para participar: {experience?.price}</div>
      <div> Nombre: {experience?.name}</div>
      <div> Descripción: {experience?.description}</div>
      {/* El usuario puede participar en la experiencia a través del botón de inscripción, debe de realizar el pago.  */}
      <Button
        class={
          'border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent '
        }
        title={'participate'}
        accent
        small
        onClick={handleOnClickParticipate}
      >
        Participar
      </Button>

      {participate && experience && (
        <section>
          <div>Participante registrado</div>

          <QuizPanel experience={experience} />
        </section>
      )}
    </section>
  );
}
