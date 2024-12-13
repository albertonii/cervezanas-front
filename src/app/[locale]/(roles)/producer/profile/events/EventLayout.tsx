'use client';

import Events from './(producer_events)/Events';
import HorizontalMenuEvent from './HorizontalMenuEvent';
import CervezanasEvents from './(cp_event_cervezanas)/CervezanasEvents';
import React, { useState } from 'react';
import { EventOption } from '@/lib//enums';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';

interface Props {
    cps: IConsumptionPoint[];
    counter: number;
}

export default function EventLayout({ cps, counter }: Props) {
    const [menuOption, setMenuOption] = useState<string>(EventOption.EVENTS);

    const renderSwitch = () => {
        switch (menuOption) {
            case EventOption.EVENTS:
                return <Events cps={cps} counter={counter} />;
            case EventOption.CERVEZANAS_EVENT:
                return <CervezanasEvents counter={counter} />;

            default:
                return <></>;
        }
    };

    return (
        <section className="space-y-4 px-0 py-1 lg:container sm:px-6 sm:py-4">
            <HorizontalMenuEvent setMenuOption={setMenuOption} />

            {renderSwitch()}
        </section>
    );
}
