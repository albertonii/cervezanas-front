'use client';

import Button from '../../../../../../components/common/Button';
import QuizPanel from '../../../../../../components/quiz/QuizPanel';
import React, { useState } from 'react';
import { IEventExperience } from '../../../../../../../../lib/types';
import { useAuth } from '../../../../../../(auth)/Context/useAuth';
import BMPaymentModal from './BMPaymentModal';
import { useMessage } from '../../../../../../components/message/useMessage';

interface Props {
  eventExperience: IEventExperience;
}

export default function EventExperience({ eventExperience }: Props) {
  const { experiences: experience } = eventExperience;
  const { supabase, user } = useAuth();
  const { handleMessage } = useMessage();

  const [participate, setParticipate] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleShowPaymentModal = (show: boolean) => {
    setShowPaymentModal(show);
  };

  const handleOnClickParticipate = async () => {
    // Comprobar que no haya participado ya en la experiencia
    const { data: participants, error: errorParticipants } = await supabase
      .from('beer_master_experience_participants')
      .select('id')
      .eq('gamification_id', user?.id)
      .eq('experience_id', experience?.id);

    if (errorParticipants) {
      console.error(errorParticipants);
      return;
    }

    if (participants.length > 0) {
      handleMessage({
        message: 'El usuario ya se ha registrado en esta experiencia',
        type: 'warning',
      });
      return;
    }
  };

  return (
    <section>
      <div> Tipo de experiencia: {experience?.type}</div>
      <div> Precio para participar: {experience?.price}</div>
      <div> Nombre: {experience?.name}</div>
      <div> Descripción: {experience?.description}</div>
      {/* El usuario puede participar en la experiencia a través del botón de inscripción, debe de realizar el pago.  */}
      {!participate ? (
        <Button
          title={'participate'}
          primary
          small
          onClick={handleOnClickParticipate}
        >
          Participar
        </Button>
      ) : (
        <>
          {isPaymentValid && experience ? (
            <section>
              <div>Participante registrado</div>

              <QuizPanel experience={experience} />
            </section>
          ) : (
            <>Cargando</>
          )}
        </>
      )}

      {showPaymentModal && experience && (
        <BMPaymentModal
          handleCloseModal={handleShowPaymentModal}
          handleSetModal={handleShowPaymentModal}
          experience={experience}
          eventExperience={eventExperience}
        />
      )}
    </section>
  );
}
