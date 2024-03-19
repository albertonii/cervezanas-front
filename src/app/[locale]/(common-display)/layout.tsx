import React from 'react';

type LayoutProps = {
    children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
    return (
        <section className="container mx-auto pt-20 mt-20 sm:mt-0 flex h-full w-full transform items-center justify-between transition lg:flex-wrap bg-[url('/assets/lupulo-horizontal.png')] bg-cover bg-no-repeat bg-left">
            {children}
        </section>
    );
}
