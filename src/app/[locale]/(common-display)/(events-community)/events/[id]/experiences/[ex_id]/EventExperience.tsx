'use client';

import BMPaymentModal from './BMPaymentModal';
import QuizPanel from '../../../../../../components/quiz/QuizPanel';
import Button from '../../../../../../components/common/Button';
import React, { useEffect, useState } from 'react';
import {
    IEventExperience,
    IBMExperienceParticipants,
    Question,
    QuestionsState,
} from '../../../../../../../../lib/types/quiz';
import { useAuth } from '../../../../../../(auth)/Context/useAuth';
import { useMessage } from '../../../../../../components/message/useMessage';
import { shuffleArray } from '../../../../../../../../utils/utils';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
    ROUTE_CP_FIXED,
    ROUTE_CP_MOBILE,
    ROUTE_EVENTS,
} from '../../../../../../../../config';

interface Props {
    eventExperience: IEventExperience;
}

export default function EventExperience({ eventExperience }: Props) {
    const { experiences: experience } = eventExperience;
    const { supabase, user } = useAuth();
    const { handleMessage } = useMessage();
    const router = useRouter();
    const locale = useLocale();

    console.log(eventExperience);

    const [experienceParticipant, setExperienceParticipant] =
        useState<IBMExperienceParticipants>();
    const [isPaymentValid, setIsPaymentValid] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const [questions, setQuestions] = useState<QuestionsState>([]);

    useEffect(() => {
        const getBMExperienceParticipant = async () => {
            if (!experience) return;
            if (!user) return;

            // Comprobar que no haya participado ya en la experiencia
            const { data, error: errorParticipants } = await supabase
                .from('bm_experience_participants')
                .select('*')
                .eq('gamification_id', user?.id)
                .eq('event_id', eventExperience.event_id)
                .eq('cpm_id', eventExperience.cp_mobile_id)
                .eq('experience_id', experience.id);

            if (errorParticipants) {
                console.error(errorParticipants);
                return;
            }

            if (data.length > 0) {
                setIsRegistered(true);

                const experienceParticipants =
                    data[0] as IBMExperienceParticipants;

                setExperienceParticipant(experienceParticipants);
                setIsFinished(experienceParticipants.is_finished);
                setIsPaymentValid(experienceParticipants.is_paid);
            }
        };

        getBMExperienceParticipant();
    }, [user]);

    useEffect(() => {
        if (isPaymentValid && !isFinished) {
            const questions_array = experience?.bm_questions?.map(
                (question: Question) => ({
                    ...question,
                    answers: shuffleArray([
                        ...question.incorrect_answers,
                        question.correct_answer,
                    ]),
                }),
            );

            setQuestions(questions_array ?? []);
        }
    }, [isPaymentValid, isFinished]);

    const handleShowPaymentModal = (show: boolean) => {
        setShowPaymentModal(show);
    };

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

    const handleParticipate = (participate: boolean) => {};

    const handleIsPaymentValid = (isPaymentValid: boolean) => {
        setIsPaymentValid(isPaymentValid);
    };

    const handleIsFinished = (isFinished: boolean) => {
        setIsFinished(isFinished);
    };

    const handleOnClickEventComeBack = () => {
        const cpMobileId = eventExperience.cp_mobile_id;
        const cpFixedId = eventExperience.cp_fixed_id;

        if (!cpMobileId && !cpFixedId)
            return router.push(`/${locale}${ROUTE_EVENTS}`);

        cpMobileId
            ? router.push(
                  `/${locale}${ROUTE_EVENTS}/${eventExperience.event_id}${ROUTE_CP_MOBILE}/${cpMobileId}`,
              )
            : router.push(
                  `/${locale}${ROUTE_EVENTS}/${eventExperience.event_id}${ROUTE_CP_FIXED}/${cpFixedId}`,
              );
    };

    return (
        <section className="w-full flex-col flex items-center justify-center space-y-4 ">
            <Button
                title={'participate'}
                primary
                small
                onClick={handleOnClickEventComeBack}
            >
                Volver al evento
            </Button>

            <div className="border-2 rounded-sm p-4 w-full sm:w-[400px] flex flex-col justify-center items-center space-y-2 bg-beer-softFoam">
                <div> Tipo de experiencia: {experience?.type}</div>
                <div> Precio para participar: {experience?.price}</div>
                <div> Nombre: {experience?.name}</div>
                <div> Descripción: {experience?.description}</div>
            </div>

            {/* El usuario puede participar en la experiencia a través del botón de inscripción, debe de realizar el pago.  */}
            {!isRegistered && (
                <Button
                    title={'participate'}
                    primary
                    small
                    onClick={handleOnClickParticipate}
                >
                    Participar
                </Button>
            )}

            {isRegistered && !isPaymentValid && (
                <div>
                    <p>
                        El Punto de Consumo donde participas obtendrá una
                        notificación de tu inscripción. El pago de la
                        inscripción se realizará físicamente en el mismo Punto
                        de Consumo seleccionado y así podrás comenzar a
                        participar en la experiencia.
                    </p>

                    <p>
                        El Punto de Consumo debe de validar el pago de la
                        inscripción y a partir de ese momento podrás comenzar a
                        participar en la experiencia.
                    </p>
                </div>
            )}

            {isRegistered && isPaymentValid && !isFinished && (
                <section>
                    {experience && experienceParticipant && (
                        <>
                            {questions.length > 0 && (
                                <QuizPanel
                                    questions={questions}
                                    experience={experience}
                                    experienceParticipant={
                                        experienceParticipant
                                    }
                                    handleIsFinished={handleIsFinished}
                                />
                            )}
                        </>
                    )}
                </section>
            )}

            {isRegistered && isPaymentValid && isFinished && (
                <div>
                    <p>
                        Ya ha participado en esta experiencia. No puedes volver
                        a participar.
                    </p>
                </div>
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
