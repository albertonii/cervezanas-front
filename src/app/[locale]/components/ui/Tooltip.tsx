'use client';

import React, { ReactNode, useEffect, useState, useRef } from 'react';

interface Props {
    children: ReactNode;
    content: ReactNode;
    direction?: 'top' | 'bottom' | 'left' | 'right';
    delay: number;
    width?: number | string;
}

export function Tooltip({
    children,
    content,
    direction = 'top',
    delay,
    width: w,
}: Props) {
    let timeout: any;

    const [active, setActive] = useState(false);
    const [width, setWidth] = useState<number | string>(0);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true);
        }, delay || 400);
    };

    const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
    };

    const adjustTooltipPosition = () => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
            const rect = tooltip.getBoundingClientRect();
            const newStyles: React.CSSProperties = {};

            if (rect.right > window.innerWidth) {
                newStyles.left = `-${rect.right - window.innerWidth}px`;
            }
            if (rect.left < 0) {
                newStyles.left = `${-rect.left}px`;
            }
            if (rect.bottom > window.innerHeight) {
                newStyles.top = `-${rect.bottom - window.innerHeight}px`;
            }
            if (rect.top < 0) {
                newStyles.top = `${-rect.top}px`;
            }

            Object.assign(tooltip.style, newStyles);
        }
    };

    useEffect(() => {
        if (w) setWidth(w);
    }, [w]);

    useEffect(() => {
        if (active) {
            adjustTooltipPosition();
        }
    }, [active]);

    return (
        <section
            data-tooltip={content}
            id="wrapper-tooltip"
            className={`align-items relative inline-block ${
                active ? '' : 'opacity-100'
            }`}
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
        >
            {children}
            <div
                ref={tooltipRef}
                style={{
                    width: `${
                        typeof width === 'string' ? `${width}` : `${width}px`
                    }`,
                }}
                className={`Tooltip-Tip 
                ${!active ? 'hidden' : 'transition-2'}
                ${direction === 'top' ? 'bottom-[150%]' : ''} 
                ${direction === 'bottom' ? 'top-[150%]' : ''} 
                ${direction === 'left' ? '-left-[0%] -top-[100%]' : ''}
                ${direction === 'right' ? 'left-[25%] -top-[100%]' : ''}
                absolute left-1/2 z-50 flex -translate-x-1/2 transform items-center justify-center rounded-lg bg-beer-draft px-4 py-3 text-sm leading-tight shadow-lg`}
            >
                <dfn className="break-words text-beer-foam">{content}</dfn>
            </div>
        </section>
    );
}
