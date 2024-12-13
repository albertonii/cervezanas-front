// DecreaseButton.tsx
import React from 'react';
import Button from './Button';

interface Props {
    onClick?: () => void;
}

export function DecreaseButton({ onClick }: Props) {
    return (
        <Button
            box
            accent
            onClick={onClick}
            class="px-2 py-1 text-sm sm:px-2 sm:py-1"
        >
            -
        </Button>
    );
}
