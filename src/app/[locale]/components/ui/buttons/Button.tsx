// Button.tsx
// Ajustar el tamaño por defecto a algo más pequeño y compacto
// Para pantallas pequeñas, redujimos los tamaños. Asegúrate de que no haya
// paddings excesivos. También puedes ajustar más si lo deseas.

import React, { memo, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    color?: { filled: string; unfilled: string };
    class?: string;
    children?: React.ReactNode;
    title?: string;
    box?: boolean;
    danger?: boolean;
    small?: boolean;
    medium?: boolean;
    large?: boolean;
    xLarge?: boolean;
    xxLarge?: boolean;
    disabled?: boolean;
    primary?: boolean;
    accent?: boolean;
    btnType?: string;
    form?: string;
    fullSize?: boolean;
    isLoading?: boolean;
    icon?: IconDefinition;
    classIcon?: string;
    colorIcon?: { filled: string; unfilled: string };
    warningIfDisabled?: string;
}

const Button = memo(function Button({
    onClick,
    isActive = false,
    children,
    class: className = '',
    box,
    danger = false,
    small = false,
    medium = false,
    large = false,
    xLarge = false,
    xxLarge = false,
    disabled = false,
    primary = false,
    accent = false,
    btnType = '',
    form,
    fullSize = false,
    isLoading = false,
    icon,
    classIcon,
    colorIcon,
    warningIfDisabled,
}: ButtonProps) {
    const hoverColor = isActive ? 'filled' : 'unfilled';
    const [hoverIconColor, setHoverIconColor] = useState(
        isActive ? 'filled' : 'unfilled',
    );

    const getSizeClass = () => {
        // Ajustamos tamaños más pequeños
        if (small) return 'text-xs px-2 py-1';
        if (medium) return 'px-2 py-1 text-sm';
        if (large) return 'px-3 py-1 text-base';
        // Por defecto algo pequeño:
        return 'px-2 py-1 text-xs';
    };

    const getColorClass = () => {
        if (primary)
            return 'border-2 border-beer-blonde bg-beer-softBlonde hover:bg-beer-blonde';
        if (accent)
            return 'border-2 border-beer-blonde bg-beer-foam hover:bg-beer-softFoam';
        if (danger) return 'bg-red-400 hover:bg-red-500 dark:bg-red-600';
        return 'hover:bg-beer-softBlonde';
    };

    const getButtonType = () => {
        switch (btnType) {
            case 'submit':
                return 'submit';
            default:
                return 'button';
        }
    };

    const iconButton = useMemo(() => {
        if (!icon) return null;
        const getColor = () => {
            return isActive ? colorIcon?.filled : colorIcon?.unfilled;
        };

        return (
            <FontAwesomeIcon
                className={`${classIcon}`}
                icon={icon}
                style={{ color: getColor(), marginRight: '0.25rem' }}
                onMouseEnter={() => setHoverIconColor('filled')}
                onMouseLeave={() => setHoverIconColor('unfilled')}
                title={'icon_title'}
                color={hoverColor}
            />
        );
    }, [classIcon, colorIcon, icon, isActive]);

    return (
        <div className="relative">
            <button
                disabled={disabled || isLoading}
                type={getButtonType()}
                onClick={onClick}
                color={hoverColor}
                form={form}
                className={`
                    inline-flex items-center justify-center rounded-md transition duration-200 ease-in-out
                    dark:text-white dark:hover:text-beer-blonde dark:hover:bg-gray-600 dark:border-gray-600 dark:bg-gray-700
                    ${getSizeClass()}
                    ${getColorClass()}
                    ${box ? 'w-8 h-8' : ''}
                    ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                    ${fullSize ? 'w-full' : ''}
                    ${isLoading ? 'opacity-75' : ''}
                    ${className}
                `}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin mr-2 w-4 h-4 text-white"
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
                    <div className="flex items-center">
                        {iconButton && iconButton}
                        {children && <span className="">{children}</span>}
                    </div>
                )}
            </button>
        </div>
    );
});

export default Button;
