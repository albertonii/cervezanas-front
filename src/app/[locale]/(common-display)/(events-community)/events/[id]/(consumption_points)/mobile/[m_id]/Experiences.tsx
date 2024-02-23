import React from 'react';
import { IExperience } from '../../../../../../../../../lib/types';

interface Props {
  experience: IExperience;
}

export default function Experiences({ experience }: Props) {
  console.log(experience);
  return (
    <section>
      <div>Tipo de experiencia: {experience.type}</div>

      <div>Nombre: {experience.name}</div>
      <div> Descripcioón: {experience.description}</div>
      <div> Precio: {experience.price}</div>
      <div>
        {experience.bm_questions?.map((question) => {
          return (
            <div>
              Pregunta:
              {question.question}
              <div>
                {question.answers?.map((answer) => {
                  return <div>Respuesta: {answer.answer}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
