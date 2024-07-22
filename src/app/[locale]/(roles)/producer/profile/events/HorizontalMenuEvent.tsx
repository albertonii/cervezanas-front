import React from 'react';
import { EventOption } from '@/lib//enums';
import HorizontalSections from '@/app/[locale]/components/common/HorizontalSections';

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
                tabs={[EventOption.CERVEZANAS_EVENT, EventOption.EVENT]}
            />
        </>
    );
}
