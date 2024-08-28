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
    danger?: boolean;
    disabled?: boolean;
    primary?: boolean;
    accent?: boolean;
    btnType?: string;
    size?: 'small' | 'medium' | 'large' | 'xLarge' | 'xxLarge';
    isLoading?: boolean;
}

export function IconButton({
    icon,
    onClick,
    isActive,
    color,
    children,
    classContainer: classNameContainer,
    classIcon: classNameIcon,
    title,
    box,
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
                className={`${classNameIcon}`}
                icon={icon}
                style={{ color: getColor() }}
                onMouseEnter={() => setHoverColor('filled')}
                onMouseLeave={() => setHoverColor('unfilled')}
                // onClick={onClick}
                title={title}
                titleId={title}
            />
        );
    }, [
        classNameIcon,
        color?.filled,
        color?.unfilled,
        icon,
        isActive,
        onClick,
        title,
    ]);

    const getButtonType = () => {
        switch (btnType) {
            case 'submit':
                return 'submit';
            default:
                return 'button';
        }
    };

    const getSizeClass = () => {
        if (size === 'small') return 'text-md px-4';
        if (size === 'medium') return 'px-1 sm:px-4 text-base';
        if (size === 'large') return 'px-2 sm:px-5 text-base sm:text-lg';
        if (size === 'xLarge') return 'px-3 sm:px-6 text-lg sm:text-xl';
        if (size === 'xxLarge') return 'px-3 sm:px-6 text-xl sm:text-2xl';
        return '';
    };

    const getColorClass = () => {
        if (primary) return 'bg-beer-softBlonde hover:bg-beer-blonde';
        if (accent) return 'bg-beer-foam hover:bg-beer-softFoam';
        if (danger) return 'bg-red-500 hover:bg-red-600 dark:bg-red-600';
        return 'shrink-0 hover:bg-beer-softBlonde';
    };

    return (
        <button
            type={`${getButtonType()}`}
            onClick={onClick}
            color={hoverColor}
            className={`
                mt-0 flex items-center justify-center rounded border-2 border-beer-blonde p-1 transition duration-100 ease-in
                ${box && 'h-auto w-10'}
                ${disabled && 'cursor-not-allowed opacity-50'}
                ${classNameContainer} 
                ${getColorClass()}
                ${getSizeClass()}
            `}
            data-testid={`${title}`}
        >
            {isLoading ? (
                <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : (
                <div className="">
                    {iconButton ?? (
                        <span className={`text-bear-dark`}>{iconButton}</span>
                    )}

                    <span className={`font-semibold ${getSizeClass()}`}>
                        {children}
                    </span>
                </div>
            )}
        </button>
    );
}
