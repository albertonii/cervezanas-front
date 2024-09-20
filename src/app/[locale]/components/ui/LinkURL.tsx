import React from 'react';
import Link from 'next/link';

interface Props {
    href: string;
    children: React.ReactNode;
    className?: string;
    target?: string;
    locale?: string;
}

const LinkURL = ({ href, children, className = '', target, locale }: Props) => {
    return (
        <Link href={href} target={target} locale={locale}>
            <span
                className={`text-medium truncate font-bold text-beer-draft hover:text-beer-blonde transition-all ease-in-out underline ${className}`}
            >
                {children}
            </span>
        </Link>
    );
};

export default LinkURL;
