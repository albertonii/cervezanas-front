// DeleteButton.tsx
import React, { ComponentProps } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from './IconButton';
import { useTranslations } from 'next-intl';

interface Props {
    onClick?: ComponentProps<any>;
}

export function DeleteButton({ onClick }: Props) {
    const t = useTranslations();

    return (
        <IconButton
            danger
            icon={faTrash}
            color={{ filled: '#fefefe', unfilled: '#fefefe' }}
            onClick={onClick}
            title={t('delete')}
            classContainer="p-1 text-sm sm:p-1"
            size="small"
        />
    );
}
