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
    children?: React.ReactNode;
    title: string;
    box?: boolean;
    circular?: boolean;
    danger?: boolean;
    disabled?: boolean;
    primary?: boolean;
    accent?: boolean;
    btnType?: string;
    size?: 'small' | 'medium' | 'large' | 'xLarge' | 'xxLarge' | 'box';
    isLoading?: boolean;
}

export function IconButton({
    icon,
    onClick,
    isActive = false,
    color,
    children,
    classContainer: classNameContainer = '',
    classIcon: classNameIcon = '',
    title,
    box,
    circular,
    danger,
    disabled,
    primary,
    accent,
    btnType,
    size,
    isLoading,
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
                className={classNameIcon}
                icon={icon}
                style={{ color: getColor() }}
                onMouseEnter={() => setHoverColor('filled')}
                onMouseLeave={() => setHoverColor('unfilled')}
                title={title}
                titleId={title}
            />
        );
    }, [classNameIcon, color?.filled, color?.unfilled, icon, isActive, title]);

    const getButtonType = () => {
        switch (btnType) {
            case 'submit':
                return 'submit';
            default:
                return 'button';
        }
    };

    // Ajustar tamaños más pequeños y minimalistas
    const getSizeClass = () => {
        switch (size) {
            case 'box':
                return 'text-xs w-8 h-8';
            case 'small':
                return 'text-xs px-2 py-1';
            case 'medium':
                return 'text-sm px-2 py-1';
            case 'large':
                return 'text-base px-3 py-1';
            case 'xLarge':
                return 'text-lg px-3 py-1';
            case 'xxLarge':
                return 'text-xl px-3 py-2';
            default:
                // Por defecto, algo pequeño para móvil
                return 'text-xs px-2 py-1';
        }
    };

    const getColorClass = () => {
        if (primary)
            return 'bg-beer-gold hover:bg-beer-softBlonde dark:bg-beer-dark dark:bg-beer-draft';
        if (accent) return 'bg-beer-foam hover:bg-beer-softFoam';
        if (danger) return 'bg-red-500 hover:bg-red-600 dark:bg-red-600';
        return 'hover:bg-beer-softBlonde';
    };

    return (
        <button
            type={getButtonType()}
            onClick={onClick}
            color={hoverColor}
            disabled={disabled || isLoading}
            data-testid={title}
            className={`
                flex items-center justify-center rounded border-2 border-beer-blonde dark:border-beer-draft
                transition duration-100 ease-in
                ${box ? 'w-8 h-8' : ''}
                ${
                    circular
                        ? 'bg-red-500 hover:bg-red-600 text-white rounded-full px-2'
                        : ''
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${classNameContainer} 
                ${getColorClass()}
                ${getSizeClass()}
            `}
        >
            {isLoading ? (
                <svg
                    className="animate-spin w-4 h-4 mr-1 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                         3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : (
                <div className="flex items-center space-x-1">
                    {iconButton}
                    {children && (
                        <span className="font-semibold dark:text-gray-300">
                            {children}
                        </span>
                    )}
                </div>
            )}
        </button>
    );
}
