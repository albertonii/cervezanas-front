import DifficultySelector from './DifficultySelector';
import React from 'react';
import { IQuestion } from '@/lib/types/beerMasterGame';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

// interface Question {
//     id: string;
//     text: string;
//     options: string[];
//     correctAnswer: number;
//     explanation?: string;
//     difficulty: 'fácil' | 'medio' | 'difícil';
//     points: number;
// }

interface StepQuestionEditorProps {
    questions: IQuestion[];
    onChange: (questions: IQuestion[]) => void;
}

export default function StepQuestionEditor({
    questions,
    onChange,
}: StepQuestionEditorProps) {
    const addQuestion = () => {
        const newQuestion: IQuestion = {
            id: `q-${Date.now()}`,
            text: '',
            options: ['', '', '', ''],
            correct_answer: 0,
            difficulty: 'medio',
            points: 150,
            created_at: '',
            bm_step_id: '',
        };
        onChange([...questions, newQuestion]);
    };

    const updateQuestion = (
        index: number,
        field: keyof IQuestion,
        value: any,
    ) => {
        const updatedQuestions = questions.map((q, i) =>
            i === index ? { ...q, [field]: value } : q,
        );
        onChange(updatedQuestions);
    };

    const updateOption = (
        questionIndex: number,
        optionIndex: number,
        value: string,
    ) => {
        const updatedQuestions = questions.map((q, i) => {
            if (i === questionIndex) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        });
        onChange(updatedQuestions);
    };

    const removeQuestion = (index: number) => {
        onChange(questions.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                    Preguntas del Paso
                </h3>
                <button
                    onClick={addQuestion}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Pregunta</span>
                </button>
            </div>

            <div className="space-y-8">
                {questions.map((question, questionIndex) => (
                    <div
                        key={question.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
                    >
                        <div className="flex justify-between items-start">
                            <h4 className="text-lg font-medium text-gray-900">
                                Pregunta {questionIndex + 1}
                            </h4>
                            <button
                                onClick={() => removeQuestion(questionIndex)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pregunta
                                </label>
                                <input
                                    type="text"
                                    value={question.text}
                                    onChange={(e) =>
                                        updateQuestion(
                                            questionIndex,
                                            'text',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Escribe la pregunta..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dificultad
                                    </label>
                                    <DifficultySelector
                                        value={question.difficulty}
                                        onChange={(value) =>
                                            updateQuestion(
                                                questionIndex,
                                                'difficulty',
                                                value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Puntos
                                    </label>
                                    <input
                                        type="number"
                                        value={question.points}
                                        onChange={(e) =>
                                            updateQuestion(
                                                questionIndex,
                                                'points',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        min="50"
                                        step="50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opciones
                                </label>
                                <div className="space-y-2">
                                    {question.options.map(
                                        (option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`correct-${question.id}`}
                                                    checked={
                                                        question.correct_answer ===
                                                        optionIndex
                                                    }
                                                    onChange={() =>
                                                        updateQuestion(
                                                            questionIndex,
                                                            'correct_answer',
                                                            optionIndex,
                                                        )
                                                    }
                                                    className="text-amber-500 focus:ring-amber-500"
                                                />
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) =>
                                                        updateOption(
                                                            questionIndex,
                                                            optionIndex,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                                    placeholder={`Opción ${
                                                        optionIndex + 1
                                                    }`}
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Explicación
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={question.explanation || ''}
                                        onChange={(e) =>
                                            updateQuestion(
                                                questionIndex,
                                                'explanation',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        rows={2}
                                        placeholder="Explica por qué esta es la respuesta correcta..."
                                    />
                                    <AlertCircle className="absolute right-2 top-2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
