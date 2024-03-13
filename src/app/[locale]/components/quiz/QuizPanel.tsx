import React from 'react';
import { z, ZodType } from 'zod';
import { IBMExperienceUserResponseFormData } from '../../../../lib/types/types';
import {
  IBMExperienceParticipants,
  IExperience,
  QuestionsState,
} from '../../../../lib/types/quiz';
import { useRouter } from 'next/navigation';
import QuestionCard from './QuestionCard';
import Button from '../common/Button';
import { useTranslations } from 'next-intl';

type QuizFormData = {
  answers: IBMExperienceUserResponseFormData[];
};

const quizSchema: ZodType<QuizFormData> = z.object({
  answers: z.array(
    z.object({
      question_id: z.string().nonempty({ message: 'errors.input_required' }),
      answer_id: z.string().nonempty({ message: 'errors.input_required' }),
      participation_id: z
        .string()
        .nonempty({ message: 'errors.input_required' }),
      is_correct: z.boolean(),
    }),
  ),
});

type QuizValidationSchema = z.infer<typeof quizSchema>;

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [userAnswers, setUserAnswers] = React.useState<Record<number, string>>(
    {},
  );

  const totalQuestions = questions.length;

  const isQuestionAnswered = userAnswers[currentQuestionIndex] ? true : false;

  const router = useRouter();

  const handleOnAnswerClick = (
    answer: string,
    currentQuestionIndex: number,
  ) => {
    // If user has already answered, do nothing
    if (isQuestionAnswered) return;
    // Check answer against correct answer
    const isCorrect = questions[currentQuestionIndex].correct_answer === answer;
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

  return (
    <div className=" text-white text-center bg-beer-softBlondeBubble p-4 rounded-lg shadow-lg border-beer-darkGold border-2">
      <p className="p-8 font-bold text-[20px]">
        {t('score')}: {score}
      </p>
      <p className="text-beer-draft font-bold pb-2 text-[14px]">
        {t('question')} {currentQuestionIndex + 1} {t('out_of')}{' '}
        {totalQuestions}
      </p>

      <QuestionCard
        currentQuestionIndex={currentQuestionIndex}
        question={questions[currentQuestionIndex].question}
        answers={questions[currentQuestionIndex].answers}
        userAnswer={userAnswers[currentQuestionIndex]}
        correctAnswer={questions[currentQuestionIndex].correct_answer}
        onClick={handleOnAnswerClick}
      />
      <div className="flex justify-between mt-16">
        <Button small accent onClick={() => handleChangeQuestion(-1)}>
          {t('back')}
        </Button>
        <Button
          small
          accent
          onClick={
            currentQuestionIndex === totalQuestions - 1
              ? () => router.push('/')
              : () => handleChangeQuestion(1)
          }
        >
          {currentQuestionIndex === totalQuestions - 1 ? t('end') : t('next')}
        </Button>
      </div>
    </div>
  );
}
