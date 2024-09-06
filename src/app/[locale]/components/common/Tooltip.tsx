'use client';

import React, { ReactNode, useEffect, useState } from 'react';

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
    direction,
    delay,
    width: w,
}: Props) {
    let timeout: any;

    const [active, setActive] = useState(false);

    const [width, setWidth] = useState<number | string>(0);
    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true);
        }, delay || 400);
    };

    const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
    };

    useEffect(() => {
        if (w) setWidth(w);
    }, [w]);

    return (
        <section
            className={`Tooltip-Wrapper align-items relative inline-block ${
                active ? '' : 'opacity-100'
            }`}
            // When to show the tooltip
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
        >
            {/* Wrapping */}
            {children}
            <div
                style={{
                    width: `${
                        typeof width === 'string' ? `${width}` : `${width}px`
                    } `,
                }}
                className={`Tooltip-Tip 
                ${!active ? 'hidden' : ' transition-2'}
                ${direction === 'top' ? 'bottom-[150%]' : ''} 
                ${direction === 'bottom' ? 'top-[150%]' : ''} 
                ${direction === 'left' ? '-left-[0%] -top-[100%]' : ''}
                ${
                    direction === 'right' ? 'left-[25%] -top-[100%]' : ''
                } absolute
                    left-1/2 z-50 flex -translate-x-1/2 transform items-center justify-center rounded-lg bg-beer-draft px-4 py-3 text-sm leading-tight shadow-lg `}
            >
                {/* Content */}
                <dfn className="break-words text-beer-foam">{content}</dfn>
            </div>
        </section>
    );
}
