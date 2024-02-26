import React from 'react';
import { IEventExperience } from '../../../../../../../../../lib/types';
import EventExperienceDetails from './EventExperienceDetails';

interface Props {
  eventExperiences: IEventExperience[];
}

export default function EventExperiences({ eventExperiences }: Props) {
  return (
    <section className="w-fit sm:max-w-lg max-w-md">
      {eventExperiences.map((experience) => {
        return <EventExperienceDetails eventExperience={experience} />;
      })}
    </section>
  );
}
