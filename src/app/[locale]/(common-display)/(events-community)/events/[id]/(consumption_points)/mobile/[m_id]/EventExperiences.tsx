import React from 'react';
import { IEventExperience } from '../../../../../../../../../lib/types';
import EventExperienceDetails from './EventExperienceDetails';

interface Props {
  eventExperiences: IEventExperience[];
}

export default function EventExperiences({ eventExperiences }: Props) {
  return (
    <section className="bg-beer-softFoam p-4 rounded-md shadow-xl">
      {eventExperiences.map((experience) => {
        return <EventExperienceDetails eventExperience={experience} />;
      })}
    </section>
  );
}
