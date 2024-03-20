import { useLocale } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { Question, QuestionsState } from '../../../../lib/types/quiz';
import { getProduct } from './helpers';

interface Props {
    questions: QuestionsState;
    productQuestionMap: { [key: string]: Question[] };
    userAnswers: Record<number, string>;
}

export default function results({
    questions,
    productQuestionMap,
    userAnswers,
}: Props) {
    const locale = useLocale();

    // Count total correct answers
    const totalCorrectAnswers = questions.reduce((acc, question, index) => {
        const userAnswer: string = userAnswers[index];
        if (userAnswer === question.correct_answer) {
            return acc + 1;
        }

        return acc;
    }, 0);

    return (
        <div className="w-full">
            <h1 className="font-semibold text-2xl">Resultados</h1>

            <p className="text-xl">
                Has acertado {totalCorrectAnswers} preguntas de un total{' '}
                {questions.length}
            </p>

            {Object.keys(productQuestionMap).map((productId, index) => (
                <div
                    key={productId}
                    className={`flex flex-col border rounded-md bg-beer-draft p-2 my-2`}
                >
                    {/* <p className="text-lg">
                        El producto que has valorado es producto nº {index + 1}:
                    </p> */}
                    <p className="text-lg">Producto Valorado:</p>

                    <h2 className="cursor-pointer text-lg font-semibold text-beer-foam hover:text-beer-gold">
                        <Link
                            target={'_blank'}
                            href={`/products/${
                                getProduct(questions, productId)?.id
                            }`}
                            locale={locale}
                        >
                            {getProduct(questions, productId)?.name}
                        </Link>
                    </h2>
                </div>
            ))}

            <p className="text-lg font-semibold mt-4">Respuestas correctas</p>

            <ul>
                {questions.map((question, index) => (
                    <li
                        key={index}
                        className={`flex flex-col border rounded-md bg-beer-draft p-2 my-2`}
                    >
                        <span className="text-lg">{question.question}</span>
                        <span className="text-lg font-semibold text-green-500">
                            {' '}
                            {question.correct_answer}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
