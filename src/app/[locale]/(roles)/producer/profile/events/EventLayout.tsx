'use client';

import React, { useState } from 'react';
import { EventOption } from '../../../../../../lib/enums';
import { ICPFixed, ICPMobile } from '../../../../../../lib/types/types';
import CervezanasEvents from './CervezanasEvents';
import Events from './Events';
import HorizontalMenuEvent from './HorizontalMenuEvent';

interface Props {
    cpsMobile: ICPMobile[];
    cpsFixed: ICPFixed[];
    counter: number;
}

export default function EventLayout({ cpsMobile, cpsFixed, counter }: Props) {
    const [menuOption, setMenuOption] = useState<string>(
        EventOption.CERVEZANAS_EVENT,
    );

    const renderSwitch = () => {
        switch (menuOption) {
            case EventOption.CERVEZANAS_EVENT:
                return (
                    <CervezanasEvents
                        cpsMobile={cpsMobile}
                        cpsFixed={cpsFixed}
                        counter={counter}
                    />
                );

            case EventOption.EVENT:
                return (
                    <Events
                        cpsMobile={cpsMobile}
                        cpsFixed={cpsFixed}
                        counter={counter}
                    />
                );

            default:
                return <></>;
        }
    };

    return (
        <section className="space-y-4 px-1 py-1 lg:container sm:px-6 sm:py-4">
            <HorizontalMenuEvent setMenuOption={setMenuOption} />

            {renderSwitch()}
        </section>
    );
}
