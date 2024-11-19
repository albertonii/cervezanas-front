import React, { useState } from 'react';
import { Gift, Plus, Trash2, X } from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'merchandise' | 'experience' | 'discount';
  condition: {
    stepId: string;
    correctAnswers: number;
    totalQuestions: number;
  };
  claimLocation: string;
}

interface RewardFormData {
  name: string;
  description: string;
  type: 'merchandise' | 'experience' | 'discount';
  stepId: string;
  correctAnswers: number;
  claimLocation: string;
}

export default function RewardsManager() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<RewardFormData>({
    name: '',
    description: '',
    type: 'merchandise',
    stepId: '',
    correctAnswers: 1,
    claimLocation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReward: Reward = {
      id: `reward-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      condition: {
        stepId: formData.stepId,
        correctAnswers: formData.correctAnswers,
        totalQuestions: 3 // This would come from the selected step
      },
      claimLocation: formData.claimLocation
    };

    setRewards([...rewards, newReward]);
    setShowAddForm(false);
    setFormData({
      name: '',
      description: '',
      type: 'merchandise',
      stepId: '',
      correctAnswers: 1,
      claimLocation: ''
    });
  };

  const handleDelete = (rewardId: string) => {
    setRewards(rewards.filter(reward => reward.id !== rewardId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Recompensas</h2>
          <p className="text-gray-600 mt-1">
            Configura las recompensas que los participantes pueden ganar
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Recompensa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Gift className="w-6 h-6 text-amber-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{reward.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      reward.type === 'merchandise' ? 'bg-blue-100 text-blue-800' :
                      reward.type === 'experience' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {reward.type}
                    </span>
                    <span className="text-gray-500">
                      Paso {reward.condition.stepId} • 
                      {reward.condition.correctAnswers}/{reward.condition.totalQuestions} respuestas
                    </span>
                    <span className="text-gray-500">
                      Reclamar en: {reward.claimLocation}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(reward.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nueva Recompensa</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Recompensa
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Recompensa
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'merchandise' | 'experience' | 'discount' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="merchandise">Merchandising</option>
                  <option value="experience">Experiencia</option>
                  <option value="discount">Descuento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paso Vinculado
                </label>
                <select
                  value={formData.stepId}
                  onChange={(e) => setFormData({ ...formData, stepId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecciona un paso</option>
                  <option value="1">Paso 1: Los Orígenes</option>
                  <option value="2">Paso 2: El Arte del Malteado</option>
                  <option value="3">Paso 3: Lúpulos del Mundo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Respuestas Correctas Necesarias
                </label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={formData.correctAnswers}
                  onChange={(e) => setFormData({ ...formData, correctAnswers: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Número de respuestas correctas necesarias para obtener la recompensa
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación de Recogida
                </label>
                <input
                  type="text"
                  value={formData.claimLocation}
                  onChange={(e) => setFormData({ ...formData, claimLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  placeholder="ej. Stand Principal BBF"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                >
                  Guardar Recompensa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}