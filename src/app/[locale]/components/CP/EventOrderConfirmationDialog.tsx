import Title from '../ui/Title';
import Label from '../ui/Label';
import Button from '../ui/buttons/Button';
import React from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export function EventOrderConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}: ConfirmationDialogProps) {
    const t = useTranslations('event');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                >
                    <X className="w-5 h-5" />
                </button>

                <Title size="large" font="semibold" color="beer-draft">
                    {title}
                </Title>
                <Label color="gray" className="dark:text-gray-300">
                    {message}
                </Label>

                <div className="flex justify-between space-x-4 mt-4">
                    <Button
                        primary
                        small
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {t('confirm')}
                    </Button>
                    <Button accent small onClick={onClose}>
                        {t('cancel')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
