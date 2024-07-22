import React from 'react';
import { IEventExperience } from '@/lib/types/types';
import EventExperienceDetails from './EventExperienceDetails';

interface Props {
    eventExperiences: IEventExperience[];
}

export default function EventExperiences({ eventExperiences }: Props) {
    return (
        <section className="w-fit grid-cols-1 sm:w-full grid sm:grid-cols-2 gap-2">
            {eventExperiences.map((experience) => {
                return (
                    <div className="col-span-1">
                        <EventExperienceDetails eventExperience={experience} />
                    </div>
                );
            })}
        </section>
    );
}
