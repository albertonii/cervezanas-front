'use client';

import Label from '@/app/[locale]/components/ui/Label';
import React from 'react';
import { List, ExternalLink } from 'lucide-react';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
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
import { useTranslations } from 'next-intl';

interface Props {
    cp: IConsumptionPointEvent;
}

const CPEventInformation = ({ cp }: Props) => {
    const t = useTranslations('event');

    const ordersQueueUrl = `/producer/barman/orders_queue_display/${cp.id}`;

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
                        {cp.cp && cp.cp.logo_url && (
                            <img
                                src={cp.cp.logo_url}
                                alt={cp.cp.cp_name}
                                className="w-20 h-20 rounded-lg border-4 border-white shadow-lg object-cover"
                            />
                        )}
                        <div>
                            <h1 className="text-3xl font-bold">
                                {cp.cp?.cp_name}
                            </h1>
                            <p className="text-lg opacity-90">
                                {cp.cp?.cp_description}
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        <a
                            href={ordersQueueUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-beer-gold text-white font-semibold rounded-lg shadow-md hover:bg-beer-darkGold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beer-gold transition-colors"
                        >
                            <List className="w-5 h-5 mr-2" />
                            {t('cp_queue_barman')}
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Información detallada */}
            <div className="p-6 space-y-6 dark:bg-gray-400">
                {/* Estado y capacidad */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-beer-draft">
                    <div className="flex items-center space-x-2">
                        <Store className="w-5 h-5 text-beer-gold" />
                        <Label font="medium">{t('status')}:</Label>

                        <span
                            className={`px-3 py-1 rounded-full text-sm ${
                                cp.cp?.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                            {cp.cp?.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-beer-gold" />
                        <Label font="medium">{t('max_capacity')}:</Label>
                        <span>{cp.cp?.maximum_capacity} personas</span>
                    </div>
                </div>

                {/* Fechas y horarios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-beer-gold mt-1" />
                        <div className="flex flex-col items-start">
                            <Label font="medium">{t('date_start')}</Label>
                            <Label color="gray">
                                {formatDate(cp.start_date)}
                            </Label>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-beer-gold mt-1" />
                        <div className="flex flex-col items-start">
                            <Label font="medium">{t('date_end')}</Label>
                            <Label color="gray">
                                {formatDate(cp.end_date)}
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-start space-x-3 p-4 bg-beer-softFoam rounded-lg dark:bg-beer-draft">
                    <MapPin className="w-5 h-5 text-beer-gold mt-1" />
                    <div className="flex flex-col items-start">
                        <Label size="small" color="beer-blonde" font="semibold">
                            {t('location')}
                        </Label>
                        <Label size="small" color="black">
                            {cp.cp?.address}
                        </Label>
                    </div>
                </div>

                {/* Información del organizador */}
                <div className="border rounded-lg p-4 flex flex-col items-start">
                    <Label size="large" font="semibold">
                        <User className="w-5 h-5 mr-2 text-beer-gold" />

                        {t('organizer_info')}
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="flex gap-4">
                            <Label color="gray">{t('fullname')}</Label>
                            <Label font="medium">
                                {cp.cp?.organizer_name}{' '}
                                {cp.cp?.organizer_lastname}
                            </Label>
                        </div>

                        <div className="flex gap-4">
                            <Label color="gray">Tipo de organizador</Label>
                            <Label font="medium">
                                {cp.cp?.is_internal_organizer
                                    ? 'Interno'
                                    : 'Externo'}
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a
                                href={`mailto:${cp.cp?.organizer_email}`}
                                className="text-beer-gold hover:underline dark:text-beer-softBlonde"
                            >
                                {cp.cp?.organizer_email}
                            </a>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <a
                                href={`tel:${cp.cp?.organizer_phone}`}
                                className="text-beer-gold hover:underline dark:text-beer-softBlonde"
                            >
                                {cp.cp?.organizer_phone}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                {cp.cp?.is_booking_required && (
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

export default CPEventInformation;
