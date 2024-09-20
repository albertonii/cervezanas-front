import React from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from './IconButton';

interface Props {
    onClick?: () => void;
}

export function EditButton({ onClick }: Props) {
    return (
        <IconButton
            box
            primary
            classContainer="py-2"
            icon={faEdit}
            color={{ filled: '#fefefe', unfilled: '#fefefe' }}
            onClick={onClick}
            title={'Edit this item'}
        ></IconButton>
    );
}
