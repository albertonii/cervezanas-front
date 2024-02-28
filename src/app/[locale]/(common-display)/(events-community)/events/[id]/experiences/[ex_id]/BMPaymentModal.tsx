import { useTranslations } from 'next-intl';
import React, { ComponentProps } from 'react';
import { useAuth } from '../../../../../../(auth)/Context/useAuth';
import {
  IEventExperience,
  IExperience,
} from '../../../../../../../../lib/types';
import Modal from '../../../../../../components/modals/Modal';

interface Props {
  handleParticipate: ComponentProps<any>;
  handleSetModal: ComponentProps<any>;
  handleCloseModal: ComponentProps<any>;
  experience: IExperience;
  eventExperience: IEventExperience;
}

export default function BMPaymentModal({
  handleParticipate,
  handleSetModal,
  handleCloseModal,
  experience,
  eventExperience,
}: Props) {
  const t = useTranslations();
  const { supabase, user } = useAuth();

  const handleOnClickParticipate = async () => {
    // Crear un nuevo registro en la tabla beer_master_experience_participants
    const { data, error } = await supabase
      .from('beer_master_experience_participants')
      .insert([
        {
          gamification_id: user?.id,
          experience_id: experience?.id,
          event_id: eventExperience.event_id,
          cpm_id: eventExperience.cp_mobile_id ?? null,
          cpf_id: eventExperience.cp_fixed_id ?? null,
          score: 0,
          is_paid: false,
          is_cash: false,
        },
      ]);

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      handleCloseModal(true);
      handleParticipate(true);
    }
  };

  return (
    <Modal
      showBtn={false}
      showModal={true}
      setShowModal={handleSetModal}
      btnTitle={t('participate')}
      title={'Experiencia Cervezanas'}
      description={`¡Bienvenido a la experiencia de Maestro Cervecero en el Evento ${eventExperience.events?.name}! `}
      handler={() => handleOnClickParticipate()}
      handlerClose={() => handleCloseModal(true)}
      classIcon={''}
      classContainer={''}
    >
      <section className="space-y-4">
        <p>
          Para poder inscribirte en esta experiencia, por favor haga clic en el
          botón &quot;Participar&quot;. Al hacerlo, comenzará la experiencia de
          Maestro Cervecero en el Evento {eventExperience.events?.name}.
        </p>

        <p>Por favor, tenga en cuenta lo siguiente:</p>

        <p className="flex flex-col">
          <span className="font-semibold">
            Coste de inscripción: {experience.price} €
          </span>

          <span>
            Al registrarte en esta experiencia, el Punto de Consumo donde
            participas obtendrá una notificación de tu inscripción. El pago de
            la inscripción se realizará físicamente en el mismo Punto de Consumo
            seleccionado y así podrás comenzar a participar en la experiencia.
          </span>
        </p>

        <p className="flex flex-col">
          <span className="font-semibold">Aprobación:</span>
          Una vez el Punto de Consumo confirme tu inscripción, podrás observar
          en esta misma página la información de la experiencia y cómo comenzar.
        </p>

        <p className="flex flex-col">
          <span className="font-semibold">Resultados y puntuación:</span>
          Al finalizar la experiencia, obtendrás tus resultados y puntuación en
          esta misma página. Obtendrás puntos Cervezanas por tu participación en
          la experiencia, además de la posibilidad de ganar premios y
          recompensas en el evento que estás visitando.
        </p>

        <p className="flex flex-col">
          <span className="font-semibold">Consultas y Contacto:</span> Si tiene
          preguntas o necesita asistencia durante el proceso de registro, por
          favor, póngase en contacto con el Punto de Consumo donde se realiza la
          experiencia.
        </p>

        <p className="flex flex-col">
          Al hacer clic en &quot;Participar&quot;, reconoce que ha leído y
          entendido este mensaje y acepta los términos y condiciones de la
          experiencia.
        </p>
      </section>
    </Modal>
  );
}
