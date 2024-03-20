// Helpers
import { getBGColor } from './helpers';

type Props = {
    currentQuestionIndex: number;
    question: string;
    answers: string[];
    userAnswer: string | undefined;
    correctAnswer: string;
    onClick: (answer: string, currentQuestionIndex: number) => void;
};

const QuestionCard: React.FC<Props> = ({
    currentQuestionIndex,
    question,
    answers,
    userAnswer,
    onClick,
    correctAnswer,
}) => {
    return (
        <div className="w-full">
            <p
                className="text-[18px] sm:text-[20px] "
                dangerouslySetInnerHTML={{ __html: question }}
            />
            <div className="flex flex-col items-center pt-8">
                {answers.map((answer) => (
                    <div
                        key={answer}
                        onClick={() => onClick(answer, currentQuestionIndex)}
                        className={`${getBGColor(
                            userAnswer,
                            correctAnswer,
                            answer,
                        )} text-[18px] sm:text-[24px] cursor-pointer flex items-center justify-center select-none font-bold min-h-[45px] max-w-[400] w-full my-2 rounded-[10px]`}
                    >
                        <span
                            className="truncate"
                            dangerouslySetInnerHTML={{ __html: answer }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;
