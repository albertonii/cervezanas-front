'use client';

import BMPaymentModal from './BMPaymentModal';
import Button from '../../../../../../components/common/Button';
import QuizPanel from '../../../../../../components/quiz/QuizPanel';
import React, { useEffect, useState } from 'react';
import {
  IEventExperience,
  IBMExperienceParticipants,
} from '../../../../../../../../lib/types/types';
import { useAuth } from '../../../../../../(auth)/Context/useAuth';
import { useMessage } from '../../../../../../components/message/useMessage';

interface Props {
  eventExperience: IEventExperience;
}

export default function EventExperience({ eventExperience }: Props) {
  const { experiences: experience } = eventExperience;
  const { supabase, user } = useAuth();
  const { handleMessage } = useMessage();

  const [experienceParticipant, setExperienceParticipant] =
    useState<IBMExperienceParticipants>();
  const [participate, setParticipate] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleShowPaymentModal = (show: boolean) => {
    setShowPaymentModal(show);
  };

  useEffect(() => {
    const getBMExperienceParticipant = async () => {
      // Comprobar que no haya participado ya en la experiencia
      const { data, error: errorParticipants } = await supabase
        .from('beer_master_experience_participants')
        .select('*')
        .eq('gamification_id', user?.id)
        .eq('experience_id', experience?.id);

      if (errorParticipants) {
        console.error(errorParticipants);
        return;
      }

      if (data.length > 0) {
        const experienceParticipants = data as IBMExperienceParticipants[];

        setExperienceParticipant(experienceParticipants[0]);
        setIsFinished(experienceParticipants[0].is_finished);
        setIsPaymentValid(experienceParticipants[0].is_paid);
        setAlreadyParticipated(true);
      }
    };

    if (user) {
      getBMExperienceParticipant();
    }
  }, []);

  const handleOnClickParticipate = async () => {
    if (experienceParticipant?.is_finished) {
      handleMessage({
        message: 'El usuario ya se ha registrado en esta experiencia',
        type: 'warning',
      });
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleParticipate = (participate: boolean) => {
    setParticipate(participate);
  };

  const handleIsPaymentValid = (isPaymentValid: boolean) => {
    setIsPaymentValid(isPaymentValid);
  };

  return (
    <section>
      <div> Tipo de experiencia: {experience?.type}</div>
      <div> Precio para participar: {experience?.price}</div>
      <div> Nombre: {experience?.name}</div>
      <div> Descripción: {experience?.description}</div>

      {/* El usuario puede participar en la experiencia a través del botón de inscripción, debe de realizar el pago.  */}
      {!participate && !alreadyParticipated ? (
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
          {isPaymentValid ? (
            <>
              {!isFinished ? (
                <section>
                  {experience && experienceParticipant && (
                    <>
                      <div>Participante registrado</div>

                      <QuizPanel
                        experience={experience}
                        experienceParticipant={experienceParticipant}
                      />
                    </>
                  )}
                </section>
              ) : (
                <div>
                  <p>
                    Ya ha participado en esta experiencia. No puedes volver a
                    participar.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div>
              <p>
                El Punto de Consumo donde participas obtendrá una notificación
                de tu inscripción. El pago de la inscripción se realizará
                físicamente en el mismo Punto de Consumo seleccionado y así
                podrás comenzar a participar en la experiencia.
              </p>

              <p>
                El Punto de Consumo debe de validar el pago de la inscripción y
                a partir de ese momento podrás comenzar a participar en la
                experiencia.
              </p>
            </div>
          )}
        </>
      )}

      {showPaymentModal && experience && (
        <BMPaymentModal
          handleCloseModal={handleShowPaymentModal}
          handleSetModal={handleShowPaymentModal}
          experience={experience}
          eventExperience={eventExperience}
          handleParticipate={handleParticipate}
        />
      )}
    </section>
  );
}
