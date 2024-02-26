'use client';

import React, { useState } from 'react';
import Button from '../../../../../../components/common/Button';
import { useTranslation } from 'react-i18next';
import { IEventExperience } from '../../../../../../../../lib/types';

interface Props {
  eventExperience: IEventExperience;
}

export default function EventExperience({ eventExperience }: Props) {
  const t = useTranslation();
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

      {participate && (
        <section>
          <div>Participante registrado</div>

          <Button
            class={
              'border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent '
            }
            title={'access'}
          >
            Acceder
          </Button>

          {experience?.bm_questions?.map((question) => {
            return (
              <section className="bg-beer-softFoam p-4 shadow-xl rounded-md">
                <div>{question.question}</div>
                <div>
                  {question.answers.map((answer) => {
                    return (
                      <div>
                        <input
                          type="radio"
                          name={question.question}
                          value={answer.answer}
                        />
                        <label>{answer.answer}</label>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </section>
      )}
    </section>
  );
}
