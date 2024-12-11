// components/EventExperiences.tsx
import React from 'react';
import { IEventExperience } from '@/lib/types/types';
import EventExperienceDetails from './EventExperienceDetails';

interface Props {
    eventExperiences: IEventExperience[];
}

const EventExperiences: React.FC<Props> = ({ eventExperiences }) => {
    if (eventExperiences.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eventExperiences.map((experience) => (
                <EventExperienceDetails
                    key={experience.id}
                    eventExperience={experience}
                />
            ))}
        </div>
    );
};

export default EventExperiences;
