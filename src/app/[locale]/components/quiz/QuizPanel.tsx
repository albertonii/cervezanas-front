import QuizQuestion from './QuizQuestion';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  IBMExperienceParticipants,
  IBMExperienceUserResponseFormData,
  IExperience,
} from '../../../../lib/types/types';

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
  experience: IExperience;
  experienceParticipant: IBMExperienceParticipants;
}

// Función para barajar las preguntas de cada categoría y también reducirla al número de 5
// const shuffleArray = array => {
// 	const newArray = array.sort(() => Math.random() - 0.5);
// 	return newArray.slice(0, 5);
// };

export default function QuizPanel({
  experience,
  experienceParticipant,
}: Props) {
  // CREAR UN ESTADO PARA LAS PREGUNTAS Y RESPUESTAS

  const [indexQuestion, setIndexQuestion] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState(
    experience?.bm_questions ?? [],
  );

  const quizForm = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
  });

  // useEffect(() => {
  //   const newQuestions = shuffleArray(filteredQuestions);
  //   setQuestionsFiltered(newQuestions);
  // }, []);

  const handleQuizSubmit = async (form: QuizValidationSchema) => {
    console.log(form);
  };

  const handleQuizMutation = useMutation({
    mutationKey: 'quiz',
    mutationFn: handleQuizSubmit,
    onSuccess: () => {
      console.info('Mutation success');
    },
    onError: () => {
      console.error('Mutation error');
    },
  });

  const onSubmitQuiz: SubmitHandler<QuizValidationSchema> = (
    formValues: QuizFormData,
  ) => {
    handleQuizMutation.mutate(formValues);
  };

  return (
    <div
      className="container flex flex-col items-center justify-center gap-10"
      // style={{ height: 'calc(100vh - 5rem)' }}
    >
      {experience?.bm_questions?.map((question, index) => {
        return (
          <>
            {
              // Si el índice de la pregunta es igual al índice de la pregunta actual, se muestra la pregunta
              index === indexQuestion && (
                <div id={question.id}>
                  <QuizQuestion
                    totalQuestion={experience.bm_questions?.length ?? 0}
                    question={question}
                    indexQuestion={index}
                    setIndexQuestion={setIndexQuestion}
                    form={quizForm}
                    experienceParticipant={experienceParticipant}
                  />
                </div>
              )
            }
          </>
        );
      })}
    </div>
  );
}
