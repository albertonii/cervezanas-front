import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, Shield } from 'lucide-react';

interface Organizer {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor';
    assignedSteps: number[];
}

export default function OrganizersManager() {
    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingOrganizer, setEditingOrganizer] = useState<Organizer | null>(
        null,
    );

    const roles = {
        admin: {
            label: 'Administrador',
            description: 'Control total sobre la experiencia',
        },
        editor: {
            label: 'Editor',
            description: 'Puede editar pasos asignados',
        },
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Gestión de Organizadores
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Administra los permisos y roles del equipo
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Añadir Organizador</span>
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium">
                    <div className="col-span-3">Nombre</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Rol</div>
                    <div className="col-span-3">Pasos Asignados</div>
                    <div className="col-span-1">Acciones</div>
                </div>

                {organizers.map((organizer) => (
                    <div
                        key={organizer.id}
                        className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center"
                    >
                        <div className="col-span-3">{organizer.name}</div>
                        <div className="col-span-3 text-gray-600">
                            {organizer.email}
                        </div>
                        <div className="col-span-2">
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                    organizer.role === 'admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}
                            >
                                <Shield className="w-3 h-3 mr-1" />
                                {roles[organizer.role].label}
                            </span>
                        </div>
                        <div className="col-span-3">
                            {organizer.role === 'admin' ? (
                                <span className="text-gray-500">
                                    Acceso completo
                                </span>
                            ) : (
                                <span className="text-gray-600">
                                    {organizer.assignedSteps.length > 0
                                        ? `Pasos: ${organizer.assignedSteps.join(
                                              ', ',
                                          )}`
                                        : 'Sin pasos asignados'}
                                </span>
                            )}
                        </div>
                        <div className="col-span-1 flex space-x-2">
                            <button
                                onClick={() => setEditingOrganizer(organizer)}
                                className="text-gray-400 hover:text-amber-500"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setOrganizers(
                                        organizers.filter(
                                            (o) => o.id !== organizer.id,
                                        ),
                                    );
                                }}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {(showAddForm || editingOrganizer) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingOrganizer
                                ? 'Editar Organizador'
                                : 'Añadir Organizador'}
                        </h3>
                        {/* Form implementation */}
                    </div>
                </div>
            )}
        </div>
    );
}
