import React from 'react';

type LayoutProps = {
    children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
    return (
        <section className="container mx-auto sm:pt-10 flex h-full w-full transform items-center justify-between transition lg:flex-wrap bg-[url('/assets/lupulo-horizontal.png')] bg-contain bg-no-repeat bg-center pb-32">
            {children}
        </section>
    );
}
