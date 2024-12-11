import Spinner from '@/app/[locale]/components/ui/Spinner';
import ExperienceAccordionItem from './ExperienceAccordionItem ';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IExperience } from '@/lib/types/types';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';

interface Props {
    experiences: IExperience[];
    form: UseFormReturn<any, any>;
    experienceItems?: string[];
    cps: IConsumptionPoint[];
}

const ExperienceAccordion: React.FC<Props> = ({
    experiences,
    form,
    experienceItems,
    cps,
}) => {
    if (!experiences || experiences.length === 0) {
        return <div>No experiences found.</div>;
    }

    if (experiences.length === 0) {
        return (
            <Spinner
                color="beer-blonde"
                size="xLarge"
                absolute
                absolutePosition="center"
            />
        );
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
                        cps={cps}
                        index={index}
                    />
                </li>
            ))}
        </section>
    );
};

export default ExperienceAccordion;
