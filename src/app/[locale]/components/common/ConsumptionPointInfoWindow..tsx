// components/ConsumptionPointInfoWindow.tsx
import React from 'react';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { formatDateString } from '@/utils/formatDate';
import { useTranslations } from 'next-intl';
import classNames from 'classnames';

interface InfoWindowProps {
    cp: IConsumptionPointEvent;
    onClose: () => void;
}

const ConsumptionPointInfoWindow: React.FC<InfoWindowProps> = ({
    cp,
    onClose,
}) => {
    const t = useTranslations();

    return (
        <div className="max-w-xs p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            {/* Título */}
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {cp.cp?.cp_name}
            </h2>

            {/* Descripción */}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {cp.cp?.cp_description}
            </p>

            {/* Información Detallada */}
            <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Dirección:</strong> {cp.cp?.address}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Fecha inicio:</strong>{' '}
                    {formatDateString(cp.start_date)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Fecha fin:</strong> {formatDateString(cp.end_date)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>¿Necesario reserva?:</strong>{' '}
                    {cp.cp?.is_booking_required ? 'Sí' : 'No'}
                </p>
            </div>

            {/* Información de Contacto */}
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Contacto
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                    <strong>Nombre:</strong> {cp.cp?.organizer_name}{' '}
                    {cp.cp?.organizer_lastname}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                    <strong>Teléfono:</strong> {cp.cp?.organizer_phone}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                    <strong>Email:</strong> {cp.cp?.organizer_email}
                </p>
            </div>

            {/* Botón de Cierre */}
            <button
                onClick={onClose}
                className="mt-4 w-full px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Cerrar
            </button>
        </div>
    );
};

export default ConsumptionPointInfoWindow;
