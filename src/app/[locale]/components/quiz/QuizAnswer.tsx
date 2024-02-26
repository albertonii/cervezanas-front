import React from 'react';
import { IBeerMasterAnswer, IBeerMasterQuestion } from '../../../../lib/types';
import { UseFormReturn, useFieldArray } from 'react-hook-form';

interface Props {
  question: IBeerMasterQuestion;
  answer: IBeerMasterAnswer;
  indexAnswer: number;
  indexQuestion: number;
  selectIndexAnswer: number;
  questionAnswered: boolean;
  form: UseFormReturn<any, any>;
}

export default function QuizAnswer({
  question,
  answer,
  indexAnswer,
  indexQuestion,
  selectIndexAnswer,
  questionAnswered,
  form,
}: Props) {
  const { control, register } = form;

  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control,
  });

  const checkAnswer = (answer: IBeerMasterAnswer, index: number) => {
    // if (answerText === filteredQuestion.correct_answer) {
    //   setScore(score + 1);
    // }
    // setSelectAnswerIndex(index);
    // setAnswered(true);
  };

  return (
    <div className="space-x-2">
      <input
        type="radio"
        // name={question.question}
        value={answer.id}
        {...register(
          `questions.${indexQuestion}.answers.${indexAnswer}.selected_id`,
        )}
        className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
      />
      <label>{answer.answer}</label>
    </div>
  );
}
