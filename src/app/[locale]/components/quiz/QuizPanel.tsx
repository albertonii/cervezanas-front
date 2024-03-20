import Button from '../common/Button';
import QuestionCard from './QuestionCard';
import QuizResults from './QuizResults';
import React, { ComponentProps, useEffect, useState } from 'react';
import {
    IBMExperienceParticipants,
    IExperience,
    Question,
    QuestionsState,
} from '../../../../lib/types/quiz';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '../message/useMessage';

interface Props {
    questions: QuestionsState;
    experience: IExperience;
    experienceParticipant: IBMExperienceParticipants;
}

export default function QuizPanel({
    questions,
    experience,
    experienceParticipant,
}: Props) {
    const t = useTranslations();

    const { supabase, user } = useAuth();
    const { handleMessage } = useMessage();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [isShowResults, setIsShowResults] = useState(false);
    const [productQuestionMap, setProductQuestionMap] = useState<{
        [key: string]: Question[];
    }>({});

    const totalQuestions = questions.length;

    const isQuestionAnswered = userAnswers[currentQuestionIndex] ? true : false;

    useEffect(() => {
        // Crear un mapeo de producto a preguntas
        const mapQuestionsToProducts = (questions: QuestionsState) => {
            const productMap: {
                [key: string]: Question[];
            } = {};

            questions.forEach((question) => {
                const { product_id } = question;

                if (!product_id) return;

                if (!productMap[product_id]) {
                    productMap[product_id] = [];
                }
                productMap[product_id].push(question);
            });

            return productMap;
        };

        setProductQuestionMap(mapQuestionsToProducts(questions));
    }, [questions]);

    const handleOnAnswerClick = (
        answer: string,
        currentQuestionIndex: number,
    ) => {
        // If user has already answered, do nothing
        if (isQuestionAnswered) return;
        // Check answer against correct answer
        const isCorrect =
            questions[currentQuestionIndex].correct_answer === answer;
        // Add score if answer is correct
        if (isCorrect) setScore((prev) => prev + 1);
        // Save the answer in the object for user answers
        setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
    };

    const handleChangeQuestion = (step: number) => {
        const newQuestionIndex = currentQuestionIndex + step;
        if (newQuestionIndex < 0 || newQuestionIndex >= totalQuestions) return;
        setCurrentQuestionIndex(newQuestionIndex);
    };

    const handleSubmitGame = async () => {
        // loop through the user answers and
        // sent the data to the server
        questions.map(async (question) => {
            const isCorrect =
                questions[currentQuestionIndex].correct_answer ===
                userAnswers[currentQuestionIndex];

            const userAnswer = userAnswers[currentQuestionIndex];

            const { error } = await supabase
                .from('bm_experience_user_responses')
                .insert({
                    participation_id: experienceParticipant.id,
                    is_correct: isCorrect,
                    answer: userAnswer,
                    score: score,
                    question_id: question.id,
                });

            if (error) {
                console.error(error);

                handleMessage({
                    type: 'error',
                    message:
                        'Ha ocurrido un error al registrar tu participación en el juego. Por favor, intenta de nuevo.',
                });

                return;
            }

            const correctAnswers = score;
            const incorrectAnswers = questions.length - score;

            // Each correct answer is 50 points
            const points = correctAnswers * 50;

            if (experienceParticipant.cpm_id) {
                const { error: expParticipantsError } = await supabase
                    .from('bm_experience_participants')
                    .update({
                        is_finished: true,
                        correct_answers: correctAnswers,
                        incorrect_answers: incorrectAnswers,
                        score: points,
                    })
                    .eq('gamification_id', user?.id)
                    .eq('experience_id', experience.id)
                    .eq('event_id', experienceParticipant.event_id)
                    .eq('cpm_id', experienceParticipant.cpm_id);

                if (expParticipantsError) {
                    console.error(expParticipantsError);

                    handleMessage({
                        type: 'error',
                        message:
                            'Ha ocurrido un error al registrar tu participación en el juego. Por favor, intenta de nuevo.',
                    });

                    return;
                }
            } else if (experienceParticipant.cpf_id) {
                const { error: expParticipantsError } = await supabase
                    .from('bm_experience_participants')
                    .update({
                        is_finished: true,
                        correct_answers: correctAnswers,
                        incorrect_answers: incorrectAnswers,
                        score: points,
                    })
                    .eq('gamification_id', user?.id)
                    .eq('experience_id', experience.id)
                    .eq('event_id', experienceParticipant.event_id)
                    .eq('cpf_id', experienceParticipant.cpf_id);

                if (expParticipantsError) {
                    console.error(expParticipantsError);

                    handleMessage({
                        type: 'error',
                        message:
                            'Ha ocurrido un error al registrar tu participación en el juego. Por favor, intenta de nuevo.',
                    });

                    return;
                }
            }
        });

        handleMessage({
            type: 'success',
            message:
                'Se ha registrado tu participación en el juego. ¡Gracias por jugar!',
        });

        setIsShowResults(true);
    };

    return (
        <section className="w-[90vw] sm:w-[400px] text-white text-center bg-beer-blonde p-4 rounded-lg shadow-lg border-beer-darkGold border-2 bg-opacity-80">
            {isShowResults ? (
                <QuizResults
                    questions={questions}
                    productQuestionMap={productQuestionMap}
                    userAnswers={userAnswers}
                />
            ) : (
                <>
                    <p className="p-8 font-bold text-[20px] text-6xl">
                        {t('score')}: {score}
                    </p>

                    <p className="text-beer-draft  font-bold pb-2 text-[18px]">
                        {t('question')} {currentQuestionIndex + 1} {t('out_of')}{' '}
                        {totalQuestions}
                    </p>

                    {/* Iterar sobre cada producto_id en el objeto mapeado */}
                    {Object.keys(productQuestionMap).map((productId, index) => (
                        <div key={productId}>
                            {/* Opcional: Mostrar alguna referencia al producto, como un título anónimo */}
                            <h2 className="text-black">
                                Producto nº {index + 1}{' '}
                            </h2>
                            <div className="text-black mt-4 font-semibold text-2xl">
                                <QuestionCard
                                    currentQuestionIndex={currentQuestionIndex}
                                    question={
                                        questions[currentQuestionIndex].question
                                    }
                                    answers={
                                        questions[currentQuestionIndex].answers
                                    }
                                    userAnswer={
                                        userAnswers[currentQuestionIndex]
                                    }
                                    correctAnswer={
                                        questions[currentQuestionIndex]
                                            .correct_answer
                                    }
                                    onClick={handleOnAnswerClick}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between mt-16">
                        <Button
                            small
                            accent
                            onClick={() => handleChangeQuestion(-1)}
                        >
                            {t('back')}
                        </Button>
                        <Button
                            small
                            accent
                            onClick={
                                currentQuestionIndex === totalQuestions - 1
                                    ? () => handleSubmitGame()
                                    : () => handleChangeQuestion(1)
                            }
                        >
                            {currentQuestionIndex === totalQuestions - 1
                                ? t('end')
                                : t('next')}
                        </Button>
                    </div>
                </>
            )}
        </section>
    );
}
