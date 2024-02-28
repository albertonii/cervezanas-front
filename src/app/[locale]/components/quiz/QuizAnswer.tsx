import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  IBeerMasterAnswer,
  IBeerMasterQuestion,
  IBMExperienceParticipants,
  IBMExperienceUserResponseFormData,
} from '../../../../lib/types';

interface Props {
  question: IBeerMasterQuestion;
  answer: IBeerMasterAnswer;
  indexAnswer: number;
  indexQuestion: number;
  selectIndexAnswer: number;
  questionAnswered: boolean;
  form: UseFormReturn<any, any>;
  experienceParticipant: IBMExperienceParticipants;
}

export default function QuizAnswer({
  question,
  answer,
  indexAnswer,
  indexQuestion,
  selectIndexAnswer,
  questionAnswered,
  form,
  experienceParticipant,
}: Props) {
  const { control, register, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control,
  });

  const handleChangeAnswer = (answer: IBeerMasterAnswer) => {
    const answerFormData: IBMExperienceUserResponseFormData = {
      question_id: question.id,
      answer_id: answer.id,
      participation_id: experienceParticipant.id,
      is_correct: answer.is_correct,
    };

    setValue(`answers.${indexAnswer}`, answerFormData);
  };

  return (
    <div className="space-x-2">
      <input
        type="radio"
        name={question.question}
        value={answer.id}
        // {...register(
        //   `questions.${indexQuestion}.answers.${indexAnswer}.selected_id`,
        // )}
        className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
        onChange={() => handleChangeAnswer(answer)}
      />
      <label>{answer.answer}</label>
    </div>
  );
}
