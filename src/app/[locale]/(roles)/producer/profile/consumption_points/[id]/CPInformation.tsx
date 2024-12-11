import React from 'react';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';
import {
    MapPin,
    Calendar,
    Clock,
    Phone,
    Mail,
    User,
    Users,
    Info,
    Store,
} from 'lucide-react';

interface Props {
    cp: IConsumptionPoint;
}

const CPInformation = ({ cp }: Props) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header con logo e información principal */}
            <div className="relative h-48 bg-gradient-to-r from-beer-blonde to-beer-gold">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center space-x-4">
                        {cp.logo_url && (
                            <img
                                src={cp.logo_url}
                                alt={cp.cp_name}
                                className="w-20 h-20 rounded-lg border-4 border-white shadow-lg object-cover"
                            />
                        )}
                        <div>
                            <h1 className="text-3xl font-bold">{cp.cp_name}</h1>
                            <p className="text-lg opacity-90">
                                {cp.cp_description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información detallada */}
            <div className="p-6 space-y-6">
                {/* Estado y capacidad */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Store className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Estado:</span>
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${
                                cp.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                            {cp.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Capacidad máxima:</span>
                        <span>{cp.maximum_capacity} personas</span>
                    </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                        <h3 className="font-medium text-blue-800">Ubicación</h3>
                        <p className="text-blue-700">{cp.address}</p>
                    </div>
                </div>

                {/* Información del organizador */}
                <div className="border rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Información del Organizador
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Nombre completo</p>
                            <p className="font-medium">
                                {cp.organizer_name} {cp.organizer_lastname}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Tipo de organizador</p>
                            <p className="font-medium">
                                {cp.is_internal_organizer
                                    ? 'Interno'
                                    : 'Externo'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a
                                href={`mailto:${cp.organizer_email}`}
                                className="text-blue-600 hover:underline"
                            >
                                {cp.organizer_email}
                            </a>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <a
                                href={`tel:${cp.organizer_phone}`}
                                className="text-blue-600 hover:underline"
                            >
                                {cp.organizer_phone}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                {cp.is_booking_required && (
                    <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                        <Info className="w-5 h-5 text-yellow-600 mt-1" />
                        <div>
                            <h3 className="font-medium text-yellow-800">
                                Reserva requerida
                            </h3>
                            <p className="text-yellow-700">
                                Este punto de consumo requiere reserva previa
                                para acceder.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CPInformation;
