import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';
import React from 'react';
import { EventOption } from '@/lib//enums';

type Props = {
    setMenuOption: (opt: string) => void;
};

export default function HorizontalMenuEvent({ setMenuOption }: Props) {
    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={[EventOption.EVENTS, EventOption.CERVEZANAS_EVENT]}
            />
        </>
    );
}
