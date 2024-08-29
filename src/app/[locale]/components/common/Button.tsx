import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useMemo, useState } from 'react';

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
}

const Button = memo(function PaginationFooter({
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
    form, // If set to empty string, the button will not be a submit button
    fullSize = false,
    isLoading = false,
    icon,
    classIcon,
    colorIcon,
}: ButtonProps) {
    const hoverColor = isActive ? 'filled' : 'unfilled';
    const [hoverIconColor, setHoverIconColor] = useState(
        isActive ? 'filled' : 'unfilled',
    );

    const getSizeClass = () => {
        if (small) return 'text-md px-4';
        if (medium) return 'px-1 sm:px-4 text-base';
        if (large) return 'px-2 sm:px-5 text-base sm:text-lg';
        if (xLarge) return 'px-3 sm:px-6 text-lg sm:text-xl';
        if (xxLarge) return 'px-3 sm:px-6 text-xl sm:text-2xl';
        return '';
    };

    const getColorClass = () => {
        if (primary)
            return 'border-2 border-beer-blonde bg-beer-softBlonde hover:bg-beer-blonde';
        if (accent)
            return 'border-2 border-beer-blonde bg-beer-foam hover:bg-beer-softFoam';
        if (danger) return 'bg-red-500 hover:bg-red-600 dark:bg-red-600';
        return 'shrink-0 hover:bg-beer-softBlonde';
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
                className={`${classIcon} `}
                icon={icon}
                style={{ color: getColor() }}
                onMouseEnter={() => setHoverIconColor('filled')}
                onMouseLeave={() => setHoverIconColor('unfilled')}
                title={'icon_title'}
                color={hoverColor}
            />
        );
    }, [classIcon, colorIcon?.filled, colorIcon?.unfilled, icon, isActive]);

    return (
        <button
            disabled={disabled || isLoading}
            type={getButtonType()}
            onClick={onClick}
            color={hoverColor}
            form={form}
            className={`
                inline-flex items-center justify-center rounded-md transition duration-200 ease-in-out
                dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:border-gray-600 dark:bg-gray-700
                ${getSizeClass()}
                ${getColorClass()}
                ${box ? 'h-auto w-10' : ''}
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${fullSize ? 'w-full' : ''}
                ${isLoading ? 'opacity-75' : ''}
                ${className}
            `}
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
});

export default Button;
