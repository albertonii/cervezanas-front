import React, { useState } from 'react';
import { X } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import { IQuestion } from '@/lib/types/beerMasterGame';
import { useTranslations } from 'next-intl';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import Button from '@/app/[locale]/components/ui/buttons/Button';

interface QuestionModalProps {
    question: IQuestion;
    onAnswer: (isCorrect: boolean) => void;
    onClose: () => void;
    totalQuestions: number;
    currentQuestionIndex: number;
    correctAnswers: number;
    isLastQuestion: boolean;
}

export default function QuestionModal({
    question,
    onAnswer,
    onClose,
    totalQuestions,
    currentQuestionIndex,
    correctAnswers,
    isLastQuestion,
}: QuestionModalProps) {
    const t = useTranslations('bm_game');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = () => {
        if (selectedOption !== null && !hasAnswered) {
            const correct = selectedOption === question.correct_answer;
            setIsCorrect(correct);
            setHasAnswered(true);
            setTimeout(() => {
                onAnswer(correct);
                setHasAnswered(false);
                setSelectedOption(null);
            }, 1500);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Title size="large" color="black">
                                {t('question_one_of_x', {
                                    currentQuestionIndex:
                                        currentQuestionIndex + 1,
                                    totalQuestions: totalQuestions,
                                })}
                            </Title>

                            <DifficultyBadge
                                difficulty={question.difficulty}
                                points={question.points}
                            />
                        </div>
                        <Label size="small" color="gray">
                            {t('correct_answers_x', {
                                correctAnswers: correctAnswers,
                            })}
                        </Label>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <Label color="dark-gray">{question.text}</Label>

                <div className="space-y-3 mb-6">
                    {question.options.map((option, index) => (
                        <Button
                            key={index}
                            class={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                hasAnswered
                                    ? index === question.correct_answer
                                        ? 'border-green-500 bg-green-50'
                                        : index === selectedOption
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200'
                                    : selectedOption === index
                                    ? 'border-amber-500 bg-amber-50'
                                    : 'border-gray-200 hover:border-amber-200'
                            }`}
                            onClick={() =>
                                !hasAnswered && setSelectedOption(index)
                            }
                            disabled={hasAnswered}
                        >
                            {option}
                        </Button>
                    ))}
                </div>

                {hasAnswered && (
                    <div
                        className={`mb-4 p-4 rounded-lg ${
                            isCorrect
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        <p className="font-semibold mb-2">
                            {isCorrect
                                ? '¡Correcto!'
                                : 'Incorrecto. La respuesta correcta está marcada en verde.'}
                        </p>
                        {question.explanation && (
                            <p className="text-sm">{question.explanation}</p>
                        )}
                    </div>
                )}

                {isLastQuestion && hasAnswered && (
                    <div className="mb-4 p-4 rounded-lg bg-amber-100 text-amber-800">
                        ¡Has completado este paso! Puntuación final:{' '}
                        {correctAnswers + (isCorrect ? 1 : 0)} de{' '}
                        {totalQuestions}
                    </div>
                )}

                <Button
                    primary
                    large
                    class={`w-full ${
                        selectedOption !== null && !hasAnswered
                            ? 'bg-amber-500 hover:bg-amber-600'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    onClick={handleSubmit}
                    disabled={selectedOption === null || hasAnswered}
                >
                    {t('confirm_answer')}
                </Button>
            </div>
        </div>
    );
}
