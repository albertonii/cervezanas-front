import { QuestionsState } from '@/lib//types/quiz';
import { IProduct } from '@/lib//types/types';

export const isAnswerCorrect = (
    userAnswer: string | undefined,
    correctAnswer: string,
) => {
    return userAnswer ? userAnswer === correctAnswer : undefined;
};

export const getBGColor = (
    userAnswer: string | undefined,
    correctAnswer: string,
    answer: string,
): string => {
    const isCorrect = isAnswerCorrect(userAnswer, correctAnswer);

    if (
        (isCorrect === true && answer === userAnswer) ||
        (isCorrect === false && answer === correctAnswer)
    )
        return 'bg-[#55AC78] text-white';

    if (isCorrect === false && answer === userAnswer)
        return 'bg-[#AC5050] text-white';

    return 'bg-white text-beer-draft';
};

export const getProduct = (questions: QuestionsState, productId: string) => {
    const question = questions.find((q) => q.product_id === productId);

    return question?.products as IProduct;
};
