import React, { useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { IBMExperienceParticipants } from '../../../../lib/types/quiz';
import {
  IBeerMasterAnswer,
  IBeerMasterQuestion,
  IBMExperienceUserResponseFormData,
} from '../../../../lib/types/types';

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
  const { control, register, setValue, getValues, resetField } = form;

  useEffect(() => {
    console.log(getValues(`answers`));
  }, []);

  const handleChangeAnswer = (answer: IBeerMasterAnswer) => {
    const answerFormData: IBMExperienceUserResponseFormData = {
      question_id: question.id,
      answer_id: answer.id,
      participation_id: experienceParticipant.id,
      is_correct: answer.is_correct,
    };

    // setValue(`answers.${indexQuestion}`, answerFormData);
    resetField(`answers.${indexQuestion}-${indexAnswer}`);
    setValue(`answers.${indexQuestion}-${indexAnswer}`, answerFormData);
    // setValue(`answers.${indexAnswer}`, answer);
    console.log('VALUES!', getValues());
  };

  useEffect(() => {
    console.log('VALUES!', getValues());
  }, [getValues]);

  return (
    <div className="space-x-2">
      <input
        type="radio"
        name={question.question}
        value={answer.id}
        // {...register(`questions.${indexQuestion}.answers.${indexAnswer}.id`)}
        className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
        onChange={() => handleChangeAnswer(answer)}
      />
      <label>{answer.answer}</label>
    </div>
  );
}
