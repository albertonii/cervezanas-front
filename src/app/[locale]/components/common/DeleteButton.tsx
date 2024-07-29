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
            box
            danger
            icon={faTrash}
            color={{ filled: '#fefefe', unfilled: '#fefefe' }}
            onClick={onClick}
            title={t('delete')}
        ></IconButton>
    );
}
