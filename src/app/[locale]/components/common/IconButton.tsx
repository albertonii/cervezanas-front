'use client';

import React, { useMemo, useState } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IconButtonProps {
    icon: IconDefinition;
    onClick?: () => void;
    isActive?: boolean;
    color?: { filled: string; unfilled: string };
    classContainer?: string;
    classIcon?: string;
    classSpanChildren?: string;
    children?: React.ReactNode;
    title: string;
    box?: boolean;
    danger?: boolean;
    disabled?: boolean;
    primary?: boolean;
    accent?: boolean;
    small?: boolean;
    medium?: boolean;
    large?: boolean;
    xLarge?: boolean;
    xxLarge?: boolean;
    btnType?: string;
    isLoading?: boolean;
}

export function IconButton({
    icon,
    onClick,
    isActive,
    color,
    children,
    classContainer,
    classIcon,
    classSpanChildren,
    title,
    box,
    danger = false,
    disabled = false,
    primary = false,
    accent = false,
    small = false,
    medium = false,
    large = false,
    xLarge = false,
    xxLarge = false,
    btnType = '',
    isLoading = false,
}: IconButtonProps) {
    const [hoverColor, setHoverColor] = useState(
        isActive ? 'filled' : 'unfilled',
    );

    const iconButton = useMemo(() => {
        const getColor = () => {
            return isActive ? color?.filled : color?.unfilled;
        };

        return (
            <FontAwesomeIcon
                className={`${classIcon} `}
                icon={icon}
                style={{ color: getColor() }}
                onMouseEnter={() => setHoverColor('filled')}
                onMouseLeave={() => setHoverColor('unfilled')}
                title={title}
                titleId={title}
            />
        );
    }, [classIcon, color?.filled, color?.unfilled, icon, isActive, title]);

    const getButtonType = () => {
        switch (btnType) {
            case 'submit':
                return 'submit';
            default:
                return 'button';
        }
    };

    const getSizeClass = () => {
        if (small) return 'text-md px-4 py-2';
        if (medium) return 'px-4 py-2 text-base';
        if (large) return 'px-5 py-3 text-lg';
        if (xLarge) return 'px-6 py-3 text-xl';
        if (xxLarge) return 'px-6 py-3 text-2xl';
        return '';
    };

    const getColorClass = () => {
        if (primary)
            return 'border-2 border-beer-blonde bg-beer-softBlonde hover:bg-beer-blonde';
        if (accent)
            return 'border-2 border-beer-blonde bg-beer-foam hover:bg-beer-softFoam';
        if (danger) return 'bg-red-500 hover:bg-red-600';
        return 'shrink-0 hover:bg-beer-softBlonde';
    };

    return (
        <button
            disabled={disabled || isLoading}
            type={getButtonType()}
            onClick={onClick}
            color={hoverColor}
            className={`
                inline-flex items-center justify-center rounded-md border transition duration-200 ease-in-out
                ${getSizeClass()}
                ${getColorClass()}
                ${box ? 'h-auto w-10' : ''}
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${classContainer}
            `}
            data-testid={title}
        >
            <span className={`${children ? 'mr-1' : ''} text-bear-dark`}>
                {iconButton}
            </span>
            <span
                className={`text-bear-dark ${danger ? 'text-beer-foam' : ''} 
                ${primary ? 'text-beer-dark' : 'text-beer-dark'} 
                ${accent ? 'text-beer-dark hover:text-beer-dark' : ''} 
                ${classSpanChildren}`}
            >
                {children}
            </span>
        </button>
    );
}
