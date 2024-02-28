import Button from '../common/Button';
import QuizAnswer from './QuizAnswer';
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  IBeerMasterQuestion,
  IBMExperienceParticipants,
} from '../../../../lib/types';
import { DisplayInputError } from '../common/DisplayInputError';

interface Props {
  totalQuestion: number;
  question: IBeerMasterQuestion;
  indexQuestion: number;
  setIndexQuestion: (index: number) => void;
  form: UseFormReturn<any, any>;
  experienceParticipant: IBMExperienceParticipants;
}

export default function QuizQuestion({
  totalQuestion,
  question,
  indexQuestion,
  setIndexQuestion,
  form,
  experienceParticipant,
}: Props) {
  const {
    trigger,
    formState: { errors },
  } = form;

  const [selectAnswerIndex, setSelectAnswerIndex] = useState(0);
  const [activeResults, setActiveResults] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onNextQuestion = () => {
    trigger().then((isValid) => {
      if (isValid) {
        setIndexQuestion(indexQuestion + 1);
        setSelectAnswerIndex(0);
        setQuestionAnswered(false);
      }
    });
  };

  const onPrevQuestion = () => {
    setIndexQuestion(indexQuestion - 1);
    setSelectAnswerIndex(0);
    setQuestionAnswered(false);
  };

  return (
    <section className="bg-beer-softFoam p-4 shadow-xl rounded-md w-fit">
      <div className="flex flex-col space-y-4 shadow-md  shadow-slate-300 w-[600px] h-fit p-10 rounded-lg">
        <div className="flex justify-between">
          <span className="text-xl font-bold">
            {/* Número de pregunta actual y Número de preguntas totales */}
            {indexQuestion + 1} / {totalQuestion}
          </span>
          <div>
            <span className="font-semibold">Dificultad: </span>
            <span className="font-bold">
              {/* La dificultad de la pregunta */}
              {question.difficulty}
            </span>
          </div>
        </div>

        {errors['question'] && (
          <DisplayInputError message={'errors.input_required'} />
        )}

        <div>
          <h1 className="font-bold">{question.question}</h1>
        </div>

        {/* Las respuestas aquí */}
        <div className="grid grid-cols-2 gap-5">
          {/* Mapeamos un arreglo de respuesta correcta y respuestas incorrectas */}
          {question.answers.map((answer, index) => {
            return (
              <div id={answer.id}>
                <QuizAnswer
                  question={question}
                  answer={answer}
                  indexAnswer={index}
                  indexQuestion={indexQuestion}
                  selectIndexAnswer={selectAnswerIndex}
                  questionAnswered={questionAnswered}
                  form={form}
                  experienceParticipant={experienceParticipant}
                />
              </div>
            );
          })}
        </div>

        <section className="grid grid-cols-2 gap-4 ">
          {/* Si es la primera primera pregunta, no mostrar el botón */}
          {indexQuestion > 0 && (
            <Button accent onClick={onPrevQuestion}>
              Pregunta Anterior
            </Button>
          )}

          {/* Si no es la última pregunta, mostrar el botón de siguiente pregunta */}
          {indexQuestion + 1 < totalQuestion && (
            <Button class="" onClick={onNextQuestion} primary>
              Siguiente Pregunta
            </Button>
          )}

          {/* Condicional para mostrar el botón de siguiente pregunta o el de finalizar */}
          {indexQuestion + 1 === totalQuestion && (
            <Button
              primary
              onClick={() => {
                setQuestionAnswered(false);
                setActiveResults(true);
              }}
            >
              Finalizar
            </Button>
          )}
        </section>
      </div>
    </section>
  );
}
