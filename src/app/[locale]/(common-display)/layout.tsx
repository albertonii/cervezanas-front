import React from 'react';

type LayoutProps = {
    children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
    return (
        <section
            className="container mx-auto flex h-full w-full transform items-center justify-between transition lg:flex-wrap 
            bg-[url('/assets/home/bg-home.webp')] bg-auto bg-repeat bg-top pb-32 min-h-[700px] max-w-[1540px]
            "
        >
            {children}
        </section>
    );
}
