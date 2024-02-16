import Spinner from '../../../../components/common/Spinner';
import ExperienceAccordionItem from './ExperienceAccordionItem ';
import React from 'react';
import { ICPFixed, ICPMobile, IExperience } from '../../../../../../lib/types';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  experiences: IExperience[];
  form: UseFormReturn<any, any>;
  experienceItems?: string[];
  cpsMobile: ICPMobile[];
  cpsFixed: ICPFixed[];
}

const ExperienceAccordion: React.FC<Props> = ({
  experiences,
  form,
  experienceItems,
  cpsMobile,
  cpsFixed,
}) => {
  if (!experiences || experiences.length === 0) {
    return <div>No experiences found.</div>;
  }

  if (experiences.length === 0) {
    return <Spinner color="beer-blonde" size="xLarge" absolute center />;
  }

  return (
    <section
      className="w-full"
      id={`accordion-collapse`}
      data-accordion="collapse"
    >
      {experiences.map((experience, index) => (
        <li key={experience.id} className="">
          <ExperienceAccordionItem
            experience={experience}
            form={form}
            experienceItems={experienceItems}
            cpsMobile={cpsMobile}
            cpsFixed={cpsFixed}
            index={index}
          />
        </li>
      ))}
    </section>
  );
};

export default ExperienceAccordion;
