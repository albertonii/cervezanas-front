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
            <h1 className="font-semibold text-xl">Resultados</h1>

            <p>
                Has acertado {totalCorrectAnswers} preguntas de un total{' '}
                {questions.length}
            </p>

            {Object.keys(productQuestionMap).map((productId, index) => (
                <div key={productId}>
                    <p>Producto nº {index + 1} is:</p>

                    <h2 className="cursor-pointer font-semibold text-beer-draft hover:text-beer-darkGold">
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

            <p>Respuestas correctas</p>

            <ul>
                {questions.map((question, index) => (
                    <li key={index} className={``}>
                        {question.question} - {question.correct_answer}
                    </li>
                ))}
            </ul>
        </div>
    );
}
