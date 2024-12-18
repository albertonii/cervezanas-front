'use client';

import BMPaymentModal from './BMPaymentModal';
import ParticipationQRCode from './ParticipationQRCode';
import QuizPanel from '@/app/[locale]/components/quiz/QuizPanel';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React, { useEffect, useState } from 'react';
import { shuffleArray } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

import {
    CERVEZANAS_BEER_URL,
    LOCALHOST_3000,
    ROUTE_BARMAN,
    ROUTE_CP,
    ROUTE_EVENTS,
    ROUTE_EXPERIENCE_PARTICIPANT,
    ROUTE_PRODUCER,
} from '@/config';

import {
    getUserParticipant,
    hasUserParticipatedInExperienceBefore,
} from './actions';

import {
    IBMExperienceParticipants,
    Question,
    QuestionsState,
} from '@/lib/types/quiz';
import { IEventExperience } from '@/lib/types/types';

interface Props {
    eventExperience: IEventExperience;
}

export default function EventExperience({ eventExperience }: Props) {
    const t = useTranslations();

    const { experiences: experience } = eventExperience;
    const { supabase, user } = useAuth();
    const { handleMessage } = useMessage();

    const router = useRouter();
    const locale = useLocale();

    const [experienceParticipant, setExperienceParticipant] =
        useState<IBMExperienceParticipants>();
    const [isPaymentValid, setIsPaymentValid] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const [bmExperienceParticipantId, setBMExperienceParticipantId] =
        useState<string>();

    const [questions, setQuestions] = useState<QuestionsState>([]);

    useEffect(() => {
        console.log('QUESTIONS:', questions);
        console.log('EXPERIENCE PARTICIPANT:', experienceParticipant);
        console.log('EXPERIENCE:', experience);
    }, [questions, experienceParticipant, experience]);

    useEffect(() => {
        supabase
            .channel('participants')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bm_experience_participants',
                    filter: `gamification_id=eq.${experienceParticipant?.gamification_id}`,
                },
                (payload) => {
                    const newParticipant =
                        payload.new as IBMExperienceParticipants;

                    setIsPaymentValid(newParticipant.is_paid);
                    setIsFinished(newParticipant.is_finished);
                },
            )
            .subscribe();
    }, [supabase]);

    useEffect(() => {
        const getBMExperienceParticipant = async () => {
            if (!experience) return;
            if (!user) return;

            const hasUserParticipated =
                await hasUserParticipatedInExperienceBefore(
                    user?.id,
                    eventExperience.event_id,
                    eventExperience.cp_id,
                    eventExperience.experience_id,
                );

            // Mostrar QR para validar el pago
            if (hasUserParticipated && !!eventExperience.cp_id) {
                const bmExperienceParticipant = await getUserParticipant(
                    user?.id,
                    eventExperience.event_id,
                    eventExperience.cp_id,
                    eventExperience.experience_id,
                );

                if (bmExperienceParticipant) {
                    setIsRegistered(true);

                    setExperienceParticipant(bmExperienceParticipant);
                    setIsFinished(bmExperienceParticipant.is_finished);
                    setIsPaymentValid(bmExperienceParticipant.is_paid);
                    setBMExperienceParticipantId(bmExperienceParticipant.id);
                }
            } else if (hasUserParticipated && !!eventExperience.cp_id) {
                const bmExperienceParticipant = await getUserParticipant(
                    user?.id,
                    eventExperience.event_id,
                    eventExperience.cp_id,
                    eventExperience.experience_id,
                );

                if (bmExperienceParticipant) {
                    setIsRegistered(true);

                    setExperienceParticipant(bmExperienceParticipant);
                    setIsFinished(bmExperienceParticipant.is_finished);
                    setIsPaymentValid(bmExperienceParticipant.is_paid);

                    setBMExperienceParticipantId(bmExperienceParticipant.id);
                }
            }
        };

        getBMExperienceParticipant();
    }, [user, isRegistered]);

    useEffect(() => {
        if (isPaymentValid) {
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
    }, [isPaymentValid]);

    const handleShowPaymentModal = (show: boolean) => {
        setShowPaymentModal(show);
    };

    const handleOnClickParticipate = async () => {
        // Comprobar que no haya participado ya en la experiencia
        if (eventExperience.cp_id) {
            const hasUserParticipated =
                await hasUserParticipatedInExperienceBefore(
                    user?.id,
                    eventExperience.event_id,
                    eventExperience.cp_id,
                    eventExperience.experience_id,
                );

            if (hasUserParticipated) {
                handleMessage({
                    message:
                        'El usuario ya se ha registrado en esta experiencia',
                    type: 'warning',
                });
                return;
            }
        }

        if (experienceParticipant?.is_finished) {
            handleMessage({
                message: 'El usuario ya se ha registrado en esta experiencia',
                type: 'warning',
            });
            return;
        }

        setShowPaymentModal(true);
    };

    const handleParticipate = (experienceParticipantId: string) => {
        setBMExperienceParticipantId(experienceParticipantId);
        setIsRegistered(true);
    };

    const handleOnClickEventComeBack = () => {
        const cpId = eventExperience.cp_id;

        if (!cpId) return router.push(`/${locale}${ROUTE_EVENTS}`);

        router.push(
            `/${locale}${ROUTE_EVENTS}/${eventExperience.event_id}${ROUTE_CP}/${cpId}`,
        );
    };

    const environmentState = process.env.NODE_ENV;
    const host =
        environmentState === 'development'
            ? LOCALHOST_3000
            : CERVEZANAS_BEER_URL;

    const experienceParticipatantBarmanUrl = `${host}/${locale}${ROUTE_PRODUCER}${ROUTE_BARMAN}${ROUTE_EXPERIENCE_PARTICIPANT}/${bmExperienceParticipantId}`;
    console.info(
        'URL PARA EL BARMAN EN EL STAND:',
        experienceParticipatantBarmanUrl,
    );

    return (
        <section className="w-full flex-col flex items-center justify-center space-y-4 ">
            <Button
                title={'come_back_cp'}
                primary
                small
                onClick={handleOnClickEventComeBack}
            >
                Volver al Punto de Consumo
            </Button>

            <div className="border-8 p-4 py-20 w-full sm:w-[700px] flex flex-col justify-center items-center space-y-2 bg-beer-softFoam bg-[url('/assets/madera-dark-account.webp')] bg-cover bg-top bg-no-repeat text-white rounded-xl shadow-2xl">
                <div className="">
                    {' '}
                    Tipo de experiencia: {t(experience?.type)}
                </div>
                <div className="font-bold">
                    {' '}
                    {/* Precio para participar: {experience?.price} */}
                </div>
                <div className="text-3xl font-bold">
                    {' '}
                    Nombre: {experience?.name}
                </div>
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
                    {t('participate')}
                </Button>
            )}

            {isRegistered && !isPaymentValid && bmExperienceParticipantId && (
                <div className="border-2 bg-beer-softFoam border-beer-draft rounded-sm space-y-4 p-8">
                    <div>
                        <h2 className="text-xl mb-8 font-semibold text-center">
                            Muestra el código QR para confirmar el pago de la
                            experiencia.{' '}
                        </h2>
                        <p>
                            El pago de la inscripción se realizará físicamente
                            en el mismo Punto de Consumo.
                        </p>
                        <p className="mb-8">
                            El Punto de Consumo debe de validar el pago de la
                            inscripción y a partir de ese momento podrás
                            comenzar a participar en la experiencia.
                        </p>
                        <p className="text-center bg-white p-4">
                            <ParticipationQRCode
                                experienceParticipantId={
                                    bmExperienceParticipantId
                                }
                            />
                        </p>
                    </div>
                </div>
            )}

            {isRegistered && isPaymentValid && (
                <section>
                    {experience &&
                        experienceParticipant &&
                        questions.length > 0 && (
                            <QuizPanel
                                isFinished={isFinished}
                                questions={questions}
                                experience={experience}
                                experienceParticipant={experienceParticipant}
                            />
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
