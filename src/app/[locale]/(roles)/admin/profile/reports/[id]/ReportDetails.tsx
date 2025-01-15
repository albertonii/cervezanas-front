'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import Image from 'next/image';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import { downloadFile } from '@/utils/utils';
import { IUserReport } from '@/lib/types/types';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    report: IUserReport;
}

export default function ReportDetails({ report }: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();
    const { handleMessage } = useMessage();

    const [fileBlob, setFileBlob] = useState<Blob | null>(null);
    const [isResolved, setIsResolved] = useState(report.is_resolved);
    const [isLoadingFile, setIsLoadingFile] = useState(false);

    // Descarga del archivo si existe en la propiedad "file"
    useEffect(() => {
        const fetchFile = async () => {
            if (report.file) {
                try {
                    setIsLoadingFile(true);
                    const blob = await downloadFile(
                        supabase,
                        'reports',
                        `reports/${report.file}`,
                    );
                    setFileBlob(blob);
                } catch (error) {
                    console.error('Error fetching file:', error);
                } finally {
                    setIsLoadingFile(false);
                }
            }
        };

        fetchFile();
    }, [report.file, supabase]);

    // Actualizar el campo is_resolved del reporte
    const handleToggleResolved = async () => {
        try {
            const { error } = await supabase
                .from('user_reports')
                .update({ is_resolved: !isResolved })
                .eq('id', report.id);

            if (error) {
                console.error(error);
                handleMessage({
                    type: 'error',
                    message: `${t('errors.updating_report')} — ${
                        error.message
                    }`,
                });
                return;
            }
            setIsResolved((prev) => !prev);

            handleMessage({
                type: 'success',
                message: t('success.report_updated'),
            });
        } catch (error: any) {
            console.error(error);
            handleMessage({
                type: 'error',
                message: `${t('errors.updating_report')}: ${error?.message}`,
            });
        }
    };

    // Función para forzar la descarga del archivo
    const handleDownloadFile = () => {
        if (!fileBlob) return;

        const url = window.URL.createObjectURL(fileBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = report.file ?? 'attachment';
        link.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <section className="mx-auto max-w-3xl p-4 space-y-4 bg-white shadow rounded-md">
            {/* Cabecera */}
            <header className="border-b pb-3">
                <Title size="xlarge" font="bold">
                    {t('report_details')}
                </Title>

                <Label size="medium" color="gray">
                    {/* Podríamos incluir aquí la fecha o el ID del reporte, si se desea */}
                    {t('report_id')}: {report.id}
                </Label>
            </header>

            {/* Sección de Título */}
            <div className="space-y-1">
                <Label size="large" font="bold" color="gray">
                    {t('title')}
                </Label>
                <Label size="small" color="gray">
                    {report.title}
                </Label>
            </div>

            {/* Sección de Descripción */}
            <div className="space-y-1">
                <Label size="large" font="bold" color="gray">
                    {t('description')}
                </Label>
                <Label size="small" color="gray">
                    {report.description}
                </Label>
            </div>

            {/* Sección de Estado */}
            <div className="space-y-1">
                <Label size="large" font="bold" color="gray">
                    {t('status')}
                </Label>
                <Label size="small" color="gray">
                    {isResolved ? t('resolved') : t('pending')}
                </Label>
            </div>

            {/* Sección de Archivo adjunto */}
            {report.file && (
                <div className="space-y-2">
                    <Label size="large" font="bold" color="gray">
                        {t('attached_file')}
                    </Label>

                    {/* Estado de carga */}
                    {isLoadingFile && (
                        <Label size="small" color="gray">
                            {t('loading_file')}...
                        </Label>
                    )}

                    {/* Vista previa si es imagen */}
                    {!isLoadingFile &&
                        fileBlob &&
                        fileBlob.type.startsWith('image/') && (
                            <figure className="relative w-[200px] h-[200px]">
                                <Image
                                    src={URL.createObjectURL(fileBlob)}
                                    alt={report.title}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    sizes="200px"
                                />
                            </figure>
                        )}

                    {/* Botón de descarga para cualquier tipo de archivo */}
                    {!isLoadingFile && fileBlob && (
                        <Button onClick={handleDownloadFile} primary>
                            {t('download_attachment')}
                        </Button>
                    )}
                </div>
            )}

            {/* Botón para marcar como resuelto / pendiente */}
            <div className="pt-3 border-t flex justify-end">
                <Button onClick={handleToggleResolved} primary>
                    {isResolved ? t('mark_as_pending') : t('mark_as_resolved')}
                </Button>
            </div>
        </section>
    );
}
