import StepQuestionEditor from './StepQuestionEditor';
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { IStep } from '@/lib/types/beerMasterGame';

interface StepDetailsProps {
    step: IStep;
    onClose: () => void;
    onSave: (updatedStep: IStep) => void;
}

export default function StepDetails({
    step,
    onClose,
    onSave,
}: StepDetailsProps) {
    const [editedStep, setEditedStep] = useState(step);
    const [activeTab, setActiveTab] = useState('basic');

    const handleSave = () => {
        onSave(editedStep);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Editar Paso {step.step_number}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                        >
                            <Save className="w-4 h-4" />
                            <span>Guardar</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`px-6 py-3 font-medium ${
                            activeTab === 'basic'
                                ? 'text-amber-600 border-b-2 border-amber-500'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Información Básica
                    </button>
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`px-6 py-3 font-medium ${
                            activeTab === 'questions'
                                ? 'text-amber-600 border-b-2 border-amber-500'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Preguntas
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
                    {activeTab === 'basic' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre del Paso
                                </label>
                                <input
                                    type="text"
                                    value={editedStep.title}
                                    onChange={(e) =>
                                        setEditedStep({
                                            ...editedStep,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={editedStep.description}
                                    onChange={(e) =>
                                        setEditedStep({
                                            ...editedStep,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ubicación
                                </label>
                                <input
                                    type="text"
                                    value={editedStep.location}
                                    onChange={(e) =>
                                        setEditedStep({
                                            ...editedStep,
                                            location: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={!editedStep.is_unlocked}
                                    onChange={(e) =>
                                        setEditedStep({
                                            ...editedStep,
                                            is_unlocked: !e.target.checked,
                                        })
                                    }
                                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                />
                                <label className="text-sm text-gray-700">
                                    Paso bloqueado inicialmente
                                </label>
                            </div>
                        </div>
                    ) : (
                        <StepQuestionEditor
                            questions={editedStep.bm_steps_questions || []}
                            onChange={(questions) =>
                                setEditedStep({
                                    ...editedStep,
                                    bm_steps_questions: questions,
                                })
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
